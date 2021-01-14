function getID(id, parentId) {
    let inputID = document.createElement("input")
    let inputParentID = document.createElement("input")

    inputID.id = "id"
    inputID.name = "id"
    inputID.value = id
    inputID.type = "hidden"

    inputParentID.id = "parent-id"
    inputParentID.name = "parent-id"
    inputParentID.value = parentId
    inputParentID.type = "hidden"

    document.body.appendChild(inputID);
    document.body.appendChild(inputParentID);
}

function confirmDelete(urlDelete) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = urlDelete;

    const inputID = document.getElementById('id')
    const inputParentID = document.getElementById('parent-id')

    form.appendChild(inputID);
    form.appendChild(inputParentID);

    document.body.appendChild(form);

    form.submit()
}

function gotoPage(page) {
    const category = $('#category').find(":selected").text();

    const totalDishPerPageArr = [4, 6, 8]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2, 3, 4]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    let url='/manage-dishes?category=' + category + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render dishes
            let dishesTemplate = Handlebars.compile($('#main-manage-dish-template').html());
            let dishes = dishesTemplate({dishes: data.dishes})
            $('#main-manage-dish').html(dishes)

           //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#pagination-template").html());
            let pageNavigation = paginationTemplate({category: data.category, page : data.page, totalPage: data.totalPage})
            $('#pagination').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)

        },
        error: function (err) {
            console.log(err)
        }
    })
}

function gotoPageAccount(page) {
    const categories = [-1, 0, 1]
    const category = categories[document.getElementById('category').selectedIndex]

    const totalDishPerPageArr = [4, 6, 8]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    let url='/manage-users?category=' + category + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render dishes
            let accountsTemplate = Handlebars.compile($('#main-manage-account-template').html());
            let accounts = accountsTemplate({accounts: data.accounts})
            $('#main-manage-account').html(accounts)

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#pagination-template").html());
            let pageNavigation = paginationTemplate({page : data.page, totalPage: data.totalPage})
            $('#pagination').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function gotoPageOrder(page) {
    const categories = [0, 1, 2, 3]
    const category = categories[document.getElementById('category').selectedIndex]

    const totalDishPerPageArr = [4, 6, 8]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    let url='/manage-orders?category=' + category + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render dishes
            let ordersTemplate = Handlebars.compile($('#main-manage-order-template').html());
            let orders = ordersTemplate({orders: data.orders})
            $('#main-manage-order').html(orders)

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#pagination-template").html());
            let pageNavigation = paginationTemplate({page : data.page, totalPage: data.totalPage})
            $('#pagination').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function gotoPageCategory(page) {
    const totalDishPerPageArr = [4, 6, 8]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    let url='/manage-categories/dishes-categories?page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)

            //render dishes
            let categoriesTemplate = Handlebars.compile($('#main-manage-category-template').html());
            let categories = categoriesTemplate({categories: data.categories})
            $('#main-manage-category').html(categories)

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#pagination-template").html());
            let pageNavigation = paginationTemplate({page : data.page, totalPage: data.totalPage})
            $('#pagination').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function gotoPageSubcategory(page) {
    const category =  $('#category').find(":selected").text();
    console.log(category)

    const totalDishPerPageArr = [4, 6, 8]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    let url='/manage-categories/dishes-subcategories?category=' + category + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render dishes
            let subcategoryTemplate = Handlebars.compile($('#main-manage-subcategory-template').html());
            let subcategories = subcategoryTemplate({subcategories: data.subcategories})
            $('#main-manage-subcategory').html(subcategories)

            console.log(subcategories)

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#pagination-template").html());
            let pageNavigation = paginationTemplate({page : data.page, totalPage: data.totalPage})
            $('#pagination').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function gotoPageHotDeal(page) {
    const categories = [1, 0]
    const category = categories[document.getElementById('category').selectedIndex]

    const totalDishPerPageArr = [4, 6, 8]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2, 3]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    let url='/manage-hot-deals?category=' + category + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render dishes
            let hotdealTemplate = Handlebars.compile($('#main-manage-hot-deal-template').html());
            let hotdeals = hotdealTemplate({hotdeals: data.hotdeals})
            $('#main-manage-hot-deal').html(hotdeals)

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#pagination-template").html());
            let pageNavigation = paginationTemplate({page : data.page, totalPage: data.totalPage})
            $('#pagination').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function gotoPageVoucher(page) {
    const categories = [1, 0]
    const category = categories[document.getElementById('category').selectedIndex]

    const totalDishPerPageArr = [4, 6, 8]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2, 3]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    let url='/manage-vouchers?category=' + category + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render dishes
            let voucherTemplate = Handlebars.compile($('#main-manage-voucher-template').html());
            let vouchers = voucherTemplate({vouchers: data.vouchers})
            $('#main-manage-voucher').html(vouchers)

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#pagination-template").html());
            let pageNavigation = paginationTemplate({page : data.page, totalPage: data.totalPage})
            $('#pagination').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function gotoPageShipping(page) {
    const categories = [1, 0]
    const category = categories[document.getElementById('category').selectedIndex]

    const totalDishPerPageArr = [4, 6, 8]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2, 3]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    let url='/manage-shipping-fees?category=' + category + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

    let keyName = document.getElementById('key-name').value;
    if (keyName.length > 0) {
        url += '&key_name=' + keyName;
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            //render dishes
            let shippingTemplate = Handlebars.compile($('#main-manage-shipping-template').html());
            let shippings = shippingTemplate({shippings: data.shippings})
            $('#main-manage-shipping').html(shippings)

            //render pagination-navigation
            let paginationTemplate = Handlebars.compile($("#pagination-template").html());
            let pageNavigation = paginationTemplate({page : data.page, totalPage: data.totalPage})
            $('#pagination').html(pageNavigation)

            //render total result
            let totalResultTemplate = Handlebars.compile($("#total-result-template").html());
            let totalResult = totalResultTemplate({totalResult: data.totalResult})
            $('#total-result').html(totalResult)
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function changeCategory() {
    document.getElementById('key-name').value = '';

    gotoPage( 1)
}

function changeCategoryAccount() {
    document.getElementById('key-name').value = '';

    gotoPageAccount(1)
}

function changeCategoryOrder() {
    document.getElementById('key-name').value = '';

    gotoPageOrder(1)
}

function changeCategoryAdd() {
    const category = $('#category').find(":selected").text();

    reloadPage(category)
}

function reloadPage(category) {
    if (category === undefined)
        category = ""

    const url='/manage-dishes/add?category='+category;

    $.get(url, () => {

    })

    window.location.replace(url)
}

function checkUser() {
    let username = document.getElementById('username-sign-in').value;
    let password = document.getElementById('password-sign-in').value;
    let result = true;

    const url='auth/api/check-user?username=' + username + '&password=' + password;
    console.log(url)
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)

            if (!data) {
                result = false;

                $('#alertInvalidAuth').css('display', 'flex');
            } else {
                $('#login-form').submit();
            }
        },
        error: function (err) {
            console.log(err)
        }
    })

    return result;
}

function closeLoginAlert() {
    $('#alertInvalidAuth').css('display', 'none');
}

function addSize() {
    let sizeName = document.getElementById('size-name').value;
    let sizePrice = parseInt(document.getElementById('size-price').value);
    let sizePriceStr = standardPrice(sizePrice)

    $('#size-list').append('<li>'+sizeName+' (+'+sizePriceStr+')<span class="close" onclick="removeSize(this.parentNode)">x</span><input type="hidden" name="size-name[]" value="'+sizeName+'"/><input type="hidden" name="size-price[]" value="'+sizePrice+'"/></li>')
    $('#size-name').val("");
    $('#size-price').val("")
}

function removeSize(item) {
    item.parentNode.removeChild(item);
}

function checkForm(hasSubcategory) {
    let result = true;
    if (!hasSubcategory) {
        $('#alertMissingSubcate').css('display', 'flex');
        return false;
    }

    let sizeNamesInput = document.getElementsByName('size-name[]');
    let sizePricesInput = document.getElementsByName('size-price[]');

    let sizeNamesValue = []
    for (let i = 0; i < sizeNamesInput.length; i++) {
        sizeNamesValue.push(sizeNamesInput[i].value)
    }

    let sizePricesValue = []
    for (let i = 0; i < sizePricesInput.length; i++) {
        sizePricesValue.push(sizePricesInput[i].value)
    }

    if (sizeNamesValue.length === 0) {
        $('#alertMissingSize').css('display', 'flex');
        return false;
    }

    $('#new-dish-form').append('<input type="hidden" name="sizeNames" value="'+sizeNamesValue+'"/>')
    $('#new-dish-form').append('<input type="hidden" name="sizePrices" value="'+sizePricesValue+'"/>')

    $('#new-dish-form').submit()
}

function closeMissingSizeAlert() {
    $('#alertMissingSize').css('display', 'none');
}

function closeMissingSubcategoryAlert() {
    $('#alertMissingSubcate').css('display', 'none');
}

function standardPrice(price) {
    let priceStr = price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').toString()

    return priceStr.substr(0, priceStr.length - 3) + 'đ'
}

function lockAccount(user_id) {
    let url = '/manage-users/lock/' + user_id;
    $.get(url).done(
        window.location.replace('/manage-users/detail/' + user_id)
    )
}

function unlockAccount(user_id) {
    let url = '/manage-users/unlock/' + user_id;
    $.get(url).done(
        window.location.replace('/manage-users/detail/' + user_id)
    )
}

function updateOrder(order_id) {
    let status = document.getElementById('sort-by').selectedIndex;
    let url = '/manage-orders/update/' + order_id + '?status=' + status;
    $.get(url).done(
        window.location.replace('/manage-orders/update/' + order_id)
    )
}