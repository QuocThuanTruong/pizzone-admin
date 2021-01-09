const userModel = require('./model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category!== undefined)) {
        const key_name = req.query.key_name;

        let categoryId = req.query.category;
        let currentPage = req.query.page;
        let totalDishPerPage = req.query.total_dish_per_page;

        let sortBy = '1';

        if (categoryId === undefined || categoryId === '-1')
            categoryId = '';

        if (currentPage === undefined)
            currentPage = '1';

        if (totalDishPerPage === undefined)
            totalDishPerPage = '1';

        let accounts = await userModel.getAllAccount(currentPage, totalDishPerPage, sortBy);
        let totalResult = await userModel.totalAccount();
        let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        if (key_name !== undefined) {
            accounts = await userModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

            totalResult = await userModel.totalResultByKeyName(key_name)
        } else if (categoryId !== '') {
            accounts = await userModel.getAccountByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

            totalResult = await userModel.totalAccountByCategory(categoryId);

            totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))
        }


        const dataContext = {
            totalResult: totalResult,
            accounts: accounts,
            totalPage: totalPage,
            page: currentPage,
            category: categoryId,
            isLogin: true
        }

        res.render('.././components/users/views/index', dataContext);
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

    if (categoryId === undefined || categoryId === '-1')
        categoryId = '';

    if (currentPage === undefined)
        currentPage = '1';

    if (totalDishPerPage === undefined)
        totalDishPerPage = '1';

    let accounts = await userModel.getAllAccount(currentPage, totalDishPerPage, sortBy);
    let totalResult = await userModel.totalAccount();
    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    if (key_name !== undefined) {
        accounts = await userModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

        totalResult = await userModel.totalResultByKeyName(key_name)
    } else if (categoryId !== '') {
        accounts = await userModel.getAccountByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

        totalResult = await userModel.totalAccountByCategory(categoryId);

        totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))
    }

    const dataContext = {
        totalResult: totalResult,
        accounts: accounts,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId,
        isLogin: true
    }

    res.send(dataContext)
}

exports.delete = async (req, res, next) => {
    const _ = await userModel.deleteAccount(req.body['id'])

    this.index(req, res, next)
}

exports.detail = async (req, res, next) => {
    const user_id = req.params.id

    const account = await userModel.getUserById(user_id)

    let dataContext = {
        account : account
    }

    res.render('.././components/users/views/detail', dataContext);
}

exports.lockAccount = async (req, res, next) => {
    const user_id = req.params.id;

    await userModel.lockAccount(user_id);

    res.redirect('/manage-users/detail/' + user_id);
}

exports.unlockAccount = async (req, res, next) => {
    const user_id = req.params.id;

    await userModel.unlockAccount(user_id);

    res.redirect('/manage-users/detail/' + user_id);
}