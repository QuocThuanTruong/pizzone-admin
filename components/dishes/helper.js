const dishModel = require('./model')

function helper(hbs) {
    hbs.registerHelper('render_pagination', function (category, page, totalPage) {
        let currentPage = parseInt(page)
        let rearLeftPage = currentPage - 2
        let previousPage = currentPage - 1
        let nextPage = currentPage + 1
        let rearRightPage = currentPage + 2
        let lastPage = parseInt(totalPage)

/*           console.log(rearLeftPage)
           console.log(previousPage)
           console.log(currentPage)
           console.log(nextPage)
           console.log(rearRightPage)*/
        let html = '';

        html += '<nav class="float-right" aria-label="..."><ul class="pagination"><li class="page-item"><a class="page-link" tabindex="-1" onClick="gotoPage('+category+', 1)"><i class="fa fa-arrow-left"></i></a></li>'

        if (rearLeftPage > 0) {
            html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+rearLeftPage+')">'+rearLeftPage+'</a></li>'
            html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+previousPage+')">'+previousPage+'</a></li>'
        } else if (previousPage > 0) {
            html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+previousPage+')">'+previousPage+'</a></li>'
        }

        html += '<li class="page-item active"><a class="page-link" onClick="gotoPage('+category+', '+currentPage+')">'+currentPage+'<span class="sr-only">(current)</span></a></li>'

        if (rearRightPage <= totalPage) {
            html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a></li>'
            html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+rearRightPage+')"">'+rearRightPage+'</a></li>'
        } else if (nextPage <= totalPage) {
            html += '<li class="page-item "><a class="page-link" onClick="gotoPage('+category+', '+nextPage+')">'+nextPage+'</a></li>'
        }

        html += '<li class="page-item"><a class="page-link" onClick="gotoPage('+category+', '+lastPage+')"><i class="fa fa-arrow-right"></i></a></li></ul></nav>'

        return html
    });

    hbs.registerHelper('index', (i) => {
        return i + 1
    })

    hbs.registerHelper("isTraditional", (subcategory) => {
        return subcategory === 1
    })

    hbs.registerHelper("isSea", (subcategory) => {
        return subcategory === 2
    })

    hbs.registerHelper("isMixed", (subcategory) => {
        return subcategory === 3
    })

    hbs.registerHelper("size1", (size) => {
        return (size.filter(s => s.name === '25cm (250g)').length > 0 || size.filter(s => s.name === 'L').length > 0 || size.filter(s => s.name === '1 Người ăn').length > 0)
    })

    hbs.registerHelper("size2", (size) => {
        return (size.filter(s => s.name === '30cm (450g)').length > 0 || size.filter(s => s.name === 'M').length > 0 || size.filter(s => s.name === '2 Người ăn').length > 0)
    })

    hbs.registerHelper("size3", (size) => {
        return size.filter(s => s.name === '40cm (550g)').length > 0
    })

    hbs.registerHelper("dough1", (dough) => {
        return dough.filter(d => d.name === 'Mỏng').length > 0
    })

    hbs.registerHelper("dough2", (dough) => {
        return dough.filter(d => d.name === 'Dày').length > 0
    })

    hbs.registerHelper("toping1", (topping) => {
        return topping.filter(t => t.name === 'Ớt chuông').length > 0
    })

    hbs.registerHelper("toping2", (topping) => {
        return topping.filter(t => t.name === 'Thịt xông khói').length > 0
    })

    hbs.registerHelper("toping3", (topping) => {
        return topping.filter(t => t.name === 'Nấm').length > 0
    })

    hbs.registerHelper("toping4", (topping) => {
        return topping.filter(t => t.name === 'Cải xà lách').length > 0
    })
}

module.exports = helper;