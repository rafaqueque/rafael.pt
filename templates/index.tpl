        <h1>{{name}}</h1>
        {{&description}}
        
        <br><b>Useful links</b>:
        <ul>
            {{#links}}
                <li><a target='_blank' class='link' href='{{url}}'>{{description}}</a></li>
            {{/links}}
        </ul>