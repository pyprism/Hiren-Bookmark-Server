/**
 * Created by prism on 2/3/17.
 */

(function () {
    $('#url').focusout(function () {  //generate title based on url
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
        url: '/tags/',
        cache: false
    }).then(function (response) {
        console.log(response);
        //([])
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
    // key, salt generation
    let iteration = $('#iteration').val();
    let  random = forge.random.getBytesSync(32),
        _salt = forge.random.getBytesSync(128),
        key = forge.pkcs5.pbkdf2(sessionStorage.getItem('secret'), _salt, iteration, 32);

    // input tag string manipulation for django-taggit format
    var tagStr = $('#tags').val();
    var _tag =[];
    var len = tagStr.length;
    var hiren;
    var x = "";
    for( hiren=0; hiren<len; hiren++) {
        if(tagStr[hiren] != ";"){
            x = x + tagStr[hiren];
            if( hiren + 1 == len)
                _tag.push(x);
        }
        else{
            _tag.push(x);
            x = "";
        }
    }

    //now the ajax !
    $.ajax({
        url: '/form/',
        method: 'POST',
        data: {
            title: encrypt($('#title').val(), key, random),
            url: encrypt($('#url').val(), key, random),
            iv: forge.util.bytesToHex(random),
            salt: forge.util.bytesToHex(_salt),
            tags: _tag,
            iteration: iteration
        }
    }).success(function (response) {
        console.log(response);
    }).error(function (error) {
        console.error(error);
    })
}