        <h1>{{name}}</h1>
        {{&description}}
        
        <br><b>Useful links that are updated frequently</b>:
        <ul>
            {{#links}}
                <li><a target='_blank' class='link' href='{{url}}'>{{description}}</a></li>
            {{/links}}
        </ul>
        
        <br><b>'Projects' launched</b>:
        <ul>
            {{#projects}}
                <li><a target='_blank' class='link' href='{{url}}'>{{site}}</a> / {{description}}</li>
            {{/projects}}
        </ul>