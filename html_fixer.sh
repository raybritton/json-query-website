#!/bin/bash

if [ ! -f index.html ]; then
    echo "Run in same directory as index.html"
fi

mv index.html doc.html

sed -i'.bak' -e 's:<head>:<head><title>JQL Syntax Diagrams</title><base href="/docs/"/>:g' doc.html
sed -i'.bak' -e 's/%/%%/g' doc.html
sed -i'.bak' -e 's:</body>:%s</body>:g' doc.html
sed -i'.bak' -e 's@</style>@.ebnf {display: none; } </style>@g' doc.html

rm doc.html.bak

mv doc.html res/