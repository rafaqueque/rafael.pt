/* belongs to Mustache.js, to prevent some XSS */
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}







/* Terminal emulation class */
function Terminal(){

  /* output command */
  this.__output = function(args){
    $('form[name="terminal"] div').html(args ? args+'<br><br>type "help" for more information.' : '');
    $('form[name="terminal"] input').val('');
    return true;
  }


  /* 'help' command */
  this.help = function(args)
  {
    this.__output('Usage: <br> "ls" &mdash; view existing pages <br> "cd [page]" &mdash; load page <br> "clear" &mdash; clear everything <br> "help" &mdash; this');
    return true;
  }


  /* 'clear' command */
  this.clear = function(args)
  {
    this.__output();
    $('.container').html('');
    return true;
  }


  /* 'ls' command */
  this.ls = function(args)
  {
    var html = '';
    $.each(pages_available, function(i, page){
      html += page+'&nbsp;&nbsp;&nbsp;';
    });

    this.__output(html);
    return true;
  }


  /* 'cd' command */
  this.cd = function(args)
  {
    var pages_available = ['index', 'projects'];

    if (args)
    {
      if ($.inArray(args,pages_available) !== -1)
      {
        $.get('templates/'+args+'.tpl', function(template){
          $.getJSON('contents/'+args+'.json', function(data){
            $('.container').html(Mustache.to_html(template, data));
          });
        });

        this.__output('page "'+args+'" loaded. type "ls" to view the available pages.');
      }
      else
      {
        this.__output('page "'+args+'" not found! type "ls" to view the available pages.');
      }
    }
    return true;
  }
}


  


$(document).ready(function(){

  /* init the Terminal class and show 'index' page */
  var terminal = new Terminal();
  terminal.cd('index');


  $('form[name="terminal"] input').val('cd index');
  $('form[name="terminal"] input').focus();


  /* submit handler */
  $('form[name="terminal"]').on('submit', function(e){
    e.preventDefault();

    /* input properly escaped and protected */
    var input = escapeHtml($(this).find('input').val()) || null;

    if (input)
    {
      var command = input.split(' ')[0];
      var arguments = input.split(' ')[1] || null;

      /* check if command exists */
      if (typeof terminal[command] == 'function')
      {
        /* call it with arguments if needed */
        terminal[command].apply(terminal, new Array(arguments));
      } 
      else
      {
        terminal.__output('-bash: '+command+': command not found')
      }
    }

  });

});