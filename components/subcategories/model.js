const {db} = require('../../dal/db')
const categoryModel = require('../categories/model')
const userModel = require('../users/model')

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

async function fullSubCategoryInfo(subcategories) {
    for (let i = 0; i < subcategories.length; i++) {
        switch (subcategories[i].is_active) {
            case 0:
                subcategories[i].subcategoryStatusActive = 'locked';
                subcategories[i].isActive = false;
                subcategories[i].status_name_uppercase = '̣ĐANG CHUẨN BỊ';
                break;
            case 1:
                subcategories[i].subcategoryStatusActive = 'active';
                subcategories[i].isActive = true;
                subcategories[i].status_name_uppercase = '̣ĐANG GIAO HÀNG';
                break;
        }

        subcategories[i].parentCategory = await categoryModel.getCategoryById(subcategories[i].category);
    }

    return subcategories
}

exports.getAllSubcategory = async (page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'name asc';
            break;
        case '2':
            sort = 'name desc';
            break;
    }

    let subcategories = await execQuery('SELECT * from dishes_subcategory where is_active <> -1 ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return await fullSubCategoryInfo(subcategories);
}

exports.totalSubcategory = async () => {
    let query = 'SELECT COUNT(subcategory_id) as total FROM dishes_subcategory where is_active <> -1';

    let result = await execQuery(query)

    return result[0].total
}

exports.searchByKeyName = async (keyName, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'name asc';
            break;
        case '2':
            sort = 'name desc';
            break;
    }

    let query = 'SELECT * from dishes_subcategory WHERE MATCH(name) AGAINST(\''+keyName+'\') and is_active <> -1 ORDER BY ' + sort + ' LIMIT ' +totalDishPerPage + ' OFFSET '+((page - 1) * totalDishPerPage)
    let subcategories = await execQuery(query)

    return await fullSubCategoryInfo(subcategories);
}

exports.totalResultByKeyName = async (keyName) => {
    keyName = decodeURIComponent(keyName)

    let query = 'SELECT COUNT(*) as total FROM dishes_subcategory WHERE MATCH(name) AGAINST(\''+keyName+'\') and is_active <> -1'

    let result = await execQuery(query);

    return result[0].total
}

exports.getSubcategoryByParentCategory = async (parentCategoryId, page, totalDishPerPage, sortBy) => {
    let sort = '';

    switch (sortBy) {
        case '1':
            sort = 'name asc';
            break;
        case '2':
            sort = 'name desc';
            break;
    }

    let subcategories = await execQuery('SELECT * from dishes_subcategory where is_active <> -1 and category = ' + parentCategoryId + ' ORDER BY ' + sort + ' LIMIT ' + totalDishPerPage + ' OFFSET ' +((page - 1) * totalDishPerPage))

    return await fullSubCategoryInfo(subcategories);
}

exports.totalSubcategoryByParentCategory = async (parentCategoryId) => {
    let query = 'SELECT COUNT(*) as total from dishes_subcategory where is_active <> -1 and category = ' + parentCategoryId;

    let result = await execQuery(query);

    return result[0].total
}

exports.deleteSubCategoryById = async (parentCategoryId, subcategoryId) => {
    await execQuery('UPDATE dishes_subcategory SET is_active = -1 where subcategory_id = ' + subcategoryId + ' and category = ' + parentCategoryId)
}

exports.addNewSubCategory = async (parentCategoryId, subcategoryName) => {
    let subcategoryId = await this.getMaxSubcategoryIdByParentCategoryId(parentCategoryId) + 1;

    let exists = await this.isExistsSubcategory(parentCategoryId, subcategoryName)

    if (exists) {
        await execQuery('UPDATE dishes_subcategory set is_active = 1 where name = \'' + subcategoryName + '\' and category = ' + parentCategoryId)
    } else {
        await execQuery('INSERT INTO dishes_subcategory (category, subcategory_id, name, is_active) values(' + parentCategoryId + ', ' + subcategoryId + ', \'' + subcategoryName + '\', 1)');
    }
}

exports.getMaxSubcategoryIdByParentCategoryId = async (parenCategoryId) => {
    const result = await execQuery('SELECT MAX(subcategory_id) as max from dishes_subcategory where category = ' + parenCategoryId)

    return result[0].max
}

exports.isExistsSubcategory = async (parentCategoryId, subcategoryName) => {
    let result = await execQuery('SELECT EXISTS(SELECT * FROM dishes_subcategory WHERE name = \''+subcategoryName+'\' and category = ' + parentCategoryId + ') as e')

    return result[0].e;
}

exports.getSubCategoryByIdAndParentCategory = async (parentCategoryId, subcategoryId) => {
    let result = await execQuery('SELECT * FROM dishes_subcategory WHERE subcategory_id = ' + subcategoryId + ' and is_active <> -1 and category = ' + parentCategoryId);

    result = await fullSubCategoryInfo(result);

    return result[0];
}

exports.updateSubcategory = async (subcategory) => {
    await execQuery('UPDATE dishes_subcategory SET name = \'' + subcategory.name + '\', is_active = ' + subcategory.is_active + ' WHERE subcategory_id = ' + subcategory.subcategory_id + ' and category = ' + subcategory.category)
}