#!/bin/sh -x

cd ..
rm -rf phonebooks/pb_test
node phonebook.js create 'pb_test'
node phonebook.js add 'foo bar' '123-456-7890' -b 'pb_test'
node phonebook.js add 'foo baz' '098-765-4321' -b 'pb_test'
node phonebook.js lookup 'foo baz' -b 'pb_test'
node phonebook.js lookup 'foo' -b 'pb_test'
node phonebook.js lookup 'woo' -b 'pb_test'
node phonebook.js add 'woo bar' '456-123-7890' -b 'pb_test'
