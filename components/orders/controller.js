const orderModel = require('./model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category!== undefined)) {
        const key_name = req.query.key_name;

        let categoryId = req.query.category;
        let currentPage = req.query.page;

        let sortBy = '1';

        if (categoryId === undefined || categoryId === "")
            categoryId = '0';

        if (currentPage === undefined)
            currentPage = '1';

        if (req.session.totalOrderPerPage === undefined) {
            req.session.totalOrderPerPage = 1
        }

        let totalDishPerPage = parseInt(req.session.totalOrderPerPage)

        let totalDishPerPageOption = {
            option1: false,
            option2: false,
            option3: false,
        }
        switch (totalDishPerPage) {
            case 1 :
                totalDishPerPageOption.option1 = true;
                totalDishPerPageOption.option2 = false;
                totalDishPerPageOption.option3 = false;
                break;
            case 2 :
                totalDishPerPageOption.option1 = false;
                totalDishPerPageOption.option2 = true;
                totalDishPerPageOption.option3 = false;
                break;
            case 3 :
                totalDishPerPageOption.option1 = false;
                totalDishPerPageOption.option2 = false;
                totalDishPerPageOption.option3 = true;
                break;
        }

        let orders = await orderModel.getAllOrder(currentPage, totalDishPerPage, sortBy);
        let totalResult = await orderModel.totalOrder();

        if (key_name !== undefined) {
            orders = await orderModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

            totalResult = await orderModel.totalResultByKeyName(key_name)
        } else if (categoryId !== '') {
            orders = await orderModel.getOrderByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

            totalResult = await orderModel.totalOrderByCategory(categoryId);
        }

        let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        const dataContext = {
            totalResult: totalResult,
            orders: orders,
            totalDishPerPageOption: totalDishPerPageOption,
            totalPage: totalPage,
            page: currentPage,
            category: categoryId,
            isLogin: true
        }

        res.render('.././components/orders/views/index', dataContext);
    } else {
        this.pagination(req, res, next)
    }
}

exports.pagination = async (req, res, next) => {
    const key_name = req.query.key_name;

    let categoryId = req.query.category;
    let currentPage = req.query.page;
    let totalDishPerPage = req.query.total_dish_per_page;
    let sortBy = req.query.sortBy;

    if (categoryId === undefined || categoryId === "")
        categoryId = '0';

    if (currentPage === undefined)
        currentPage = '1';

    if (totalDishPerPage === undefined)
        totalDishPerPage = parseInt(req.session.totalOrderPerPage);
    else {
        req.session.totalOrderPerPage = parseInt(totalDishPerPage);
    }

    let orders = await orderModel.getAllOrder(currentPage, totalDishPerPage, sortBy);
    let totalResult = await orderModel.totalOrder();

    if (key_name !== undefined) {
        orders = await orderModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

        totalResult = await orderModel.totalResultByKeyName(key_name)
    } else if (categoryId !== '') {
        orders = await orderModel.getOrderByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

        totalResult = await orderModel.totalOrderByCategory(categoryId);
    }

    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    const dataContext = {
        totalResult: totalResult,
        orders: orders,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId,
        isLogin: true
    }

    res.send(dataContext)
}

exports.delete = async (req, res, next) => {
    const _ = await orderModel.deleteOrder(req.body['id'])

    this.index(req, res, next)
}

exports.update = async (req, res, next) => {
    let order_id = req.params.id;
    let status = req.query.status;

    if (status === undefined) {
        let order = await orderModel.getOrderById(order_id)

        let statusOption = {
            option1 : false,
            option2 : false,
            option3 : false,
            option4 : false
        }

        switch (order.status) {
            case 0:
                statusOption.option1 = true;
                break;
            case 1:
                statusOption.option2 = true;
                break;
            case 2:
                statusOption.option3 = true;
                break;
            case 3:
                statusOption.option4 = true;
                break;
        }

        let dataContext = {
            order: order,
            statusOption: statusOption
        }

        res.render('.././components/orders/views/update', dataContext);
    } else {
        await orderModel.updateStatusOrder(order_id, status)

        res.redirect('/manage-orders/update/' + order_id);
    }
}