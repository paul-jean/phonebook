#!/bin/sh

node phonebook.js create 'pb_test'
node phonebook.js add 'foo bar' '123-456-7890' -b 'pb_test'
node phonebook.js add 'foo baz' '123-456-7890' -b 'pb_test'
node phonebook.js lookup 'foo baz' -b 'pb_test'
node phonebook.js lookup 'foo' -b 'pb_test'
