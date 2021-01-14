const hotdealModel = require('./model')
const dishModel = require('../dishes/model')

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

        if (req.session.totalHotDealPerPage === undefined) {
            req.session.totalHotDealPerPage = 4
        }

        let totalDishPerPage = parseInt(req.session.totalHotDealPerPage)

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

        let hotdeals = await hotdealModel.getAllHotDeal(currentPage, totalDishPerPage, sortBy);
        let totalResult = await hotdealModel.totalHotDeal();

        if (key_name !== undefined) {
            hotdeals = await hotdealModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

            totalResult = await hotdealModel.totalResultByKeyName(key_name)
        } else if (categoryId !== '') {
            hotdeals = await hotdealModel.getHotDealByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

            totalResult = await hotdealModel.totalHotDealByCategory(categoryId);
        }

        let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        const dataContext = {
            totalResult: totalResult,
            hotdeals: hotdeals,
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
        categoryId = '1';

    if (currentPage === undefined)
        currentPage = '1';

    if (totalDishPerPage === undefined)
        totalDishPerPage = parseInt(req.session.totalHotDealPerPage);
    else {
        req.session.totalHotDealPerPage = parseInt(totalDishPerPage);
    }

    let hotdeals = await hotdealModel.getAllHotDeal(currentPage, totalDishPerPage, sortBy);
    let totalResult = await hotdealModel.totalHotDeal();

    if (key_name !== undefined) {
        hotdeals = await hotdealModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

        totalResult = await hotdealModel.totalResultByKeyName(key_name)
    } else if (categoryId !== '') {
        hotdeals = await hotdealModel.getHotDealByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

        totalResult = await hotdealModel.totalHotDealByCategory(categoryId);
    }

    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    const dataContext = {
        totalResult: totalResult,
        hotdeals: hotdeals,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId,
        isLogin: true
    }

    res.send(dataContext)
}

exports.delete = async (req, res, next) => {
    const _ = await hotdealModel.deleteHotDeal(req.body['id'])

    this.index(req, res, next)
}

exports.add = async (req, res, next) => {
    let dishes = await dishModel.getAllDish()

    res.render('.././components/hotdeals/views/add', {dishes})
}

exports.confirmAdd = async (req, res, next) => {
    let hotdeal = {
        dish: req.body['dish'],
        discount: req.body['discount'],
        start_time: new Date(req.body['start']).toISOString().slice(0, 19).replace('T', ' '),
        end_time: new Date(req.body['end']).toISOString().slice(0, 19).replace('T', ' '),
    }

    await hotdealModel.addNewHotDeal(hotdeal);

    res.redirect('/manage-hot-deals');
}


exports.update = async (req, res, next) => {
    let hotdeal = await hotdealModel.getHotDealById(req.params.id)

    res.render('.././components/hotdeals/views/update', hotdeal);
}

exports.confirmUpdate = async (req, res, next) => {
    let deal_id = req.params.id

    let hotdeal = {
        deal_id: deal_id,
        dish: req.body['dish'],
        discount: req.body['discount'],
        start_time: new Date(req.body['start']).toISOString().slice(0, 19).replace('T', ' '),
        end_time: new Date(req.body['end']).toISOString().slice(0, 19).replace('T', ' '),
        is_active: req.body['is_active']
    }

    await hotdealModel.updateHotDeal(hotdeal)

    res.redirect('/manage-hot-deals')
}
