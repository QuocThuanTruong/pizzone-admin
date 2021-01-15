const orderModel = require('../orders/model')

function helper(hbs) {

    hbs.registerHelper('render_year_revenue', function (year1, year2, year3) {

        let html = "new Morris.Line({element: 'yearRevenueChart', data: [{ year: '" + year1.name +"', value: " + year1.value + " }, { year: '" + year2.name + "', value: " + year2.value + " }, { year: '" + year3.name + "', value: " + year3.value + " }], xkey: 'year', ykeys: ['value'], labels: ['Value']});"

        return html;
    });


    hbs.registerHelper('render_month_revenue', function (months) {

        let html = "new Morris.Bar({" +
            "element: 'monthRevenueChart'," +
            "data: [" +
                "{ y: '1', a:" + months.jan + "}," +
                "{ y: '2', a:" + months.feb + "}," +
                "{ y: '3', a:" + months.mar + "}," +
                "{ y: '4', a:" + months.apr + " }," +
                "{ y: '5', a:" + months.may + "}," +
                "{ y: '6', a:" + months.jun + "}," +
                "{ y: '7', a:" + months.jul + "}," +
                "{ y: '8', a:" + months.agu + "}," +
                "{ y: '9', a:" + months.sep + "}," +
               "{ y: '10', a:" + months.oct + "}," +
                "{ y: '11', a:" + months.nov + "}," +
                "{ y: '12', a:" + months.dec + "}," +
            "]," +
            "xkey: 'y'," +
            "ykeys: ['a']," +
            "labels: ['Value']});"

        return html;
    });
};

module.exports = helper