const {db} = require('../../dal/db')
const dishModel = require('../dishes/model')
const userModel = require('../users/model')

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

function fullShippingInfo(shippings) {
    for (let i = 0; i < shippings.length; i++) {
        switch (shippings[i].is_active) {
            case 0:
                shippings[i].shippingStatus = 'Passive';
                shippings[i].shippingstatusActiveUpperCase = 'PASSIVE';
                shippings[i].isActive = false;
                shippings[i].status_name_uppercase = '̣ĐANG CHUẨN BỊ';
                break;
            case 1:
                shippings[i].shippingStatus = 'Active';
                shippings[i].shippingstatusActiveUpperCase = 'ACTIVE';
                shippings[i].isActive = true;
                shippings[i].status_name_uppercase = '̣ĐANG GIAO HÀNG';
                break;
        }
    }

    return shippings;
}

exports.updateShipping = async (Shipping) => {
    await execQuery('UPDATE shipping_fee SET min_price = ' + Shipping.min_price + ', max_price = ' + Shipping.max_price + ', fee = ' + Shipping.fee + ', is_active = ' + Shipping.is_active + ' WHERE id = ' + Shipping.id)
}

exports.getAllShipping = async (page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'fee desc';
            break;
        case '2':
            sort = 'min_price asc';
            break;
        case '3':
            sort = 'max_price desc';
            break;
    }

    let shippings = await execQuery('SELECT * from shipping_fee where is_active <> -1 ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return fullShippingInfo(shippings);
}


exports.totalShipping = async () => {
    let query = 'SELECT COUNT(id) as total FROM shipping_fee where is_active <> -1';

    let result = await execQuery(query)

    return result[0].total
}

exports.searchByKeyName = async (keyName, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'fee desc';
            break;
        case '2':
            sort = 'min_price asc';
            break;
        case '3':
            sort = 'max_price desc';
            break;
    }

    let query = 'SELECT * FROM shipping_fee WHERE min_price <= ' + keyName + ' and max_price >= ' + keyName + ' and is_active <> -1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    let shippings = await execQuery(query)

    return fullShippingInfo(shippings);
}

exports.totalResultByKeyName = async (keyName) => {
    keyName = decodeURIComponent(keyName)

    let query = 'SELECT COUNT(id) as total FROM shipping_fee WHERE min_price <= ' + keyName + ' and max_price >= ' + keyName + ' and is_active <> -1'

    let result = await execQuery(query);

    return result[0].total
}

exports.deleteShipping = async (Shipping_id) => {
    await execQuery('UPDATE shipping_fee SET is_active = -1 where id = ' + Shipping_id)
}

exports.getShippingByCategory = async (categoryId, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'fee desc';
            break;
        case '2':
            sort = 'min_price asc';
            break;
        case '3':
            sort = 'max_price desc';
            break;
    }

    let shippings = await execQuery('SELECT * from shipping_fee where is_active = ' + categoryId + ' ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return fullShippingInfo(shippings);
}

exports.totalShippingByCategory = async (categoryId) => {
    let query = 'SELECT COUNT(*) as total from shipping_fee where is_active = '+ categoryId;

    let result = await execQuery(query);

    return result[0].total
}


exports.getShippingById = async (id) => {
    let shippings = await execQuery('SELECT * FROM shipping_fee WHERE id = ' + id + ' and is_active <> -1')

    shippings = fullShippingInfo(shippings)

    let Shipping = shippings[0];

    return Shipping
}

exports.getMaxIdShipping = async () => {
    const result = await execQuery('SELECT MAX(id) as max from shipping_fee')

    return result[0].max
}

exports.addNewShipping = async (Shipping) => {
    let id = await this.getMaxIdShipping() + 1;

    await execQuery('INSERT INTO shipping_fee (id, min_price, max_price, fee, is_active) values(' + id + ', ' + Shipping.min_price + ', ' + Shipping.max_price + ', ' + Shipping.fee + ', 1)');
}