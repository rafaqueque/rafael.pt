$(document).ready(function(){

    $.get('templates/index.tpl', function(template){
        $.getJSON('contents/index.json', function(data){
            $('.container').html(Mustache.to_html(template, data));
        });
    });
    
});

