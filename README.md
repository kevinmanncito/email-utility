## Email Utility


This script accepts the JSON payload from lds.org (see index.js) and emails each member in the list, as well as providing some basic info about the group.

###### To get started

First save the JSON payload in a file (e.g. `info.json`), then:

    $> git clone https://github.com/sammyteahan/email-utility.git
    $> cd email-utility && npm install
    $> node index.js < info.json
