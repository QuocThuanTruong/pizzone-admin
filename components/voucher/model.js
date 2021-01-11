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

function fullVoucherInfo(vouchers) {
    for (let i = 0; i < vouchers.length; i++) {
        switch (vouchers[i].is_active) {
            case 0:
                vouchers[i].voucherStatusActive = 'Passive';
                vouchers[i].voucherStatusActiveUpperCase = 'PASSIVE';
                vouchers[i].isActive = false;
                vouchers[i].status_name_uppercase = '̣ĐANG CHUẨN BỊ';
                break;
            case 1:
                vouchers[i].voucherStatusActive = 'Active';
                vouchers[i].voucherStatusActiveUpperCase = 'ACTIVE';
                vouchers[i].isActive = true;
                vouchers[i].status_name_uppercase = '̣ĐANG GIAO HÀNG';
                break;
        }
        vouchers[i].start_date_string = (vouchers[i].start_date.getMonth() + 1).toString() + '/' + vouchers[i].start_date.getDate().toString() + '/' + vouchers[i].start_date.getFullYear().toString()
        vouchers[i].end_date_string = (vouchers[i].end_date.getMonth() + 1).toString() + '/' + vouchers[i].end_date.getDate().toString() + '/' + vouchers[i].end_date.getFullYear().toString()
        vouchers[i].start_date =  vouchers[i].start_date.toISOString().slice(0, 19).replace('T', ' ')
        vouchers[i].end_date =  vouchers[i].end_date.toISOString().slice(0, 19).replace('T', ' ')
    }

    return vouchers;
}

exports.updateVoucher = async (voucher) => {
    await execQuery('UPDATE voucher SET code = \'' + voucher.code + '\', discount = ' + voucher.discount + ', start_date = \'' + voucher.start_date + '\', end_date = \'' + voucher.end_date + '\', is_active = ' + voucher.is_active + ' WHERE id = ' + voucher.id)
}

exports.getAllVoucher = async (page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'discount desc';
            break;
        case '2':
            sort = 'start_date';
            break;
        case '3':
            sort = 'end_date';
            break;
    }

    let vouchers = await execQuery('SELECT * from voucher where is_active <> -1 ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return fullVoucherInfo(vouchers);
}


exports.totalVoucher = async () => {
    let query = 'SELECT COUNT(id) as total FROM voucher where is_active <> -1';

    let result = await execQuery(query)

    return result[0].total
}

exports.searchByKeyName = async (keyName, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'discount desc';
            break;
        case '2':
            sort = 'start_date';
            break;
        case '3':
            sort = 'end_date';
            break;
    }

    let query = 'SELECT * FROM voucher WHERE code like \'%' + keyName + '%\' and is_active <> -1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    let vouchers = await execQuery(query)

    return fullVoucherInfo(vouchers);
}

exports.totalResultByKeyName = async (keyName) => {
    keyName = decodeURIComponent(keyName)

    let query = 'SELECT COUNT(id) as total FROM voucher WHERE code like \'%' + keyName + '%\' and is_active <> -1'

    let result = await execQuery(query);

    return result[0].total
}

exports.deleteVoucher = async (voucher_id) => {
    await execQuery('UPDATE voucher SET is_active = -1 where id = ' + voucher_id)
}

exports.getVoucherByCategory = async (categoryId, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'discount desc';
            break;
        case '2':
            sort = 'start_date';
            break;
        case '3':
            sort = 'end_date';
            break;
    }

    let vouchers = await execQuery('SELECT * from voucher where is_active = ' + categoryId + ' ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return fullVoucherInfo(vouchers);
}

exports.totalVoucherByCategory = async (categoryId) => {
    let query = 'SELECT COUNT(*) as total from voucher where is_active = '+ categoryId;

    let result = await execQuery(query);

    return result[0].total
}


exports.getVoucherById = async (id) => {
    let vouchers = await execQuery('SELECT * FROM voucher WHERE id = ' + id + ' and is_active <> -1')

    vouchers = fullVoucherInfo(vouchers)

    let voucher = vouchers[0];

    return voucher
}

exports.getMaxIdVoucher = async () => {
    const result = await execQuery('SELECT MAX(id) as max from voucher')

    return result[0].max
}

exports.addNewVoucher = async (voucher) => {
    let id = await this.getMaxIdVoucher() + 1;

    await execQuery('INSERT INTO voucher (id, code, discount, start_date, end_date, is_active) values(' + id + ', \'' + voucher.code + '\', ' + voucher.discount + ', \'' + voucher.start_date + '\', \'' + voucher.end_date + '\', 1)');
}