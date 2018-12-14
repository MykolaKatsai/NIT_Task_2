import './scss/main.scss';
console.log(`The time is ${new Date()}`);

const _roote = 'https://nit.tron.net.ua/api';

//noneedinmagic/nit-demo
var storage = {};


import $ from 'jquery';
window.jQuery = $;
window.$ = $;

$('.header').append('<h1 class="text-center">My Store</h1>');
$('.header').append('<button type="button" class="btn btn-primary" id="basket">Корзина</button>');



jQuery.ajax({
    url: _roote + '/category/list',
    method: 'get',
    dataType: 'json',
    success: function (input) {
        console.log('Loaded via AJAX!');

        makeMenu(input);

        console.log('Added to grid');
    },
    error: function (xhr) {
        alert("An error occured: " + xhr.status + " " + xhr.statusText);
    },
});




jQuery.ajax({
    url: _roote + '/product/list',
    method: 'get',
    dataType: 'json',
    success: function (input) {

        makeProduct(input);

    },
    error: function (xhr) {
        alert("An error occured: " + xhr.status + " " + xhr.statusText);
    },
});

//<button class="btn btn-primary">Додати в корзину</button>


function makeProduct(productArr) {
    for (var i = 0; i < productArr.length; i++) {
        var productWraper = $("<div></div>").attr({
            'class': 'product_wraper'
        });
        var imgWraper = $("<div></div>").attr({
            'class': 'product_img_container'
        });
        var productDescription = $("<div></div>").attr({
            'class': 'product_description'
        });
        var prName = $("<span>" + productArr[i].name + "</span>");
        var prPrise = $("<div>" + productArr[i].price + "</div>");


        productDescription.append(prName, prPrise);

        if (productArr[i].special_price !== null) {
            prPrise.addClass('crossed');
            var prPrise_s = $("<span class='special'>" + productArr[i].special_price + "</span>");
            productDescription.append(prPrise_s);
        }
        var backetBtn = $("<button class='btn btn-primary'>Додати в корзину</button>").attr({
            'data-id': productArr[i].id
        });
        productDescription.append(backetBtn);

        var img = $("<img>").attr({
            'src': productArr[i].image_url,
            'class': 'product_main_img'
        });
        imgWraper.append(img);
        productWraper.append(imgWraper, productDescription);

        $(".product_list").append(productWraper);


    }
}

function makeMenu(input) {
    var ul = $("<ul></ul>").attr({
        'class': 'nav nav-pills flex-column flex-sm-row'
    });
    var allBtn = $("<button>All</button>").attr({
        'class': 'flex-sm-fill text-sm-center nav-link btn btn-primary',
        'data-id': 'allProducts'
    });
    ul.append(allBtn);
    for (var i = 0; i < input.length; i++) {

        var btn = $("<button>" + input[i].name + "</button>").attr({
            'class': 'flex-sm-fill text-sm-center nav-link btn btn-primary',
            'data-id': input[i].id
        });
        ul.append(btn);
    }
    $("#navigation").append(ul);
}


function addBacket(item) {
    console.log($(".backet_list .itemWraper[data-id =" + item.id + "]").length);


    if ($(".backet_list .itemWraper[data-id =" + item.id + "]").length == 0) {

        var itemWraper = $("<div class='itemWraper'></div>").attr({
            'data-id': item.id
        });

        var img = $("<img>").attr({
            'src': item.image_url,
            'class': 'product_main_img'
        });

        var params = $("<span>" + item.name + ", ціна: " + item.price + "</span>").css({
            'margin-top': '25px',
            'display': 'inline-block'
        });

        var del = $("<button>X</button>").attr({
            'class': 'flex-sm-fill text-sm-center nav-link btn btn-primary',
            'data-id': item.id
        });
        del.css({
            'float': 'right',
            'margin-top': '10px'
        });

        itemWraper.append(img, params, del);
        $(".backet_list .list").append(itemWraper);
        localStorage.setItem(item.id, item.id);
        storage[item.id] = item.id;
        $(".backet_list .list h3").hide();
        $(".backet_list #addForm").show();
    }
}

function deleteFromBacket(item) {
    $(".backet_list .list .itemWraper[data-id =" + item.dataset.id + "]").remove();
    delete storage[item.dataset.id];
    console.log(storage);

    localStorage.removeItem(item.dataset.id);
    var counter = 0;
    for (var kee in storage) {
        counter++;

    }
    if (counter == 0) {

        $(".backet_list .list h3").show();
        $(".backet_list #addForm").hide();
    }
}




$(document).ready(function () {


    $("#navigation ul button").click(function () {

        $(".product_map, .backet_list").hide();
        $(".product_list").show();
        $(".product_list").empty();
        var ask = _roote + '/product/list/category/' + this.dataset.id;
        if (this.dataset.id == "allProducts")
            ask = _roote + '/product/list';

        jQuery.ajax({
            url: ask,
            method: 'get',
            dataType: 'json',
            success: function (input) {

                makeProduct(input);

            },
            error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            },
        });

    });

    $(document).on('click', ".product_wraper .product_description button", function () {

        jQuery.ajax({
            url: _roote + "/product/" + this.dataset.id,
            method: 'get',
            dataType: 'json',
            success: function (input) {

                addBacket(input);

            },
            error: function (xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            },
        });

    });

    $(document).on('click', ".backet_list .list button", function () {

        console.log(this.dataset.id);

        deleteFromBacket(this);

    });


    $("#basket").click(function () {
        $(".product_map,.product_list").hide();
        $(".backet_list").show();
    });

    $("#sendOrder").submit(function (event) {

        event.preventDefault();

        var name = $("#nameInput").val();
        var phone = $("#numberInput").val();
        var email = $("#inputEmail").val();
        var counter = 0;
        for (var kee in storage) {
            counter++;

        }
        for (var kee in storage) {

            jQuery.ajax({
                url: _roote + "/order/add",
                method: 'post',
                data: {
                    'token': '-dWpvced79wCr7kPHInk',
                    'name': name,
                    'phone': phone,
                    'email': email,
                    'products[1]': 1
                },
                dataType: 'json',
                success: function (data) {
                    delete storage[kee];
                    if (counter-- <= 1) {
                        alert("Дякуемо за замовлення");
                        location.reload();

                    }

                },
                error: function (xhr) {
                    alert("An bad error occured: " + xhr.status + " " + xhr.statusText);
                },
            });

        }
        localStorage.clear();
    });

});
