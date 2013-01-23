var commands_available = ["ls","cd","clear","help"];
var pages_available = ["index"];


function term_output(args)
{
  $('form[name="terminal"] div').html(args ? args+'<br><br>type "help" for more information.' : '');
  $('form[name="terminal"] input').val('');
}

function term_help(args)
{
  term_output('Usage: <br> "ls" &mdash; view existing pages <br> "cd [page]" &mdash; load page <br> "clear" &mdash; clear everything <br> "help" &mdash; this');
}

function term_clear(args)
{
  term_output();
  $('.container').html('');
}

function term_ls(args)
{
  var html = '';
  $.each(pages_available, function(i, page){
    html += page+'&nbsp;&nbsp;&nbsp;';
  });

  term_output(html);

  return true;
}

function term_cd(args)
{
  if (args)
  {
    if ($.inArray(args,pages_available) !== -1)
    {

      $.get('templates/'+args+'.tpl', function(template){
        $.getJSON('contents/'+args+'.json', function(data){
            $('.container').html(Mustache.to_html(template, data));
        });
      });

      term_output('page "'+args+'" loaded.');
    }
    else
    {
      term_output('page "'+args+'" not found! type "ls" to view the available pages.');
    }
  }

  return true;
}
  


$(document).ready(function(){

  term_cd('index');
  $('form[name="terminal"] input').val('cd index');
  $('form[name="terminal"] input').focus();


  $('form[name="terminal"]').on('submit', function(e){
    e.preventDefault();

    var input = $(this).find('input').val() || null;

    if (input)
    {
      var command = input.split(" ")[0];
      var arguments = input.split(" ")[1];

      if ($.inArray(command,commands_available) !== -1)
      {
        eval('term_'+command+((arguments) ? '("'+arguments+'")' : '()'));
      } 
      else
      {
        term_output('-bash: '+command+': command not found')
        return false;
      }
    }

  });

});