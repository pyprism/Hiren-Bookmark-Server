/**
 * Created by prism on 8/26/15.
 */
$(document).ready(function() {
    $(".url").change(function(){
        console.log($('.url').val());
        var data = {};
        data.hiren = $('.url').val();
        //var data = {data: $('.url').val()};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/dashboard/ajax',
            success: function(data) {
                console.log('success');
                console.log(JSON.stringify(data));
            }
        });
    });
});