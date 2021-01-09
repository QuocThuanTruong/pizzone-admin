const {db} = require('../../dal/db')
const bcrypt = require('bcrypt')

function execQuery(queryString) {
    return new Promise(data => {
        /*        console.log(queryString)*/

        db.query(queryString, (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                try {
                    data(results);
                } catch (error) {
                    data({});
                    throw error;
                }
            }
        })
    })
}

exports.getUserById = async (id) => {
    const users =  await execQuery('SELECT * FROM user WHERE user_id = '+ id)
    let user = users[0];

    if (user.is_active === 1) {
        user.active = true;
        user.status = 'Đang hoạt động'
    } else {
        user.active = false;
        user.status = 'Bị khóa'
    }

    if (user.role === 0) {
        user.roleName = 'user'
    } else {
        user.roleName = 'admin'
    }

    return user;
}

exports.getAllAccount = async (page, totalItemPerPage, sortBy) => {
    let sort = '';

    console.log(sortBy)
    switch (sortBy) {
        case '1':
            sort = 'name';
            break;
        case '2':
            sort = 'role';
            break;
    }

    let accounts = await execQuery('SELECT * from user where is_active <> -1 ORDER BY ' + sort + ' LIMIT ' + totalItemPerPage + ' OFFSET ' +((page - 1) * totalItemPerPage))

    return fullUserInfo(accounts);
}

exports.totalAccount = async () => {
    let query = 'SELECT COUNT(user_id) as total FROM user';

    let result = await execQuery(query)

    return result[0].total
}

exports.getAllUser = async () => {
    return await execQuery('SELECT * from user where role = 0 and is_active <> -1')
}

exports.getAllAdmin = async () => {
    return await execQuery('SELECT * from user where role = 1 and is_active <> -1')
}

exports.searchByKeyName = async (keyName, page, totalDishPerPage, sortBy) => {
    let sort = '';
    switch (sortBy) {
        case '1':
            sort = 'name';
            break;
        case '2':
            sort = 'role';
            break;
    }

    let query = 'SELECT * FROM user WHERE MATCH(name) AGAINST(\''+keyName+'\') and is_active <> -1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    let accounts = await execQuery(query)

    return fullUserInfo(accounts);
}

exports.totalResultByKeyName = async (keyName) => {
    let query = 'SELECT COUNT(user_id) as total FROM user WHERE MATCH(name) AGAINST(\''+keyName+'\') and is_active <> -1';

    let result = await execQuery(query);

    return result[0].total
}

exports.modify = (fields, id) => {
    let user_id = id
    let name = fields.name
    let email = fields.email
    let phone = fields.phone
    let address = fields.address

    return {
        user_id: user_id,
        name: name,
        avatar: "",
        email: email,
        phone: phone,
        address: address,
    }
}

exports.getAccountByCategory = async (categoryId, page, totalDishPerPage, sortBy) => {
    let sort = '';
    switch (sortBy) {
        case '1':
            sort = 'name';
            break;
        case '2':
            sort = 'role';
            break;
    }

    let accounts = await execQuery('SELECT * FROM user WHERE is_active = ' + categoryId + '  ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage))

    return fullUserInfo(accounts);
}

exports.totalAccountByCategory = async (categoryId) => {
    let query = 'SELECT COUNT(user_id) as total FROM user WHERE is_active = ' + categoryId;

    let result = await execQuery(query);

    return result[0].total
}

exports.update = async (newUser) => {
    const _ = await execQuery('UPDATE user SET name = \''+newUser.name+'\', avatar = \''+newUser.avatar+'\', email = \''+newUser.email+'\', phone = \''+newUser.phone+'\', address = \''+newUser.address+'\' WHERE user_id = '+newUser.user_id)
}

exports.isExistsUser = async (username) => {
    let result = await execQuery('SELECT EXISTS(SELECT * FROM user WHERE username = \''+username+'\' and is_active = 1) as e')

    return result[0].e;
}

exports.getMaxUserId = async () => {
    const result = await execQuery('SELECT MAX(user_id) as max from user')

    return result[0].max
}

exports.addNewUser = async (username, email, password) => {
    const id = await this.getMaxUserId() + 1

    const _ = await execQuery('INSERT INTO user(user_id, name, avatar, email, phone, username, password, address, role, is_active) values('+ id +', \'\', \'\', \''+ email +'\', \'\', \''+ username +'\', \''+ password +'\', \'\', 0, 1)');
}

exports.changePassword = async (user_id, newPassword) => {
    const _ = await execQuery('UPDATE user SET password = \'' + newPassword + '\' WHERE user_id = ' + user_id)
}

function fullUserInfo(accounts) {
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].is_active === 1) {
            accounts[i].active = true;
            accounts[i].status = 'Đang hoạt động'
        } else {
            accounts[i].active = false;
            accounts[i].status = 'Bị khóa'
        }

        if (accounts[i].role === 0) {
            accounts[i].roleName = 'user'
        } else {
            accounts[i].roleName = 'admin'
        }
    }

    return accounts
}

exports.deleteAccount = async (user_id) => {
    await execQuery('UPDATE user SET is_active = -1 where user_id = ' + user_id);
}

exports.lockAccount = async (user_id) => {
    await execQuery('UPDATE user SET is_active = 0 where user_id = ' + user_id);
}

exports.unlockAccount = async (user_id) => {
    await execQuery('UPDATE user SET is_active = 1 where user_id = ' + user_id);
}