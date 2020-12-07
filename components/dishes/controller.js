const dishModel = require('./model')

exports.index = async (req, res, next) => {
    const key_name = req.query.key_name;

    let categoryId = req.query.category;
    let currentPage = req.query.page;
    let totalDishPerPage = req.query.total_dish_per_page;

    console.log(req.query)

    if (categoryId === undefined || categoryId === "")
        categoryId = 1;

    if (currentPage === undefined)
        currentPage = 1;

    if (totalDishPerPage === undefined)
        totalDishPerPage = 1;

    let totalPage;
    let dishes;
    let totalResult = 0;

    let isPizzaSelected = false;
    let isDrinkSelected = false;
    let isSideSelected = false;

    console.log("Key name: ", key_name)

    if (key_name !== undefined) {
        dishes = await dishModel.searchByKeyName(key_name)

        totalResult = dishes.length
    } else {
        dishes = await dishModel.listByCategory(categoryId, currentPage, totalDishPerPage)

        totalResult = await dishModel.totalDishByCategory(categoryId);

        switch (categoryId) {
            case '1':
                isPizzaSelected = true;
                break;

            case '2':
                isDrinkSelected = true;
                break;

            case '3':
                isSideSelected = true;
                break;
        }

        totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))
    }

    for (let dish of dishes) {
        dish.categoryName = await dishModel.getCategoryName(dish.category)
        dish.subCategoryName = await dishModel.getSubCategoryName(dish.subcategory)

        const statusTitle = ['Đã xóa', 'Còn hàng', 'Hết hàng']
        dish.statusName = statusTitle[dish.status]
    }

    const dataContext = {
        isPizzaSelected: isPizzaSelected,
        isDrinkSelected: isDrinkSelected,
        isSideSelected: isSideSelected,
        totalResult: totalResult,
        dishes: dishes,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId
    }

    console.log(dataContext)

    res.render('.././components/dishes/views/index', dataContext);
}

exports.update = (req, res, next) => {
   res.render('.././components/dishes/views/update');
}

exports.add = (req, res, next) => {
    res.render('.././components/dishes/views/add', {isAddingPizza: true});
}