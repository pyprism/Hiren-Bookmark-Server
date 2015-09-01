/**
 * Created by prism on 9/1/15.
 */
$('#table').bootstrapTable({
    sortName: 'title',
    columns: [{
        field: 'title',
        title: 'Title',
        formatter: function(value,row,index, href){
            return '<a href="' + href + '" target="_blank"">' + value + '</a>';
        }
    }, {
        field: 'tag',
        title: 'Tag'
    }, {
        field: 'date',
        title: 'Added on'
    }],
    data: [{
        title: "Facebook.co,",
        tag: 'anjum',
        date: '20/9/2013'
    }, {
        title: "Facebook.net",
        tag: 'nisha',
        date: '20/5/2013'
    }, {
        title: "Facebook.com",
        tag: 'naima',
        date: '20/2/2013'
    }]
});