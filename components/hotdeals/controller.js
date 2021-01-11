const hotdealModel = require('./model')

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

        res.render('.././components/hotdeals/views/index', dataContext);
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

exports.add = async (req, res, next) => {
    res.render('.././components/hotdeals/views/add')
}

exports.update = async (req, res, next) => {

    res.render('.././components/hotdeals/views/update', {});
}
