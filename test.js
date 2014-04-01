var phoneBook = require('./phonebook.js');
var pb = phoneBook('.');

/*
var foobar;
pb.mkDirRecursive('foobar'.split(''), [], function(accArray) {
  foobar = accArray;
  console.log(foobar);
});
*/

var fname = pb.addNumber('foo bar', '123-456-7890');
var found = pb.findNumber('foo bar');

console.log(fname);
console.log(found);

//addNumber('John Michael', '123-456-4323');
//console.log(findNumber('John Michael'));


