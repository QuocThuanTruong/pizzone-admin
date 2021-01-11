Handlebars.registerHelper('render_pagination', function (category, page, totalPage) {
    let currentPage = parseInt(page)
    let previousPage = currentPage - 1
    let nextPage = currentPage + 1
    let lastPage = parseInt(totalPage)

    let html = '';

    html += '<nav class="float-right" aria-label="..."><ul class="pagination">'
    if (previousPage > 0) {
        html += '<li class="page-item"><a class="page-link" tabindex="-1" onClick="gotoPage('+category+', '+previousPage+')"><i class="fa fa-arrow-left"></i></a></li>'
    } else {
        html += '<li class="page-item"><a class="page-link" tabindex="-1"><i class="fa fa-arrow-left"></i></a></li>'
    }

    if (currentPage - 1 >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', 1)">1</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+previousPage+')">'+previousPage+'</a></li>'
        html += '<li class="page-item active"><a class="page-link">'+currentPage+'</a></li>'
    } else if (currentPage === 1){
        html += '<li class="page-item active"><a class="page-link">1</a></li>'
    } else if (currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', 1)">1</a></li>'
        html += '<li class="page-item active"><a class="page-link">2</a></li>'
    } else if (currentPage === 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', 1)">1</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', 2)">2</a></li>'
        html += '<li class="page-item active"><a class="page-link">3</a></li>'
    }

    if (totalPage - currentPage >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 1){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a></li>'
    }

    if (nextPage <= lastPage) {
        html += '<li class="page-item"><a class="page-link" onClick="gotoPage('+category+', '+nextPage+')"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    } else {
        html += '<li class="page-item"><a class="page-link"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    }

    return html
});

Handlebars.registerHelper('render_pagination_account', function (page, totalPage) {
    let currentPage = parseInt(page)
    let previousPage = currentPage - 1
    let nextPage = currentPage + 1
    let lastPage = parseInt(totalPage)

    let html = '';

    html += '<nav class="float-right" aria-label="..."><ul class="pagination">'
    if (previousPage > 0) {
        html += '<li class="page-item"><a class="page-link" tabindex="-1" onClick="gotoPageAccount('+previousPage+')"><i class="fa fa-arrow-left"></i></a></li>'
    } else {
        html += '<li class="page-item"><a class="page-link" tabindex="-1"><i class="fa fa-arrow-left"></i></a></li>'
    }

    if (currentPage - 1 >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount(1)">1</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount('+previousPage+')">'+previousPage+'</a></li>'
        html += '<li class="page-item active"><a class="page-link">'+currentPage+'</a></li>'
    } else if (currentPage === 1){
        html += '<li class="page-item active"><a class="page-link">1</a></li>'
    } else if (currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount(1)">1</a></li>'
        html += '<li class="page-item active"><a class="page-link">2</a></li>'
    } else if (currentPage === 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount(1)">1</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount(2)">2</a></li>'
        html += '<li class="page-item active"><a class="page-link">3</a></li>'
    }

    if (totalPage - currentPage >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount('+nextPage+')">'+nextPage+'</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount('+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount('+nextPage+')">'+nextPage+'</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount('+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 1){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageAccount('+nextPage+')">'+nextPage+'</a></li>'
    }

    if (nextPage <= lastPage) {
        html += '<li class="page-item"><a class="page-link" onClick="gotoPageAccount('+nextPage+')"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    } else {
        html += '<li class="page-item"><a class="page-link"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    }

    return html
});

Handlebars.registerHelper('render_pagination_order', function (page, totalPage) {
    let currentPage = parseInt(page)
    let previousPage = currentPage - 1
    let nextPage = currentPage + 1
    let lastPage = parseInt(totalPage)

    let html = '';

    html += '<nav class="float-right" aria-label="..."><ul class="pagination">'
    if (previousPage > 0) {
        html += '<li class="page-item"><a class="page-link" tabindex="-1" onClick="gotoPageOrder('+previousPage+')"><i class="fa fa-arrow-left"></i></a></li>'
    } else {
        html += '<li class="page-item"><a class="page-link" tabindex="-1"><i class="fa fa-arrow-left"></i></a></li>'
    }

    if (currentPage - 1 >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder(1)">1</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder('+previousPage+')">'+previousPage+'</a></li>'
        html += '<li class="page-item active"><a class="page-link">'+currentPage+'</a></li>'
    } else if (currentPage === 1){
        html += '<li class="page-item active"><a class="page-link">1</a></li>'
    } else if (currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder(1)">1</a></li>'
        html += '<li class="page-item active"><a class="page-link">2</a></li>'
    } else if (currentPage === 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder(1)">1</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder(2)">2</a></li>'
        html += '<li class="page-item active"><a class="page-link">3</a></li>'
    }

    if (totalPage - currentPage >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder('+nextPage+')">'+nextPage+'</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder('+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder('+nextPage+')">'+nextPage+'</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder('+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 1){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageOrder('+nextPage+')">'+nextPage+'</a></li>'
    }

    if (nextPage <= lastPage) {
        html += '<li class="page-item"><a class="page-link" onClick="gotoPageOrder('+nextPage+')"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    } else {
        html += '<li class="page-item"><a class="page-link"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    }

    return html
});

Handlebars.registerHelper('render_pagination_category', function (page, totalPage) {
    let currentPage = parseInt(page)
    let previousPage = currentPage - 1
    let nextPage = currentPage + 1
    let lastPage = parseInt(totalPage)

    let html = '';

    html += '<nav class="float-right" aria-label="..."><ul class="pagination">'
    if (previousPage > 0) {
        html += '<li class="page-item"><a class="page-link" tabindex="-1" onClick="gotoPageCategory('+previousPage+')"><i class="fa fa-arrow-left"></i></a></li>'
    } else {
        html += '<li class="page-item"><a class="page-link" tabindex="-1"><i class="fa fa-arrow-left"></i></a></li>'
    }

    if (currentPage - 1 >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory(1)">1</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory('+previousPage+')">'+previousPage+'</a></li>'
        html += '<li class="page-item active"><a class="page-link">'+currentPage+'</a></li>'
    } else if (currentPage === 1){
        html += '<li class="page-item active"><a class="page-link">1</a></li>'
    } else if (currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory(1)">1</a></li>'
        html += '<li class="page-item active"><a class="page-link">2</a></li>'
    } else if (currentPage === 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory(1)">1</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory(2)">2</a></li>'
        html += '<li class="page-item active"><a class="page-link">3</a></li>'
    }

    if (totalPage - currentPage >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory('+nextPage+')">'+nextPage+'</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory('+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory('+nextPage+')">'+nextPage+'</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory('+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 1){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageCategory('+nextPage+')">'+nextPage+'</a></li>'
    }

    if (nextPage <= lastPage) {
        html += '<li class="page-item"><a class="page-link" onClick="gotoPageCategory('+nextPage+')"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    } else {
        html += '<li class="page-item"><a class="page-link"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    }

    return html
});

Handlebars.registerHelper('render_pagination_subcategory', function (page, totalPage) {
    let currentPage = parseInt(page)
    let previousPage = currentPage - 1
    let nextPage = currentPage + 1
    let lastPage = parseInt(totalPage)

    let html = '';

    html += '<nav class="float-right" aria-label="..."><ul class="pagination">'
    if (previousPage > 0) {
        html += '<li class="page-item"><a class="page-link" tabindex="-1" onClick="gotoPageSubcategory('+previousPage+')"><i class="fa fa-arrow-left"></i></a></li>'
    } else {
        html += '<li class="page-item"><a class="page-link" tabindex="-1"><i class="fa fa-arrow-left"></i></a></li>'
    }

    if (currentPage - 1 >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory(1)">1</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory('+previousPage+')">'+previousPage+'</a></li>'
        html += '<li class="page-item active"><a class="page-link">'+currentPage+'</a></li>'
    } else if (currentPage === 1){
        html += '<li class="page-item active"><a class="page-link">1</a></li>'
    } else if (currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory(1)">1</a></li>'
        html += '<li class="page-item active"><a class="page-link">2</a></li>'
    } else if (currentPage === 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory(1)">1</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory(2)">2</a></li>'
        html += '<li class="page-item active"><a class="page-link">3</a></li>'
    }

    if (totalPage - currentPage >= 3) {
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory('+nextPage+')">'+nextPage+'</a></li>'
        html += '.....'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory('+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 2){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory('+nextPage+')">'+nextPage+'</a></li>'
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory('+lastPage+')">'+lastPage+'</a></li>'
    } else if (totalPage - currentPage === 1){
        html += '<li class="page-item "><a class="page-link" onClick="gotoPageSubcategory('+nextPage+')">'+nextPage+'</a></li>'
    }

    if (nextPage <= lastPage) {
        html += '<li class="page-item"><a class="page-link" onClick="gotoPageSubcategory('+nextPage+')"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    } else {
        html += '<li class="page-item"><a class="page-link"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'
    }

    return html
});

Handlebars.registerHelper('standardPrice', function(quantity, price) {
    price *= quantity

    let priceStr = price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.').toString()

    return priceStr.substr(0, priceStr.length - 3) + 'đ'
})

Handlebars.registerHelper('orderStatus', function (status) {
    let result = '';
    switch (status) {
        case 0:
            result = 'badge-info';
            break;
        case 1:
            result = 'badge-warning';
            break;
        case 2:
            result = 'badge-success';
            break;
        case 3:
            result = 'badge-danger';
            break;
    }

    return result;
})

Handlebars.registerHelper('categoryActive', function (active) {
    let result = '';
    switch (active) {
        case 0:
            result = 'badge-danger';
            break;
        case 1:
            result = 'badge-success';
            break;
    }

    return result;
})