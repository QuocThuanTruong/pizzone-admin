const userModel = require('./model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category!== undefined)) {
        const key_name = req.query.key_name;

        let categoryId = req.query.category;
        let currentPage = req.query.page;

        let sortBy = '1';

        if (categoryId === undefined || categoryId === '-1')
            categoryId = '';

        if (currentPage === undefined)
            currentPage = '1';

        if (req.session.totalUserPerPage === undefined) {
            req.session.totalUserPerPage = 4
        }

        let totalDishPerPage = parseInt(req.session.totalUserPerPage)

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

        let accounts = await userModel.getAllAccount(currentPage, totalDishPerPage, sortBy);
        let totalResult = await userModel.totalAccount();

        if (key_name !== undefined) {
            accounts = await userModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

            totalResult = await userModel.totalResultByKeyName(key_name)
        } else if (categoryId !== '') {
            accounts = await userModel.getAccountByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

            totalResult = await userModel.totalAccountByCategory(categoryId);
        }

        let  totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        const dataContext = {
            totalResult: totalResult,
            accounts: accounts,
            totalDishPerPageOption: totalDishPerPageOption,
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
        totalDishPerPage = parseInt(req.session.totalUserPerPage);
    else {
        req.session.totalUserPerPage = parseInt(totalDishPerPage);
    }

    let accounts = await userModel.getAllAccount(currentPage, totalDishPerPage, sortBy);
    let totalResult = await userModel.totalAccount();

    if (key_name !== undefined) {
        accounts = await userModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

        totalResult = await userModel.totalResultByKeyName(key_name)
    } else if (categoryId !== '') {
        accounts = await userModel.getAccountByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

        totalResult = await userModel.totalAccountByCategory(categoryId);

    }

    let  totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

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

    if (account.user_id === req.user.user_id) {
        account.isAdmin = true;
    }

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