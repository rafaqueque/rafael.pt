        <h1>{{name}}</h1>
        {{&description}}

        <br><b>Projects</b>:
        <ul>
            {{#projects}}
                <li><a target='_blank' class='link' href='{{url}}'>{{site}}</a> / {{description}}</li>
            {{/projects}}
        </ul>