exports.index = (req, res, next) => {
    let dish = [
        {id: 1, name: "Pizza", category: "Pizza", subcategory: "Truyền thống", price: 10000, status: "Normal"},
        {id: 2, name: "Pizza", category: "Pizza", subcategory: "Truyền thống", price: 10000, status: "Normal"}];

    res.render('.././components/dishes/views/index', {dish});
}

exports.update = (req, res, next) => {
   res.render('.././components/dishes/views/update');
}

exports.add = (req, res, next) => {
    res.render('.././components/dishes/views/add', {isAddingPizza: true});
}