/**
 * Created by prism on 8/26/15.
 */
$(document).ready(function() {
    $(".url").change(function(){
        var data = {};
        data.hiren = $('.url').val();
        //var data = {data: $('.url').val()};
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/ajax/title',
            success: function(data) {
                $('.title').val(data);
            }
        });
    });

    //twitter bloodhound
    var tags = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/ajax/suggestion',
/*            ajax: {
                type: 'GET',
                url: '/ajax/suggestion',
                contentType: 'application/json',
                success: function(tags) {
                    return tags;
                }
            }*/
        }
    });
    // passing in `null` for the `options` arguments will result in the default
    // options being used
    $('#prefetch .typeahead').typeahead(null, {
        name: 'tag',
        source: tags
    });

});