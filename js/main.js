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
function Terminal()
{

  /* pages available to display */
  var pages_available = {
    static: ['index', 'projects'],
    dynamic: ['github']
  };


  /* output command */
  this.__output = function(args)
  {
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

    var _page_type = 'static';
    var _page_exists = false;

    if ($.inArray(args,pages_available.static) !== -1)
    {
      _page_type = 'static';
      _page_exists = true;
    }

    if ($.inArray(args,pages_available.dynamic) !== -1)
    {
      _page_type = 'dynamic';
      _page_exists = true;
    }


    if (args)
    {

      /* if page exists */
      if (_page_exists)
      {

        /* if page is static */
        if (_page_type == 'static')
        {
          $.get('templates/'+args+'.tpl', function(template){
            $.getJSON('contents/'+args+'.json', function(data){
              $('.container').html(Mustache.to_html(template, data));

              window.location.hash = args;
              $('form[name="terminal"] input').val('cd '+args);

            });
          });

          this.__output('page "'+args+'" loaded. type "ls" to view the available pages.');
        }

        /* if page is dynamic */
        if (_page_type == 'dynamic')
        {


          /* github info parse */
          if (args == 'github')
          {

            $.get('templates/'+args+'.tpl', function(template){
              $.getJSON('https://api.github.com/users/rafaqueque/repos', function(github){

                var repositories = new Array();

                /* go through each repo */
                $.each(github, function(i,obj){
                  var _temp = { name: obj.full_name, description: obj.description, url: obj.html_url }; 
                  repositories.push(_temp);
                });

                /* template json */
                var data = {
                  name: "Rafael Albuquerque",
                  description: "<p>Oh, my repos.</p>",
                  repositories: repositories
                };
 

                $('.container').html(Mustache.to_html(template, $.parseJSON(JSON.stringify(data))));

                window.location.hash = args;
                $('form[name="terminal"] input').val('cd '+args);

              });
            });

            this.__output('page "'+args+'" loaded. type "ls" to view the available pages.');

          }
        }

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


  /* permalinks support */
  if (window.location.hash)
  {
    var requested_page = window.location.hash.split("/")[0].replace('#','') || null;

    if (requested_page)
    {
      terminal.cd(requested_page);
    }
    else
    {
      terminal.cd('index');
    }
  }
  else
  {
    terminal.cd('index');
  }
    

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
        terminal.__output('-bash: '+command+': command not found');
      }
    }

  });

});