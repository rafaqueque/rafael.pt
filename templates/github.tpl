        <h1>{{name}}</h1>
        {{&description}}

        <br><b>Repositories</b>:
        <ul>
            {{#repositories}}
                <li><a target='_blank' class='link' href='{{url}}'>{{name}}</a> / {{description}}</li>
            {{/repositories}}
        </ul>