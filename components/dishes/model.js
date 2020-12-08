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

    let subcategory = 0
    switch(fields.subcategory) {
        case 'Truyền thống' :
            subcategory = 1;
            break;
        case 'Hải sản':
            subcategory = 2;
            break;
        case 'Thập cẩm':
            subcategory = 3;
            break;
    }

    let igredients = ""

    if (fields.igredients) {
        igredients = fields.igredients
    }

    let description = fields.description
    let price = parseInt(fields.price)
    let discount = fields.discount

    let sizes = []
    switch (category) {
        case 1: {
            if (fields.size1 == 'on') {
                sizes.push({
                    name: "25cm (250g)",
                })
            }

            if (fields.size2 == 'on') {
                sizes.push({
                    name: "30cm (450g)"
                })
            }

            if (fields.size3 == 'on') {
                sizes.push({
                    name: "40cm (550g)"
                })
            }
            break;
        }
        case 2: {
            if (fields.size1 == 'on') {
                sizes.push({
                    name: "L"
                })
            }

            if (fields.size2 == 'on') {
                sizes.push({
                    name: "M"
                })
            }
        }
        case 3: {
            if (fields.size1 == 'on') {
                sizes.push({
                    name: "1 Người ăn"
                })
            }

            if (fields.size2 == 'on') {
                sizes.push({
                    name: "2 Người ăn"
                })
            }
        }
    }

    let doughs = []

    if (fields.dough1 == 'on') {
        doughs.push({
            name: "Mỏng",
        })
    }

    if (fields.dough2 == 'on') {
        doughs.push({
            name: "Dày",
        })
    }

    let toppings = []

    if (fields.toping1 == 'on') {
        toppings.push({
            name: "Ớt chuông",
            img_url: "/img/toping/toping-1.jpg"
        })
    }

    if (fields.toping2 == 'on') {
        toppings.push({
            name: "Thịt xông khói",
            img_url: "/img/toping/toping-2.jpg"
        })
    }

    if (fields.toping3 == 'on') {
        toppings.push({
            name: "Nấm",
            img_url: "/img/toping/toping-3.jpg"
        })
    }

    if (fields.toping4 == 'on') {
        toppings.push({
            name: "Cải xà lách",
            img_url: "/img/toping/toping-4.jpg"
        })
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
        size: sizes,
        dough: doughs,
        topping: toppings
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

exports.listByCategory = async (categoryId, page, totalDishPerPage) => {
    return await execQuery('SELECT * FROM dishes WHERE category = ' +categoryId + ' AND is_active = 1 ORDER BY dish_id LIMIT '+totalDishPerPage+' OFFSET '+((page - 1) * totalDishPerPage))
}

exports.getDishById = async (id) => {
    const dishes = await execQuery('SELECT * FROM dishes WHERE dish_id = ' +id)

    return dishes[0]
}

exports.getListDoughById = async (id) => {
    return await execQuery('SELECT * FROM dishes_doughs where dish = ' +id)
}

exports.getListToppingById = async (id) => {
    return await execQuery('SELECT * FROM dishes_toppings where dish = ' +id)
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

exports.searchByKeyName = async (keyName) => {
    return await execQuery('SELECT * FROM dishes WHERE name LIKE \'%'+keyName+'%\' AND is_active = 1')
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
    await execQuery('INSERT INTO dishes(dish_id, name, category, subcategory, avatar, igredients, detail_description, price, discount, rate, total_reviews, status, is_active) VALUES ('+dish_id+',\''+dish.name+'\','+dish.category+','+dish.subcategory+',\''+dish.avatar+'\',\''+dish.igredients+'\',\''+dish.detail_description+'\','+dish.price+','+dish.discount+', 4, 120, 1, 1)')

    for (const size of dish.size) {
        await execQuery('INSERT INTO dishes_sizes(dish, name, extra_price, is_active) VALUES ('+dish_id+',\''+size.name+'\',20000, 1)')
    }

    if (dish.category === 1) {
        for (const dough of dish.dough) {
            await execQuery('INSERT INTO dishes_doughs(dish, name, extra_price) VALUES ('+dish_id+',\''+dough.name+'\',20000)')
        }

        for (const topping of dish.topping) {
            await execQuery('INSERT INTO dishes_toppings(dish, name, extra_price, img_url) VALUES ('+dish_id+',\''+topping.name+'\',20000,\''+topping.img_url+'\')')
        }
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

    for (const size of dish.size) {
        await execQuery('INSERT INTO dishes_sizes(dish, name, extra_price, is_active) VALUES ('+dish.dish_id+',\''+size.name+'\',20000, 1)')
    }

    if (dish.category === 1) {
        await execQuery('DELETE FROM dishes_doughs WHERE dish = '+dish.dish_id)
        for (const dough of dish.dough) {
            await execQuery('INSERT INTO dishes_doughs(dish, name, extra_price) VALUES ('+dish.dish_id+',\''+dough.name+'\',20000)')
        }

        await execQuery('DELETE FROM dishes_toppings WHERE dish = '+dish.dish_id)
        for (const topping of dish.topping) {
            await execQuery('INSERT INTO dishes_toppings(dish, name, extra_price, img_url) VALUES ('+dish.dish_id+',\''+topping.name+'\',20000,\''+topping.img_url+'\')')
        }
    }

    await execQuery('DELETE FROM dishes_images WHERE dish = '+dish.dish_id)

    let item_no = 0
    for (const image of dish.images) {
        item_no++
        await execQuery('INSERT INTO dishes_images(dish, image_no, image_url) VALUES ('+dish.dish_id+','+item_no+',\''+image.src+'\')')
    }
}

/*
exports.test = async () => {
   await execQuery('UPDATE user SET avatar = \'https://res.cloudinary.com/hcmus-web/image/upload/v1607362757/WebFinalProject/Images/user/1/73083634_2453241641624544_6378836173334249472_o_z20x96.jpg\' where user_id = 1')
    await execQuery('UPDATE user SET avatar = \'https://res.cloudinary.com/hcmus-web/image/upload/v1607362758/WebFinalProject/Images/user/2/125188747_1812004398964904_2867076902945476380_n_k0xc51.jpg\' where user_id = 2')
}*/
