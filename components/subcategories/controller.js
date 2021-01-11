const subcategoryModel = require('./model')
const categoryModel = require('../categories/model')

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category!== undefined)) {
        const key_name = req.query.key_name;

        let categoryName = req.query.category;
        let currentPage = req.query.page;

        let sortBy = '1';

        let categories = await categoryModel.getAllCategory()
        let categoryId;
        if (categoryName === undefined || categoryName === "")
        {
            categoryId = categories[0].category_id;
        }
        else {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].name === categoryName) {
                    categoryId = categories[i].category_id;

                    break;
                }
            }
        }

        if (currentPage === undefined)
            currentPage = '1';

        if (req.session.totalSubcategoryPerPage === undefined) {
            req.session.totalSubcategoryPerPage = 1
        }

        let totalDishPerPage = parseInt(req.session.totalSubcategoryPerPage)


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

        let subcategories = await subcategoryModel.getAllSubcategory(currentPage, totalDishPerPage, sortBy);
        let totalResult = await subcategoryModel.totalSubcategory();

        if (key_name !== undefined) {
            subcategories = await subcategoryModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

            totalResult = await subcategoryModel.totalResultByKeyName(key_name)
        } else if (categoryId !== '') {
            subcategories = await subcategoryModel.getSubcategoryByParentCategory(categoryId, currentPage, totalDishPerPage, sortBy)

            totalResult = await subcategoryModel.totalSubcategoryByParentCategory(categoryId);
        }

        let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

        const dataContext = {
            totalResult: totalResult,
            categories: categories,
            subcategories: subcategories,
            totalDishPerPageOption: totalDishPerPageOption,
            totalPage: totalPage,
            page: currentPage,
            category: categoryId,
            isLogin: true
        }

        res.render('.././components/subcategories/views/index', dataContext);
    } else {
        this.pagination(req, res, next)
    }
}

exports.pagination = async (req, res, next) => {
    const key_name = req.query.key_name;

    let categoryName = req.query.category;
    let currentPage = req.query.page;
    let totalDishPerPage = req.query.total_dish_per_page;
    let sortBy = req.query.sortBy;

    let categories = await categoryModel.getAllCategory()
    let categoryId;
    if (categoryName === undefined || categoryName === "")
    {
        categoryId = categories[0].category_id;
    }
    else {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].name === categoryName) {
                categoryId = categories[i].category_id;

                break;
            }
        }
    }

    if (categoryId === undefined || categoryId === "")
        categoryId = '0';

    if (currentPage === undefined)
        currentPage = '1';

    if (totalDishPerPage === undefined)
        totalDishPerPage = parseInt(req.session.totalSubcategoryPerPage);
    else {
        req.session.totalSubcategoryPerPage = parseInt(totalDishPerPage);
    }

    let subcategories = await subcategoryModel.getAllSubcategory(currentPage, totalDishPerPage, sortBy);
    let totalResult = await subcategoryModel.totalSubcategory();

    if (key_name !== undefined) {
        subcategories = await subcategoryModel.searchByKeyName(key_name, currentPage, totalDishPerPage, sortBy)

        totalResult = await subcategoryModel.totalResultByKeyName(key_name)
    } else if (categoryId !== '') {
        subcategories = await subcategoryModel.getSubcategoryByParentCategory(categoryId, currentPage, totalDishPerPage, sortBy)

        totalResult = await subcategoryModel.totalSubcategoryByParentCategory(categoryId);
    }

    let totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))

    const dataContext = {
        totalResult: totalResult,
        subcategories: subcategories,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId,
        isLogin: true
    }

    res.send(dataContext)
}

exports.delete = async (req, res, next) => {
    let parentId = req.body['parent-id'];
    let subcategoryId = req.body['id'];

    const _ = await subcategoryModel.deleteSubCategoryById(parentId, subcategoryId)

    this.index(req, res, next)
}

exports.add = async (req, res, next) => {
    let categories = await categoryModel.getAllCategory()

    res.render('.././components/subcategories/views/add', {categories})
}

exports.confirmAdd = async (req, res, next) => {
    let subcategoryName = req.body["subcategory-name"]
    let parentCategory = req.body["category"]

    await subcategoryModel.addNewSubCategory(parentCategory, subcategoryName);

    res.redirect('/manage-categories/dishes-subcategories/');
}

exports.update = async (req, res, next) => {
    let subcategoryId = req.params.id;
    let parentCategoryId = req.query.parent;

    let subcategory = await subcategoryModel.getSubCategoryByIdAndParentCategory(parentCategoryId, subcategoryId);
    let categories = await categoryModel.getAllCategory()

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].category_id === subcategory.category) {
            subcategory.parentCategoryName = categories[i].name;
        }
    }

    let datacontext = {
        subcategory: subcategory,
        categories: categories
    }

    res.render('.././components/subcategories/views/update', datacontext);
}

exports.confirmUpdate = async (req, res, next) => {
    let subcategory = {
        category:  req.query.parent,
        subcategory_id: req.params.id,
        name: req.body['subcategory'],
        is_active: req.body['status']
    }

    await subcategoryModel.updateSubcategory(subcategory)

    res.redirect('/manage-categories/dishes-subcategories/')
}
