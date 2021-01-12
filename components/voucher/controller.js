const voucherModel = require('./model')

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

        if (req.session.totalVoucherPerPage === undefined) {
            req.session.totalVoucherPerPage = 4
        }

        let totalDishPerPage = parseInt(req.session.totalVoucherPerPage)

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

        let vouchers = await voucherModel.getAllVoucher(currentPage, totalDishPerPage, sortBy);
        let totalResult = await voucherModel.totalVoucher();

        if (key_name !== undefined) {
            vouchers = await voucherModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

            totalResult = await voucherModel.totalResultByKeyName(key_name)
        } else if (categoryId !== '') {
            vouchers = await voucherModel.getVoucherByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

            totalResult = await voucherModel.totalVoucherByCategory(categoryId);
        }

        let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        const dataContext = {
            totalResult: totalResult,
            vouchers: vouchers,
            totalDishPerPageOption: totalDishPerPageOption,
            totalPage: totalPage,
            page: currentPage,
            category: categoryId,
            isLogin: true
        }

        res.render('.././components/voucher/views/index', dataContext);
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
        totalDishPerPage = parseInt(req.session.totalVoucherPerPage);
    else {
        req.session.totalVoucherPerPage = parseInt(totalDishPerPage);
    }

    let vouchers = await voucherModel.getAllVoucher(currentPage, totalDishPerPage, sortBy);
    let totalResult = await voucherModel.totalVoucher();

    if (key_name !== undefined) {
        vouchers = await voucherModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

        totalResult = await voucherModel.totalResultByKeyName(key_name)
    } else if (categoryId !== '') {
        vouchers = await voucherModel.getVoucherByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

        totalResult = await voucherModel.totalVoucherByCategory(categoryId);
    }

    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    const dataContext = {
        totalResult: totalResult,
        vouchers: vouchers,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId,
        isLogin: true
    }

    res.send(dataContext)
}

exports.delete = async (req, res, next) => {
    const _ = await voucherModel.deleteVoucher(req.body['id'])

    this.index(req, res, next)
}

exports.add = async (req, res, next) => {
    res.render('.././components/voucher/views/add')
}

exports.confirmAdd = async (req, res, next) => {
    let Voucher = {
        code: req.body['code'],
        discount: req.body['discount'],
        start_date: new Date(req.body['start']).toISOString().slice(0, 19).replace('T', ' '),
        end_date: new Date(req.body['end']).toISOString().slice(0, 19).replace('T', ' '),
    }

    await voucherModel.addNewVoucher(Voucher);

    res.redirect('/manage-vouchers');
}


exports.update = async (req, res, next) => {
    let voucher = await voucherModel.getVoucherById(req.params.id)

    res.render('.././components/voucher/views/update', voucher);
}

exports.confirmUpdate = async (req, res, next) => {
    let id = req.params.id

    let voucher = {
        id: id,
        code: req.body['code'],
        discount: req.body['discount'],
        start_date: new Date(req.body['start']).toISOString().slice(0, 19).replace('T', ' '),
        end_date: new Date(req.body['end']).toISOString().slice(0, 19).replace('T', ' '),
        is_active: req.body['is_active']
    }

    await voucherModel.updateVoucher(voucher)

    res.redirect('/manage-vouchers')
}
