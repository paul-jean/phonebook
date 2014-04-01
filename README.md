Instantiate a `PhoneBook` object:

```javascript
var phoneBook = require('./phonebook.js');
var pb = phoneBook('.');
```

The `test-add.js` script adds a number to the phonebook:

```javascript
var phoneBook = require('./phonebook.js');
var pb = phoneBook('.');

var fname = pb.addNumber('foo bar', '123-456-7890');
```

A directory tree will be created for the name,
with the phone number as a file on a leaf node:

```bash
[rule146@rule146: phonebook]$ tree
.
├── f
│   └── o
│       └── o
│           └── b
│               └── a
│                   └── r
│                       └── 123-456-7890
```

The `test-lookup.js` script looks up the name in the phonebook:

```javascript
var phoneBook = require('./phonebook.js');
var pb = phoneBook('pb1');

var fname = pb.findNumber('foo bar');
```

```bash
[rule146@rule146: phonebook]$ node test-lookup.js
123-456-7890
```

