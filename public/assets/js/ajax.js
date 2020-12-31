function getID(id) {
    let inputID = document.createElement("input")
    inputID.id = "id"
    inputID.name = "id"
    inputID.value = id

    document.body.appendChild(inputID);
}

function confirmDelete() {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/manage-dishes";

    const inputID = document.getElementById('id')

    console.log(inputID.value)

    form.appendChild(inputID);

    document.body.appendChild(form);

    form.submit()
}

function gotoPage(categoryId, page) {
    if (categoryId === 0)
    categoryId = ""

    const totalDishPerPageArr = [1, 2, 3]
    const totalDishPerPage = totalDishPerPageArr[document.getElementById('total_dish_per_page').selectedIndex]

    const sortByArr = [1, 2, 3, 4]
    const sortBy = sortByArr[document.getElementById('sort-by').selectedIndex]

    const url='/manage-dishes?category=' + categoryId + '&page=' + page + '&total_dish_per_page=' + totalDishPerPage +'&sortBy=' + sortBy;

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

/*    $.get(url, () => {

    })

    window.location.replace(url)*/
}

function changeCategory() {
    const categories = [1, 2, 3]
    const category = categories[document.getElementById('category').selectedIndex]

    gotoPage(category, 1)
}

function changeCategoryAdd() {
    console.log('cc')

    const categories = [1, 2, 3]
    const category = categories[document.getElementById('category').selectedIndex]

    reloadPage(category)
}

function reloadPage(category) {
    if (category === 0)
        category = ""

    const url='/manage-dishes/add?category='+category;

    /*$.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            console.log(data)
            $("#pagination").html(data)
        },
        error: function (err) {
            conole.log(err)
        }
    })*/

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
                alert('username or password is incorrect')
            }
        },
        error: function (err) {
            console.log(err)
        }
    })

    console.log('reuslt' + result)

    return result;
}