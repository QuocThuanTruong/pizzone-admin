const shippingModel = require('./model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category!== undefined)) {
        const key_name = req.query.key_name;

        let categoryId = req.query.category;
        let currentPage = req.query.page;

        let sortBy = '1';

        if (categoryId === undefined || categoryId === "")
            categoryId = '1';

        if (currentPage === undefined)
            currentPage = '1';

        if (req.session.totalshippingsPerPage === undefined) {
            req.session.totalshippingsPerPage = 4
        }

        let totalDishPerPage = parseInt(req.session.totalshippingsPerPage)

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

        let shippings = await shippingModel.getAllShipping(currentPage, totalDishPerPage, sortBy);
        let totalResult = await shippingModel.totalShipping();

        if (key_name !== undefined) {
            shippings = await shippingModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

            totalResult = await shippingModel.totalResultByKeyName(key_name)
        } else if (categoryId !== '') {
            shippings = await shippingModel.getShippingByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

            totalResult = await shippingModel.totalShippingByCategory(categoryId);
        }

        let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        const dataContext = {
            totalResult: totalResult,
            shippings: shippings,
            totalDishPerPageOption: totalDishPerPageOption,
            totalPage: totalPage,
            page: currentPage,
            category: categoryId,
            isLogin: true
        }

        res.render('.././components/shippingfees/views/index', dataContext);
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
        categoryId = '1';

    if (currentPage === undefined)
        currentPage = '1';

    if (totalDishPerPage === undefined)
        totalDishPerPage = parseInt(req.session.totalshippingsPerPage);
    else {
        req.session.totalshippingsPerPage = parseInt(totalDishPerPage);
    }

    let shippings = await shippingModel.getAllShipping(currentPage, totalDishPerPage, sortBy);
    let totalResult = await shippingModel.totalShipping();

    if (key_name !== undefined) {
        shippings = await shippingModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

        totalResult = await shippingModel.totalResultByKeyName(key_name)
    } else if (categoryId !== '') {
        shippings = await shippingModel.getShippingByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

        totalResult = await shippingModel.totalShippingByCategory(categoryId);
    }

    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    const dataContext = {
        totalResult: totalResult,
        shippings: shippings,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId,
        isLogin: true
    }

    res.send(dataContext)
}

exports.delete = async (req, res, next) => {
    const _ = await shippingModel.deleteShipping(req.body['id'])

    this.index(req, res, next)
}

exports.add = async (req, res, next) => {
    res.render('.././components/shippingfees/views/add')
}

exports.confirmAdd = async (req, res, next) => {
    let Shipping = {
        min_price: req.body['min-price'],
        max_price: req.body['max-price'],
        fee: req.body['fee'],
    }

    await shippingModel.addNewShipping(Shipping);

    res.redirect('/manage-shipping-fees');
}


exports.update = async (req, res, next) => {
    let shipping = await shippingModel.getShippingById(req.params.id)

    res.render('.././components/shippingfees/views/update', shipping);
}

exports.confirmUpdate = async (req, res, next) => {
    let id = req.params.id

    let shipping = {
        id: id,
        min_price: req.body['min-price'],
        max_price: req.body['max-price'],
        fee: req.body['fee'],
        is_active: req.body['is_active']
    }

    await shippingModel.updateShipping(shipping)

    res.redirect('/manage-shipping-fees')
}
