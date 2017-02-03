/**
 * Created by prism on 2/3/17.
 */

(function () {
    $('#url').focusout(function () {
        $.ajax({
            url: 'title/',
            method: 'POST',
            data: 'hello'
        }).then(function (data) {
            console.log(data);
        })
    })
})();