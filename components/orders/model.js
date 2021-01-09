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

exports.getMaxOrderId = async () => {
    const result = await execQuery('SELECT MAX(order_id) as max from orders')

    return result[0].max
}

exports.getCurrentOrderByUserId = async (user_id) => {
    const orders = await execQuery('SELECT * FROM orders WHERE user = ' + user_id + ' and status = 0')
    let currentOrders = []

    for (let i = 0; i < orders.length; i ++) {
        const order_id = orders[i].order_id;

        let currentOrder = await execQuery('SELECT * FROM order_detail where order_id = '+ order_id + ' and is_active = 1')

        for (let i = 0; i < currentOrder.length; i++) {
            let order = currentOrder[i];

            let dish = await dishModel.getDishById(order.dish)
            dish.order_id = order.order_id
            dish.quantity = order.quantity
            dish.ordinal_number = order.ordinal_number;
            dish.orderPrice  = order.price;

            currentOrders.push(dish);
        }
    }

    return currentOrders;
}

exports.getOrderedByUserId = async (user_id) => {
    const orders = await execQuery('SELECT * FROM orders WHERE user = ' + user_id + ' and status = 1')
    let ordereds = []

    for (let i = 0; i < orders.length; i++) {
        const order_id = orders[i].order_id;

        let ordered = await execQuery('SELECT * FROM order_detail where order_id = '+ order_id + ' and is_active = 1')

        for (let i = 0; i < ordered.length; i++) {
            let order = ordered[i];

            let dish = await dishModel.getDishById(order.dish)
            dish.order_id = order.order_id
            dish.quantity = order.quantity
            dish.ordinal_number = order.ordinal_number;
            dish.orderPirce  = order.price;

            ordereds.push(dish);
        }
    }

    return ordereds;
}

exports.insertOrder = async (cart, totalCost, user_id) => {
    const order_id = (await this.getMaxOrderId()) + 1;

    await execQuery('INSERT INTO orders(order_id, user, total_price, status, is_active) values('+order_id+', '+user_id+', '+totalCost+', 0, 1)')

    for (let i = 0; i < cart.itemInCart.length; i++) {
        let dish = cart.itemInCart[i];
        dish.order_id = order_id;
        dish.ordinal_number = i + 1;

        await this.insertOrderDetail(dish)
    }
}

exports.insertOrderDetail = async (dish) => {
    await execQuery('INSERT INTO order_detail(order_id, ordinal_number, dish, price, quantity, is_active) values('+dish.order_id+', '+dish.ordinal_number+', '+dish.dish_id+', '+dish.price+', '+dish.quantity+', 1)')
}

exports.cancelOrderDetail = async (dish) => {
    await execQuery('UPDATE order_detail SET is_active = 0 WHERE order_id = ' + dish.order_id + ' and ordinal_number = ' + dish.ordinal_number + ' and dish = ' + dish.dish_id)
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