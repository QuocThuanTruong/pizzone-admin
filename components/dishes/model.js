const {db} = require('../../dal/db')

function execQuery(queryString) {
    return new Promise(data => {
/*        console.log(queryString)*/

        db.query(queryString, (err, results, fields) => {
            if (err) {
                console.log(err)
            } else {
                try {
                    data(results);
                } catch (error) {
                    data({});
                    throw error;
                }
            }
        })
    })
}

exports.modify = async (fields) => {
    let dish_id = (await this.getMaxId()) + 1

    let name = fields.name

    let category = 0;
    switch(fields.category) {
        case 'Pizza' :
            category = 1;
            break;
        case 'Thức uống':
            category = 2;
            break;
        case 'Đồ ăn kèm':
            category = 3;
            break;
    }

    let subcategories = await this.getListSubcategory(category);

    let subcategory = 0

    for (let i = 0; i < subcategories.length; i++) {
        if (subcategories[i].name === fields.subcategory) {
            subcategory = subcategories[i].subcategory_id;
            break;
        }
    }

    let igredients = ""

    if (fields.igredients) {
        igredients = fields.igredients
    }

    let description = fields.description
    let price = parseInt(fields.price)
    let discount = fields.discount

    let sizeNames = [];
    let sizePricesString = [];
    if (fields.sizeNames.indexOf(',') !== -1) {
        sizeNames = fields.sizeNames.split(',')
        sizePricesString = fields.sizePrices.split(',')
    } else {
        sizeNames = [fields.sizeNames]
        sizePricesString = fields.sizePrices
    }

    let sizePrice = []
    for (let i = 0; i < sizePricesString.length; i++) {
        sizePrice.push(parseInt(sizePricesString[i]))
    }

    return {
        dish_id: dish_id,
        name: name,
        category: category,
        subcategory: subcategory,
        avatar: "",
        igredients: igredients,
        detail_description: description,
        price: price,
        discount: discount,
        sizeNames: sizeNames,
        sizePrice: sizePrice,
    }
}

exports.dishlist = async (page, totalDishPerPage) => {
    return await execQuery('SELECT * FROM dishes WHERE is_active = 1 ORDER BY dish_id LIMIT '+totalDishPerPage+' OFFSET '+((page - 1) * totalDishPerPage))
}

exports.pizzaList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 1 AND is_active = 1')
}

exports.drinkList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 2 AND is_active = 1')
}

exports.sideList = async () => {
    return await execQuery('SELECT * FROM dishes WHERE category = 3 AND is_active = 1')
}

exports.listByCategory = async (categoryId, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'created_date';
            break;
        case '2':
            sort = 'name';
            break;
        case '3':
            sort = 'price DESC';
            break;
        case '4':
            sort = 'price ASC';
            break;
    }

    return await execQuery('SELECT * FROM dishes WHERE category = ' +categoryId + ' AND is_active = 1 ORDER BY '+ sort +' LIMIT '+totalDishPerPage+' OFFSET '+((page - 1) * totalDishPerPage))
}

exports.getDishById = async (id) => {
    const dishes = await execQuery('SELECT * FROM dishes WHERE dish_id = ' +id)

    return dishes[0]
}

exports.getListSizeById = async (id) => {
    return await execQuery('SELECT * FROM dishes_sizes where dish = ' +id)
}

exports.getListImageById = async (id) => {
    return await execQuery('SELECT * FROM dishes_images where dish = ' +id)
}

exports.getCategoryName = async (categoryId) => {
    const category = await execQuery('SELECT * FROM dishes_category WHERE category_id = ' +categoryId)

    return category[0].name
}

exports.getSubCategoryName = async (subCategoryId) => {
    const subCategory = await execQuery('SELECT * FROM dishes_subcategory WHERE subcategory_id = ' +subCategoryId)

    return subCategory[0].name
}

exports.getSubCategory = async (id) => {
    const subCategory = await execQuery('SELECT * FROM dishes_subcategory WHERE subcategory_id = ' +id)

    return subCategory[0]
}

exports.getListSubcategory = async (id) => {
    return await execQuery('SELECT * FROM dishes_subcategory where category = ' + id + ' and is_active = 1');
}

exports.totalDish = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes WHERE is_active = 1')

    return queryResult[0].total
}

exports.totalPizza = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 1  AND is_active = 1')

    return queryResult[0].total
}

exports.totalDrink = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 2  AND is_active = 1')

    return queryResult[0].total
}

exports.totalSide = async () => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = 3 AND is_active = 1')

    return queryResult[0].total
}

exports.totalDishByCategory = async (categoryId) => {
    const queryResult =  await execQuery('SELECT COUNT(*) as total FROM dishes where category = '+categoryId+' AND is_active = 1')

    return queryResult[0].total
}

exports.searchByKeyName = async (keyName, page, totalDishPerPage, sortBy) => {
    let sort = '';
    switch (sortBy) {
        case '1':
            sort = 'created_date';
            break;
        case '2':
            sort = 'name';
            break;
        case '3':
            sort = 'price DESC';
            break;
        case '4':
            sort = 'price ASC';
            break;
    }

    let query = 'SELECT * FROM dishes WHERE MATCH(name) AGAINST(\''+keyName+'\') AND is_active = 1  ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    return await execQuery(query)
}

exports.totalDishByKeyName = async (keyName) => {
    let query = 'SELECT COUNT(dish_id) as total FROM dishes WHERE MATCH(name) AGAINST(\''+keyName+'\') AND is_active = 1';

    let result = await execQuery(query);

    return result[0].total
}


exports.delete = async (id) => {
    const _ = await execQuery('UPDATE dishes SET is_active = 0 WHERE dish_id = '+id)
}

exports.getMaxId = async () => {
    const result = await execQuery('SELECT MAX(dish_id) as max from dishes')

    return result[0].max
}

exports.insert = async (dish) => {
    const dish_id = (await this.getMaxId()) + 1
    await execQuery('INSERT INTO dishes(dish_id, name, category, subcategory, avatar, igredients, detail_description, price, discount, rate, total_reviews, status, is_active) VALUES ('+dish_id+',\''+dish.name+'\','+dish.category+','+dish.subcategory+',\''+dish.avatar+'\',\''+dish.igredients+'\',\''+dish.detail_description+'\','+dish.price+','+dish.discount+', 0, 0, 1, 1)')

    for (let i = 0; i < dish.sizeNames.length; i++) {
        await execQuery('INSERT INTO dishes_sizes(size_id, dish, name, extra_price, is_active) VALUES ('+ (i + 1) + ', ' +dish_id+',\''+dish.sizeNames[i]+'\','+dish.sizePrice[i]+', 1)')
    }

    let item_no = 0
    for (const image of dish.images) {
        item_no++
        await execQuery('INSERT INTO dishes_images(dish, image_no, image_url) VALUES ('+dish_id+','+item_no+',\''+image.src+'\')')
    }
}

exports.update = async (dish) => {
    await execQuery('UPDATE dishes SET name = \''+dish.name+'\', category = '+dish.category+', subcategory = '+dish.subcategory+', avatar = \''+dish.avatar+'\',igredients = \''+dish.igredients+'\', detail_description = \''+dish.detail_description+'\',price = '+dish.price+', discount = '+dish.discount+' where dish_id = '+dish.dish_id)

    await execQuery('DELETE FROM dishes_sizes WHERE dish = '+dish.dish_id)

    for (let i = 0; i < dish.sizeNames.length; i++) {
        await execQuery('INSERT INTO dishes_sizes(size_id, dish, name, extra_price, is_active) VALUES ('+ (i + 1) + ', ' +dish.dish_id+',\''+dish.sizeNames[i]+'\','+dish.sizePrice[i]+', 1)')
    }

    await execQuery('DELETE FROM dishes_images WHERE dish = '+dish.dish_id)

    let item_no = 0
    for (const image of dish.images) {
        item_no++
        await execQuery('INSERT INTO dishes_images(dish, image_no, image_url) VALUES ('+dish.dish_id+','+item_no+',\''+image.src+'\')')
    }
}

exports.getAllDish = async () => {
    return await execQuery('SELECT * FROM dishes')
}

exports.getTopDish = async (limit) => {

}
/*
exports.test = async () => {
   await execQuery('UPDATE users SET avatar = \'https://res.cloudinary.com/hcmus-web/image/upload/v1607362757/WebFinalProject/Images/user/1/73083634_2453241641624544_6378836173334249472_o_z20x96.jpg\' where user_id = 1')
    await execQuery('UPDATE users SET avatar = \'https://res.cloudinary.com/hcmus-web/image/upload/v1607362758/WebFinalProject/Images/user/2/125188747_1812004398964904_2867076902945476380_n_k0xc51.jpg\' where user_id = 2')
}*/
