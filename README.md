Instantiate a `PhoneBook` object with name "pb1":

```javascript
var phoneBook = require('./phonebook.js');
var pb = phoneBook('pb1');
```

The `test-add.js` script adds a number to the phonebook:

```javascript
var fname = pb.addNumber('foo bar', '123-456-7890');
```

A directory tree will be created for the name,
with the phone number as a file on a leaf node:

```bash
[rule146@rule146: phonebook]$ tree phonebooks/
phonebooks/
└── pb1
    └── f
        └── o
            └── o
                └── b
                    └── a
                        └── r
                            └── 123-456-7890
```

The `test-lookup.js` script looks up the name in the phonebook:

```javascript
var fname = pb.findNumber('foo bar');
```

```bash
[rule146@rule146: phonebook]$ node test-lookup.js
123-456-7890
```

Add another name with the same first name of "foo" but different last name "woo":

```javascript
var fname = pb.addNumber('foo woo', '098-765-4321');
```

There is now a second number in the directory tree under last name "woo":

```bash
[rule146@rule146: phonebook]$ node tests/test-add-2.js
Name foo woo not found in phonebook!
foo woo added with number 098-765-4321
[rule146@rule146: phonebook]$ tree phonebooks
phonebooks
└── pb1
    └── f
        └── o
            └── o
                ├── b
                │   └── a
                │       └── r
                │           └── 123-456-7890
                └── w
                    └── o
                        └── o
                            └── 098-765-4321
```
