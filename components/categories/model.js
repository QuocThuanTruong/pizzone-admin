const {db} = require('../../dal/db')

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

function fullCategoryInfo(categories) {
    for (let i = 0; i < categories.length; i++) {
        switch (categories[i].is_active) {
            case 0:
                categories[i].categoryStatusActive = 'locked';
                categories[i].status_name_uppercase = '̣ĐANG CHUẨN BỊ';
                break;
            case 1:
                categories[i].categoryStatusActive = 'active';
                categories[i].status_name_uppercase = '̣ĐANG GIAO HÀNG';
                break;
        }
    }

    return categories
}

exports.getAllCategory = async (page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'name asc';
            break;
        case '2':
            sort = 'name desc';
            break;
    }

    let categories = await execQuery('SELECT * from dishes_category where is_active <> -1 ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return fullCategoryInfo(categories)
}

exports.totalCategory = async () => {
    let query = 'SELECT COUNT(category_id) as total FROM dishes_category where is_active <> -1';

    let result = await execQuery(query)

    return result[0].total
}

exports.searchByKeyName = async (keyName, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'name asc';
            break;
        case '2':
            sort = 'name desc';
            break;
    }

    let query = 'SELECT * from dishes_category WHERE MATCH(name) AGAINST(\''+keyName+'\') and is_active <> -1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    let categories = await execQuery(query)

    return fullCategoryInfo(categories)
}

exports.totalResultByKeyName = async (keyName) => {
    keyName = decodeURIComponent(keyName)

    let query = 'SELECT COUNT(*) as total FROM dishes_category WHERE MATCH(name) AGAINST(\''+keyName+'\') and is_active <> -1'

    let result = await execQuery(query);

    return result[0].total
}

exports.deleteCategoryById = async (category_id) => {
    await execQuery('UPDATE dishes_category SET is_active = -1 where category_id = ' + category_id)
}

exports.getMaxCategoryId = async () => {
    const result = await execQuery('SELECT MAX(category_id) as max from dishes_category')

    return result[0].max
}

exports.addNewCategory = async (categoryName) => {
    let category_id = await this.getMaxCategoryId() + 1;

    let exists = await this.isExistsCategory(categoryName)

    if (exists) {
        await execQuery('UPDATE dishes_category set is_active = 1 where name = \'' + categoryName + '\'')
    } else {
        await execQuery('INSERT INTO dishes_category (category_id, name, is_active) values(' + category_id + ', \'' + categoryName + '\', 1)');
    }
}

exports.isExistsCategory = async (categoryName) => {
    let result = await execQuery('SELECT EXISTS(SELECT * FROM dishes_category WHERE name = \''+categoryName+'\' and is_active = 1) as e')

    return result[0].e;
}

exports.getCategoryById = async (categoryId) => {
    let result = await execQuery('SELECT * FROM dishes_category where category_id = ' + categoryId);

    if (result[0].is_active === 1) {
        result[0].isActive = true
    } else {
        result[0].isActive = false
    }

    return result[0];
}

exports.updateCategory = async (category) => {
    await execQuery('UPDATE dishes_category SET name = \'' + category.name + '\', is_active = ' + category.isActive + ' WHERE category_id = ' + category.category_id)
}