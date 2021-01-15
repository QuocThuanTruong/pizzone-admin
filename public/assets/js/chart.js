
new Morris.Line({
    // ID of the element in which to draw the chart.
    element: 'yearRevenueChart',
    // Chart data records -- each entry in this array corresponds to a point on
    // the chart.
    data: [
        { year: '2019', value: 100 },
        { year: '2020', value: 500 },
        { year: '2021', value: 300 }
    ],
    // The name of the data record attribute that contains x-values.
    xkey: 'year',
    // A list of names of data record attributes that contain y-values.
    ykeys: ['value'],
    // Labels for the ykeys -- will be displayed when you hover over the
    // chart.
    labels: ['Value']
});

Morris.Bar({
    element: 'monthRevenueChart',
    data: [
        { y: '1', a: 10 },
        { y: '2', a: 75 },
        { y: '3', a: 50 },
        { y: '4', a: 75 },
        { y: '5', a: 50 },
        { y: '6', a: 75 },
        { y: '7', a: 60},
        { y: '8', a: 30},
        { y: '9', a: 50},
        { y: '10', a: 100 },
        { y: '11', a: 80 },
        { y: '12', a: 100 },
    ],
    xkey: 'y',
    ykeys: ['a'],
    labels: ['Sold']
});

Morris.Donut({
    element: 'quarterRevenueChart',
    data: [
        {label: "Quý 01", value: 12},
        {label: "Quý 02", value: 52},
        {label: "Quý 03", value: 32},
        {label: "Quý 04", value: 42}
    ],
    colors: ['#de0000', '#ddbd00', '#27b300', '#0799ff', '#B0CCE1', '#095791', '#095085', '#083E67', '#052C48', '#042135'],
});