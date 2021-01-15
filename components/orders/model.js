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

async function fullOrderInfo(orders) {
    for (let i = 0; i < orders.length; i++) {
        let user = await userModel.getUserById(orders[i].user)

        orders[i].user = user

        switch (orders[i].status) {
            case 0:
                orders[i].status_name = 'Đang chuẩn bị';
                orders[i].status_name_uppercase = '̣ĐANG CHUẨN BỊ';
                break;
            case 1:
                orders[i].status_name = 'Đang giao hàng';
                orders[i].status_name_uppercase = '̣ĐANG GIAO HÀNG';
                break;
            case 2:
                orders[i].status_name = 'Đã giaọ hàng';
                orders[i].status_name_uppercase = '̣ĐÃ GIAỌ HÀNG';
                break;
            case 3:
                orders[i].status_name = 'Đã hủy';
                orders[i].status_name_uppercase = '̣ĐÃ HỦỴ';
                break;
        }
    }

    return orders;
}

async function drawChar() {
    new Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'yearRevenueChart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [
            { year: '2019', value: 10 },
            { year: '2020', value: 20 },
            { year: '2021', value: 30 }
        ],
        // The name of the data record attribute that contains x-values.
        xkey: 'year',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['value'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Value']
    });

    Morris.Bar({
        element: 'monthRevenueChart',
        data: [
            { y: '1', a: orderModel.getRevenueByMonth(1) },
            { y: '2', a: orderModel.getRevenueByMonth(2) },
            { y: '3', a: orderModel.getRevenueByMonth(3) },
            { y: '4', a: orderModel.getRevenueByMonth(4) },
            { y: '5', a: orderModel.getRevenueByMonth(5) },
            { y: '6', a: orderModel.getRevenueByMonth(6) },
            { y: '7', a: orderModel.getRevenueByMonth(7)},
            { y: '8', a: orderModel.getRevenueByMonth(8)},
            { y: '9', a: orderModel.getRevenueByMonth(9)},
            { y: '10', a: orderModel.getRevenueByMonth(10) },
            { y: '11', a: orderModel.getRevenueByMonth(11) },
            { y: '12', a: orderModel.getRevenueByMonth(12) },
        ],
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Sold']
    });
}

exports.getAllOrder = async (page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'created_date';
            break;
        case '2':
            sort = 'total_price';
            break;
    }

    let orders = await execQuery('SELECT * from orders where is_active = 1 ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return fullOrderInfo(orders);
}

exports.searchByKeyName = async (keyName, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'created_date';
            break;
        case '2':
            sort = 'total_price';
            break;
    }

    let query = 'SELECT o.order_id, o.user, o.total_price, o.created_date, o.status FROM orders as o left JOIN user as u on o.user = u.user_id WHERE MATCH(u.name) AGAINST(\''+keyName+'\') and u.is_active = 1 and o.is_active = 1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    let orders = await execQuery(query)

    return fullOrderInfo(orders);
}

exports.totalResultByKeyName = async (keyName) => {
    keyName = decodeURIComponent(keyName)

    let query = 'SELECT COUNT(o.order_id) as total FROM orders as o left JOIN user as u on o.user = u.user_id WHERE MATCH(u.name) AGAINST(\''+keyName+'\') and u.is_active = 1 and o.is_active = 1'

    let result = await execQuery(query);

    return result[0].total
}

exports.deleteOrder = async (order_id) => {
    await execQuery('UPDATE orders SET is_active = 0 where order_id = ' + order_id)
}

exports.getOrderByCategory = async (categoryId, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'created_date';
            break;
        case '2':
            sort = 'total_price';
            break;
    }

    let orders = await execQuery('SELECT * from orders where is_active = 1 and status = ' + categoryId + ' ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return fullOrderInfo(orders);
}

exports.totalOrderByCategory = async (categoryId) => {
    let query = 'SELECT COUNT(*) as total from orders where is_active = 1 and status = ' + categoryId;

    let result = await execQuery(query);

    return result[0].total
}

exports.totalOrder = async () => {
    let query = 'SELECT COUNT(order_id) as total FROM orders where is_active = 1';

    let result = await execQuery(query)

    return result[0].total
}

exports.getOrderById = async (order_id) => {
    let orders = await execQuery('SELECT * FROM orders WHERE order_id = ' + order_id + ' and is_active = 1')

    orders = await fullOrderInfo(orders)

    let order = orders[0];

    order.orderDetail = await execQuery('SELECT * FROM order_detail where order_id = ' + order.order_id + ' and is_active = 1')

    for (let i = 0; i < order.orderDetail.length; i++) {
        order.orderDetail[i].dishDetail = await  dishModel.getDishById(order.orderDetail[i].dish)
    }

    return order
}

exports.updateStatusOrder = async (order_id, status) => {
    await execQuery('UPDATE orders SET status = ' + status + ' WHERE order_id = ' + order_id)
}

exports.getAllRevenue = async () => {
    let query = 'SELECT SUM(total_price) as total FROM orders';

    let result = await execQuery(query)

    if (result[0].total) {
        return result[0].total
    } else {
        return 0;
    }
}

exports.getAllDishes = async () => {
    let query = 'SELECT COUNT(*) as total FROM dishes';

    let result = await execQuery(query)

    if (result[0].total) {
        return result[0].total
    } else {
        return 0;
    }
}

exports.getAllOrder = async () => {
    let query = 'SELECT COUNT(*) as total FROM orders';

    let result = await execQuery(query)

    if (result[0].total) {
        return result[0].total
    } else {
        return 0;
    }
}

exports.getAllRevenueToday = async () => {
    let query = 'SELECT SUM(total_price) as total FROM orders WHERE DATE(created_date) = CURRENT_DATE()';

    let result = await execQuery(query)

    if (result[0].total) {
        return result[0].total
    } else {
        return 0;
    }
}

exports.getRevenueByYear = async (year) => {
    let query = 'SELECT SUM(total_price) as total FROM orders where YEAR(created_date) = ' + year;

    let result = await execQuery(query)

    if (result[0].total) {
        return result[0].total
    } else {
        return 0;
    }
}

exports.getRevenueByMonth = async (month, year) => {
    let query = 'SELECT SUM(total_price) as total FROM orders where MONTH(created_date) = ' + month + ' AND YEAR(created_date) = ' + year;

    let result = await execQuery(query)

    if (result[0].total) {
        return result[0].total
    } else {
        return 0;
    }

}

exports.getAllYear = async () => {
    let query = 'SELECT DISTINCT YEAR(created_date) as total FROM orders  ORDER BY total DESC LIMIT 3';

    let result = await execQuery(query)

    if (result) {
        return result
    } else {
        return 2020;
    }
}

exports.getCurrentYear = async () => {
    let query = 'SELECT  YEAR(CURDATE()) as total';

    let result = await execQuery(query)

    if (result[0].total) {
        return result[0].total
    } else {
        return 0;
    }
}