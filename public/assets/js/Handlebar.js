Handlebars.registerHelper('render_pagination', function (category, page, totalPage) {
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