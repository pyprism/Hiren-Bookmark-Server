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
        url: '/tags_ajax/',
        cache: false
    }).success(function (response) {
        let nisha = [];
        response.map(function (hiren) {
            let bunny = {'value': '', 'text': ''};
            bunny['value'] = hiren;
            bunny['text'] = hiren;
            nisha.push(bunny);
        });
        $('#tags').selectize({
            delimiter: ';',
            persist: false,
            options: nisha,
            create: function(input) {
                return {
                    value: input,
                    text: input
                }
            }
        });
    }).error(function (err) {
        console.error(err);
    });
}

function encrypt(text, key, iv) { //function for encryption
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(text));
    cipher.finish();
    var encrypted = cipher.output;
    return encrypted.toHex();
}

function decrypt(encryptedHex, key, iv) {  // decryption
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

function create() { // function url input form
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
            tags: JSON.stringify(_tag),
            iteration: iteration
        }
    }).success(function (response) {
        if(response.status === "created"){
            sweetAlert('Saved', "Url saved successfully", 'success');
            document.getElementById('form').reset();
        }
    }).error(function (error) {
        console.error(error);
    })
}

function table(){  // function for table rendering in dashboard view
    $.ajax({
        url: '/dashboard_ajax/'
    }).success(function (response) {
        let nisha = [];
        response.map(function (hiren) {
            let bunny = {};
            let salt = forge.util.hexToBytes(hiren.salt);
            let key = forge.pkcs5.pbkdf2(sessionStorage.getItem('secret'),
                salt, hiren.iteration, 32);
            bunny['id'] = "<a href=" + "'/dashboard/"+ hiren.id + "/' >" + hiren.id + "</a>";
            bunny['title'] = "<a href="+ "'" + decrypt(hiren.url, key, hiren.iv) + "'" + "target='_blank' >"
                + decrypt(hiren.title, key, hiren.iv) + "</a>";
            bunny['created_at'] = moment.utc(hiren.created_at).local().format("dddd, DD MMMM YYYY");
            nisha.push(bunny);
        });

        $('#table').bootstrapTable({
            pagination: true,
            pageSize: 22,
            search: true,
            sortable: true,
            columns: [{
                field: 'id',
                title: 'ID'
            }, {
                field: 'title',
                title: 'Title'
            }, {
                field: 'created_at',
                title: 'Created At'
            }],
            data: nisha
        });
    });
}

function tag_cloud() { //generate tag cloud
    $.ajax({
        url: '/tags/',
        contentType: 'application/json'
    }).success(function (response) {
        $('#tag_cloud').jQCloud(response, {
            width: 600,
            height: 250,
            shape: 'rectangular'
        });
    })
}

function bookmark_by_tag() { // generate table in tag_by_name view
    $.ajax({
        url: '/tags/' + $('#tag_name').val() + '/',
        contentType: 'application/json'
    }).success(function (response) {
        let nisha = [];
        response.map(function (hiren) {
            let bunny = {};
            let salt = forge.util.hexToBytes(hiren.salt);
            let key = forge.pkcs5.pbkdf2(sessionStorage.getItem('secret'),
                salt, hiren.iteration, 32);
            bunny['id'] = hiren.id;
            bunny['title'] = "<a href="+ "'" + decrypt(hiren.url, key, hiren.iv) + "'" + "target='_blank' >"
                + decrypt(hiren.title, key, hiren.iv) + "</a>";
            bunny['created_at'] = moment.utc(hiren.created_at).local().format("dddd, DD MMMM YYYY");
            nisha.push(bunny);
        });

        $('#table').bootstrapTable({
            pagination: true,
            pageSize: 22,
            search: true,
            sortable: true,
            columns: [{
                field: 'id',
                title: 'ID'
            }, {
                field: 'title',
                title: 'Title'
            }, {
                field: 'created_at',
                title: 'Created At'
            }],
            data: nisha
        });
    });
}

function  bookmark_readonly() {  // set value in  readonly template
    const id = $('#pk').val();
    $.ajax({
        url: '/dashboard/' + id + '/',
        contentType: 'application/json'
    }).success(function (hiren) {
        const salt = forge.util.hexToBytes(hiren.salt);
        const key = forge.pkcs5.pbkdf2(sessionStorage.getItem('secret'),
            salt, hiren.iteration, 32);
        const title = decrypt(hiren.title, key, hiren.iv);
        const url = decrypt(hiren.url, key, hiren.iv);
        $('#title').text(title);
        $('#url').text(url);
    })
}

function bookmark_edit() { // set value in  edit template
    const id = $('#pk').val();
    $.ajax({
        url: '/dashboard/' + id + '/',
        contentType: 'application/json'
    }).success(function (hiren) {
        const salt = forge.util.hexToBytes(hiren.salt);
        const key = forge.pkcs5.pbkdf2(sessionStorage.getItem('secret'),
            salt, hiren.iteration, 32);
        const title = decrypt(hiren.title, key, hiren.iv);
        const url = decrypt(hiren.url, key, hiren.iv);
        $('#title').val(title);
        $('#url').val(url);
        $('#iteration').val(hiren.iteration);
    })
}

function bookmark_edit_form() {
    // key, salt generation
    const id = $('#pk').val();
    console.log($('#title').val());
    let iteration = $('#iteration').val();
    let  random = forge.random.getBytesSync(32),
        _salt = forge.random.getBytesSync(128),
        key = forge.pkcs5.pbkdf2(sessionStorage.getItem('secret'), _salt, iteration, 32);

    //now the ajax !
    $.ajax({
        url: '/dashboard/' + id + '/edit/',
        method: 'POST',
        data: {
            title: encrypt($('#title').val(), key, random),
            url: encrypt($('#url').val(), key, random),
            iv: forge.util.bytesToHex(random),
            salt: forge.util.bytesToHex(_salt),
            iteration: iteration
        }
    }).success(function (response) {
        console.log(response);
        if(response.status === "created"){
            sweetAlert('Saved', "Url updated successfully", 'success');
            document.getElementById('form').reset();
        }
    }).error(function (error) {
        console.error(error);
    })
}