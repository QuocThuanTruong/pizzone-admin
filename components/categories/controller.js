const categoryModel = require('./model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category!== undefined)) {
        const key_name = req.query.key_name;

        let currentPage = req.query.page;

        let sortBy = '1';

        if (currentPage === undefined)
            currentPage = '1';

        if (req.session.totalCategoryPerPage === undefined) {
            req.session.totalCategoryPerPage = 1
        }

        let totalDishPerPage = parseInt(req.session.totalCategoryPerPage)

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

        let categories = await categoryModel.getAllCategoryPaging(currentPage, totalDishPerPage, sortBy);
        let totalResult = await categoryModel.totalCategory();

        if (key_name !== undefined) {
            categories = await categoryModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

            totalResult = await categoryModel.totalResultByKeyName(key_name)
        }

        let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        const dataContext = {
            totalResult: totalResult,
            categories: categories,
            totalDishPerPageOption: totalDishPerPageOption,
            totalPage: totalPage,
            page: currentPage,
            isLogin: true
        }

        console.log(dataContext)

        res.render('.././components/categories/views/index', dataContext);
    } else {
        this.pagination(req, res, next)
    }
}

exports.pagination = async (req, res, next) => {
    const key_name = req.query.key_name;

    let currentPage = req.query.page;
    let totalDishPerPage = req.query.total_dish_per_page;
    let sortBy = req.query.sortBy;


    if (currentPage === undefined)
        currentPage = '1';

    if (totalDishPerPage === undefined)
        totalDishPerPage = parseInt(req.session.totalCategoryPerPage);
    else {
        req.session.totalCategoryPerPage = parseInt(totalDishPerPage);
    }

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

    let categories = await categoryModel.getAllCategory(currentPage, totalDishPerPage, sortBy);
    let totalResult = await categoryModel.totalCategory();

    if (key_name !== undefined) {
        categories = await categoryModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

        totalResult = await categoryModel.totalResultByKeyName(key_name)
    }

    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    const dataContext = {
        totalResult: totalResult,
        categories: categories,
        totalPage: totalPage,
        page: currentPage,
        isLogin: true
    }

    console.log(dataContext)
    res.send(dataContext)
}

exports.delete = async (req, res, next) => {
    const _ = await categoryModel.deleteCategoryById(req.body['id'])

    this.index(req, res, next)
}


exports.add = async (req, res, next) => {
    res.render('.././components/categories/views/add', {});
}

exports.confirmAdd = async (req, res, next) => {
    let categoryName = req.body["category-name"]

    await categoryModel.addNewCategory(categoryName);

    res.redirect('/manage-categories/dishes-categories/');
}

exports.update = async (req, res, next) => {
    let categoryId = req.params.id;

    let category = await categoryModel.getCategoryById(categoryId);

    res.render('.././components/categories/views/update', category)
}

exports.confirmUpdate = async (req, res, next) => {
    let categoryId = req.params.id

    let category = {
        category_id: categoryId,
        name: req.body['name'],
        isActive: req.body['status'] === 'Active' ? 1 : 0
    }

    await categoryModel.updateCategory(category)

    res.redirect('/manage-categories/dishes-categories/')
}