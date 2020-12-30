const dishModel = require('./model')

const formidable = require('formidable');
const fs = require('fs')
const path = require('path');
const rimraf = require('rimraf')

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

exports.index = async (req, res, next) => {
    if ((Object.keys(req.query).length === 0 && req.query.constructor === Object) || (Object.keys(req.query).length === 1 && req.query.category!== undefined)) {
        const key_name = req.query.key_name;

        let categoryId = req.query.category;
        let currentPage = req.query.page;
        let totalDishPerPage = req.query.total_dish_per_page;

        let sortBy = '1';

        if (categoryId === undefined || categoryId === "")
            categoryId = '1';

        if (currentPage === undefined)
            currentPage = '1';

        if (totalDishPerPage === undefined)
            totalDishPerPage = '1';

        let totalPage;
        let dishes;
        let totalResult = 0;

        let isPizzaSelected = false;
        let isDrinkSelected = false;
        let isSideSelected = false;

        /*console.log("Key name: ", key_name)*/

        if (key_name !== undefined) {
            dishes = await dishModel.searchByKeyName(key_name)

            totalResult = dishes.length
        } else {
            dishes = await dishModel.listByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

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

        let totalDishPerPageOption1Selected = false;
        let totalDishPerPageOption2Selected = false;
        let totalDishPerPageOption3Selected = false;

        switch (totalDishPerPage) {
            case '1':
                totalDishPerPageOption1Selected = true;
                break;
            case '2':
                totalDishPerPageOption2Selected = true;
                break;
            case '3':
                totalDishPerPageOption3Selected = true;
                break;

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
            totalDishPerPageOption1Selected: totalDishPerPageOption1Selected,
            totalDishPerPageOption2Selected: totalDishPerPageOption2Selected,
            totalDishPerPageOption3Selected: totalDishPerPageOption3Selected,
            totalResult: totalResult,
            dishes: dishes,
            totalPage: totalPage,
            page: currentPage,
            category: categoryId,
            isLogin: true
        }

        /*console.log(dataContext)*/

        res.render('.././components/dishes/views/index', dataContext);
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

    console.log(sortBy)
    /*console.log(req.query)*/

    if (categoryId === undefined || categoryId === "")
        categoryId = '1';

    if (currentPage === undefined)
        currentPage = '1';

    if (totalDishPerPage === undefined)
        totalDishPerPage = '1';

    let totalPage;
    let dishes;
    let totalResult = 0;

    let isPizzaSelected = false;
    let isDrinkSelected = false;
    let isSideSelected = false;

    /*console.log("Key name: ", key_name)*/

    if (key_name !== undefined) {
        dishes = await dishModel.searchByKeyName(key_name)

        totalResult = dishes.length
    } else {
        dishes = await dishModel.listByCategory(categoryId, currentPage, totalDishPerPage, sortBy)

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

    let totalDishPerPageOption1Selected = false;
    let totalDishPerPageOption2Selected = false;
    let totalDishPerPageOption3Selected = false;

    switch (totalDishPerPage) {
        case '1':
            totalDishPerPageOption1Selected = true;
            break;
        case '2':
            totalDishPerPageOption2Selected = true;
            break;
        case '3':
            totalDishPerPageOption3Selected = true;
            break;

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
        totalDishPerPageOption1Selected: totalDishPerPageOption1Selected,
        totalDishPerPageOption2Selected: totalDishPerPageOption2Selected,
        totalDishPerPageOption3Selected: totalDishPerPageOption3Selected,
        totalResult: totalResult,
        dishes: dishes,
        totalPage: totalPage,
        page: currentPage,
        category: categoryId,
        isLogin: true
    }

    res.send(dataContext)
}

exports.delete = async (req, res, next) => {
    console.log(req.body['id'])

    const _ = await dishModel.delete(req.body['id'])

    this.index(req, res, next)
}

exports.update = async (req, res, next) => {
    let categoryParams = req.query.category

    let dish_id = req.params.id

    let dish = await dishModel.getDishById(dish_id)
    let images = await dishModel.getListImageById(dish_id)
    let size = await dishModel.getListSizeById(dish_id)
    let dough = await dishModel.getListDoughById(dish_id)
    let topping = await dishModel.getListToppingById(dish_id)

    let isPizzaSelected = false;
    let isDrinkSelected = false;
    let isSideSelected = false;

    /* console.log(categoryId)*/
    if (categoryParams !== undefined) {
        categoryParams = parseInt(categoryParams)
        switch (categoryParams) {
            case 1:
                isPizzaSelected = true;
                break;

            case 2:
                isDrinkSelected = true;
                break;

            case 3:
                isSideSelected = true;
                break;
        }

        if (categoryParams !== dish.category) {
            for (let s of size) {
                s.name = ''
            }
        }
    } else {
        switch (dish.category) {
            case 1:
                isPizzaSelected = true;
                break;

            case 2:
                isDrinkSelected = true;
                break;

            case 3:
                isSideSelected = true;
                break;
        }
    }

    let dataContext = dish

    dataContext.isPizzaSelected = isPizzaSelected
    dataContext.isDrinkSelected = isDrinkSelected
    dataContext.isSideSelected = isSideSelected
    dataContext.images = images
    dataContext.size = size
    dataContext.dough = dough
    dataContext.topping = topping

    console.log(dataContext)

    res.render('.././components/dishes/views/update', dataContext);
}

exports.updateInfo = async (req, res, next) => {
    fs.mkdirSync(path.join(__dirname, '..', 'tempImages'), { recursive: true })
    const form = formidable({multiples: true, keepExtensions: true, uploadDir : path.join(__dirname, '..', 'tempImages')})

    let oldDish =  await dishModel.getDishById(req.params.id)
    let oldImages = await dishModel.getListImageById(req.params.id)

    await form.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }

        let dish = await dishModel.modify(fields);
        dish.dish_id = req.params.id

        let categoryName;
        switch (dish.category) {
            case 1:
                categoryName = 'pizza';
                break;
            case 2:
                categoryName = 'drink';
                break;
            case 3:
                categoryName = 'side';
                break;
        }

        const avatarPicker = files.avatarPicker
        if (avatarPicker) {
            if (avatarPicker.name) {
                await cloudinary.uploader.upload(avatarPicker.path,
                    {
                        folder: 'WebFinalProject/Images/'+categoryName+'/'+dish._id,
                        public_id: 'avatar',
                        overwrite: true
                    }, (err, res) => {
                        dish.avatar = res.secure_url
                    })
            }
            else {
                dish.avatar = ""
            }
        } else {
            dish.avatar = oldDish.avatar
        }

        let images = []

        const descriptionPicker1 = files.descriptionPicker1
        if (descriptionPicker1) {
            if (descriptionPicker1.name) {
                await cloudinary.uploader.upload(descriptionPicker1.path,
                    {
                        folder: 'WebFinalProject/Images/'+categoryName+'/'+dish._id,
                        public_id: 'description-1',
                        overwrite: true
                    }, (err, res) => {
                        images.push({src: res.secure_url})
                    })
            }
            else {
                images.push({src: ""})
            }
        } else {
            images.push({src: oldImages[0].image_url})
        }

        console.log(oldImages)

        const descriptionPicker2 = files.descriptionPicker2
        if (descriptionPicker2) {
            if (descriptionPicker2.name) {
                await cloudinary.uploader.upload(descriptionPicker2.path,
                    {
                        folder: 'WebFinalProject/Images/'+categoryName+'/'+dish._id,
                        public_id: 'description-2',
                        overwrite: true
                    }, (err, res) => {
                        images.push({src: res.secure_url})
                    })
            }
            else {
                images.push({src: ""})
            }
        } else {
            images.push({src: oldImages[1].image_url})
        }

        const descriptionPicker3 = files.descriptionPicker3
        if (descriptionPicker3) {
            if (descriptionPicker3.name) {
                await cloudinary.uploader.upload(descriptionPicker3.path,
                    {
                        folder: 'WebFinalProject/Images/'+categoryName+'/'+dish._id,
                        public_id: 'description-3',
                        overwrite: true
                    }, (err, res) => {
                        images.push({src: res.secure_url})
                    })
            }
            else {
                images.push({src: ""})
            }
        } else {
            images.push({src: oldImages[2].image_url})
        }

        const descriptionPicker4 = files.descriptionPicker4
        if (descriptionPicker4) {
            if (descriptionPicker4.name) {
                await cloudinary.uploader.upload(descriptionPicker4.path,
                    {
                        folder: 'WebFinalProject/Images/'+categoryName+'/'+dish._id,
                        public_id: 'description-4',
                        overwrite: true
                    }, (err, res) => {
                        images.push({src: res.secure_url})
                    })
            }
            else {
                images.push({src: ""})
            }
        } else {
            images.push({src: oldImages[3].image_url})
        }

        //console.log(pizza)
        dish.images = images

        console.log(dish)
        const _ = await dishModel.update(dish)

        rimraf.sync(path.join(__dirname, '..', 'tempImages'))

        this.update(req, res, next)
    })
}

exports.add = (req, res, next) => {
    let categoryId = req.query.category

    if (categoryId === undefined || categoryId === "")
        categoryId = '1';

    let isPizzaSelected = false;
    let isDrinkSelected = false;
    let isSideSelected = false;

   /* console.log(categoryId)*/

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

    const dataContext = {
        isPizzaSelected: isPizzaSelected,
        isDrinkSelected: isDrinkSelected,
        isSideSelected: isSideSelected,
        isLogin: true
    }

    res.render('.././components/dishes/views/add', dataContext);
}

exports.addInfo = async (req, res, next) => {
    fs.mkdirSync(path.join(__dirname, '..', 'tempImages'), { recursive: true })
    const form = formidable({multiples: true, keepExtensions: true, uploadDir : path.join(__dirname, '..', 'tempImages')})

    await form.parse(req, async (err, fields, files) => {
        if (err) {
            return
        }

        let dish = await dishModel.modify(fields)
        dish.images = []

        let categoryName;
        switch (dish.category) {
            case 1:
                categoryName = 'pizza';
                break;
            case 2:
                categoryName = 'drink';
                break;
            case 3:
                categoryName = 'side';
                break;
        }

        const avatarPicker = files.avatarPicker
        if (avatarPicker.name) {
            await cloudinary.uploader.upload(avatarPicker.path,
                {
                    folder: 'WebFinalProject/Images/'+categoryName+'/'+dish.dish_id,
                    public_id: 'avatar',
                    overwrite: true
                }, (err, res) => {
                    dish.avatar = res.secure_url
                })
        }

        const descriptionPicker1 = files.descriptionPicker1
        if (descriptionPicker1.name) {
            //upload description
            await cloudinary.uploader.upload(descriptionPicker1.path,
                {
                    folder: 'WebFinalProject/Images/'+categoryName+'/'+dish.dish_id,
                    public_id: 'description-1',
                    overwrite: true
                }, (err, res) => {
                    dish.images.push({src: res.secure_url})
                })
        } else {
            dish.images.push({src: ""})
        }

        const descriptionPicker2 = files.descriptionPicker2
        if (descriptionPicker2.name) {
            //upload description
            await cloudinary.uploader.upload(descriptionPicker2.path,
                {
                    folder: 'WebFinalProject/Images/'+categoryName+'/'+dish._id,
                    public_id: 'description-2',
                    overwrite: true
                }, (err, res) => {
                    dish.images.push({src: res.secure_url})
                })
        } else {
            dish.images.push({src: ""})
        }

        const descriptionPicker3 = files.descriptionPicker3
        if (descriptionPicker3.name) {
            //upload description
            await cloudinary.uploader.upload(descriptionPicker3.path,
                {
                    folder: 'WebFinalProject/Images/'+categoryName+'/'+dish._id,
                    public_id: 'description-3',
                    overwrite: true
                }, (err, res) => {
                    dish.images.push({src: res.secure_url})
                })
        } else {
            dish.images.push({src: ""})
        }

        const descriptionPicker4 = files.descriptionPicker4
        if (descriptionPicker4.name) {
            //upload description
            await cloudinary.uploader.upload(descriptionPicker4.path,
                {
                    folder: 'WebFinalProject/Images/'+categoryName+'/'+dish._id,
                    public_id: 'description-4',
                    overwrite: true
                }, (err, res) => {
                    dish.images.push({src: res.secure_url})
                })
        } else {
            dish.images.push({src: ""})
        }

        /*console.log(dish)*/
        const _ = await dishModel.insert(dish)

        rimraf.sync(path.join(__dirname, '..', 'tempImages'))

        this.add(req, res, next)
    })
}