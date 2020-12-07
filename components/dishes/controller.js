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

    console.log("Key name: ", key_name)

    if (key_name !== undefined) {
        dishes = await dishModel.searchByKeyName(key_name)
        totalResult = dishes.length
    } else {
        dishes = await dishModel.listByCategory(categoryId, currentPage, totalDishPerPage)
        totalResult = await dishModel.totalDishByCategory(categoryId);

        totalPage = Math.ceil(totalResult / (totalDishPerPage * 1.0))
    }

    const dataContext = {
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