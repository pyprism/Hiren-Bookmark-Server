/**
 * Created by prism on 9/1/15.
 */
$( document ).ready(function() {
    $('#table').bootstrapTable({
        url: '/dashboard/list/all',
        sortName: 'title',
        pagination: true,
        search: true,
        columns: [{
            field: 'title',
            title: 'Title',
            sortable: true,
            formatter: function(value, row, index){
                return '<a href="' + row.href + '" target="_blank"">' + value + '</a>';
            }
        }, {
            field: 'tag',
            title: 'Tag',
            sortable: true
        }, {
            field: 'date',
            title: 'Added on',
            sortable: true
        }],

    });
});