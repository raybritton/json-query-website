#!/bin/bash

if [ ! -f diagram.zip ]; then
    echo "Run in same directory as diagram.zip"
fi

unzip diagram.zip

rm public/docs/diagram/*

mv diagram/* public/docs/diagram/

rm -r diagram

mv index.html doc.html

sed -i'.bak' -e 's:<head>:<head><title>JQL Syntax Diagrams</title><base href="/docs/"/>:g' doc.html
sed -i'.bak' -e 's/%/%%/g' doc.html
sed -i'.bak' -e 's:</body>:%s</body>:g' doc.html
sed -i'.bak' -e 's@</style>@.ebnf {display: none; } </style>@g' doc.html

rm doc.html.bak

mv doc.html res/

rm diagram.zip