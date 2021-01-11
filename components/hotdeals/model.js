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

async function fullHotDealInfo(hotdeals) {
    for (let i = 0; i < hotdeals.length; i++) {
        switch (hotdeals[i].is_active) {
            case 0:
                hotdeals[i].subcategoryStatusActive = 'Passive';
                hotdeals[i].isActive = false;
                hotdeals[i].status_name_uppercase = '̣ĐANG CHUẨN BỊ';
                break;
            case 1:
                hotdeals[i].subcategoryStatusActive = 'Active';
                hotdeals[i].isActive = true;
                hotdeals[i].status_name_uppercase = '̣ĐANG GIAO HÀNG';
                break;
        }
        hotdeals[i].start_time_string = hotdeals[i].start_time.getMonth().toString() + '/' + hotdeals[i].start_time.getDate().toString() + '/' + hotdeals[i].start_time.getFullYear().toString()
        hotdeals[i].end_time_string = hotdeals[i].end_time.getMonth().toString() + '/' + hotdeals[i].start_time.getDate().toString() + '/' + hotdeals[i].start_time.getFullYear().toString()
        hotdeals[i].start_time =  hotdeals[i].start_time.toISOString().slice(0, 19).replace('T', ' ')
        hotdeals[i].end_time =  hotdeals[i].end_time.toISOString().slice(0, 19).replace('T', ' ')

        hotdeals[i].dishDetail = await dishModel.getDishById(hotdeals[i].dish)
    }

    return hotdeals;
}

exports.updateHotDeal = async (hotdeal) => {
    await execQuery('UPDATE hot_deal SET discount = ' + hotdeal.discount + ', start_time = \'' + hotdeal.start_time + '\', end_time = \'' + hotdeal.end_time + '\', is_active = ' + hotdeal.is_active + ' WHERE deal_id = ' + hotdeal.deal_id)
}

exports.getAllHotDeal = async (page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'discount desc';
            break;
        case '2':
            sort = 'start_time';
            break;
        case '3':
            sort = 'end_time';
            break;
    }

    let hotdeals = await execQuery('SELECT * from hot_deal where is_active <> -1 ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return await fullHotDealInfo(hotdeals);
}


exports.totalHotDeal = async () => {
    let query = 'SELECT COUNT(deal_id) as total FROM hot_deal where is_active <> -1';

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
            sort = 'start_time';
            break;
        case '3':
            sort = 'end_time';
            break;
    }

    let query = 'SELECT h.deal_id, h.dish, h.discount, h.start_time, h.end_time, h.is_active FROM hot_deal as h left JOIN dishes as d on h.dish = d.dish_id WHERE MATCH(d.name) AGAINST(\''+keyName+'\') and h.is_active <> -1 and d.is_active = 1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    let hotdeals = await execQuery(query)

    return await fullHotDealInfo(hotdeals);
}

exports.totalResultByKeyName = async (keyName) => {
    keyName = decodeURIComponent(keyName)

    let query = 'SELECT COUNT(h.deal_id) as total FROM hot_deal as h left JOIN dishes as d on h.dish = d.dish_id WHERE MATCH(d.name) AGAINST(\''+keyName+'\') and h.is_active <> -1 and d.is_active = 1'

    let result = await execQuery(query);

    return result[0].total
}

exports.deleteHotDeal = async (deal_id) => {
    console.log(deal_id)

    await execQuery('UPDATE hot_deal SET is_active = -1 where deal_id = ' + deal_id)
}

exports.getHotDealByCategory = async (categoryId, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'discount desc';
            break;
        case '2':
            sort = 'start_time';
            break;
        case '3':
            sort = 'end_time';
            break;
    }

    let hotdeals = await execQuery('SELECT * from hot_deal where is_active = ' + categoryId + ' ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return await fullHotDealInfo(hotdeals);
}

exports.totalHotDealByCategory = async (categoryId) => {
    let query = 'SELECT COUNT(*) as total from hot_deal where is_active = '+ categoryId;

    let result = await execQuery(query);

    return result[0].total
}


exports.getHotDealById = async (deal_id) => {
    let hotdeals = await execQuery('SELECT * FROM hot_deal WHERE deal_id = ' + deal_id + ' and is_active <> -1')

    hotdeals = await fullHotDealInfo(hotdeals)

    let hotdeal = hotdeals[0];

    return hotdeal
}

exports.updateStatusOrder = async (order_id, status) => {
    await execQuery('UPDATE orders SET status = ' + status + ' WHERE order_id = ' + order_id)
}

exports.getMaxIdHotDeal = async () => {
    const result = await execQuery('SELECT MAX(deal_id) as max from hot_deal')

    return result[0].max
}

exports.addNewHotDeal = async (hotdeal) => {
    let deal_id = await this.getMaxIdHotDeal() + 1;

    await execQuery('INSERT INTO hot_deal (deal_id, dish, discount, quantity, start_time, end_time, is_active) values(' + deal_id + ', ' + hotdeal.dish + ', ' + hotdeal.discount + ', 1000, \'' + hotdeal.start_time + '\', \'' + hotdeal.end_time + '\', 1)');
}