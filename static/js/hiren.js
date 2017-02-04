/**
 * Created by prism on 2/3/17.
 */

(function () {
    $('#url').focusout(function () {  //post to title view
        $('#title').attr("placeholder", "Loading title..");
        $.ajax({
            url: '/title/',
            method: 'POST',
            data: {
                'url': $('#url').val()
            }
        }).then(function (data) {
            if(data.title){
                $('#title').val(data.title);
            } else {
                $('#title').attr("placeholder", "Title generation failed! Check the url.");
            }
        })
    })
})();

function tag() { //function for selectize (tag input)
    $.ajax({
        url: '/tags/'
    }).then(function (response) {
        console.log(response);
        // let nisha = [];
        // response.data.map(function (hiren) {
        //     let bunny = {'value': '', 'text': ''};
        //     bunny['value'] = hiren.name;
        //     bunny['text'] = hiren.name;
        //     nisha.push(bunny);
        // });
        $('#tags').selectize({
            delimiter: ';',
            persist: false,
            //options: nisha,
            create: function(input) {
                return {
                    value: input,
                    text: input
                }
            }
        });
    });
}

function encrypt(text, key, iv) {
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(text));
    cipher.finish();
    var encrypted = cipher.output;
    return encrypted.toHex();
}

function decrypt(encryptedHex, key, iv) {
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: forge.util.hexToBytes(iv)});
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedHex)));
    let bunny = decipher.finish();  // if the secret key is invalid it returns false
    if(!bunny) {
        window.location('/secret/');
        sweetAlert("Error", "Secret key is not valid!", "error");
    }
    return decipher.output.data;
}

function create() {

}