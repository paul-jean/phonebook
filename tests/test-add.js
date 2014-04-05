var PhoneBook = require('../phonebook.js');
var fs = require('fs');
var assert = require('assert');

var pbname = 'pb_test';

var baseDirArray = ['..', 'phonebooks', pbname];
var pb = PhoneBook(baseDirArray.join('/'));

var name = 'foo bar';
var number = '123-456-7890';

var baseDir = baseDirArray.join('/');
var nameArray = name.replace(' ', '').split('');
var nameDirArray = [pbname].concat(nameArray);
var nameDir = nameDirArray.join('/');
var expectedDirArray = baseDirArray.concat(nameDirArray);
var expectedDir = expectedDirArray.join('/');
var expectedFileArray = expectedDirArray.concat([number]);
var expectedFile = expectedFileArray.join('/');

fs.exists(expectedFile, function (exists) {
  if (!exists) console.log('INFO: ' + expectedFile + ' does not exist.');
  else
    fs.unlink(expectedFile, function(err) {
      if (err) throw(err);
      console.log('INFO: Deleting ' + expectedFile);
    });
});

console.log('INFO: Removing test phonebook ...');
var dArray, d, i, s;
for (i = nameDirArray.length; i > 0; i--) {
  s = nameDirArray.slice(0, i);
  dArray = baseDirArray.concat(s);
  d = dArray.join('/');
  console.log('INFO: Looking for directory ' + d);
  fs.rmdir(d, function(err) {
    if (!err)
      console.log('INFO: Deleting directory ' + d);
  });
}

var that = this;
pb.addNumber(name, number, function(err) {
  if (err) throw(err);
  fs.exists(expectedFile, function(exists) {
    assert.equal(exists, true, 'FAILED: foo bar was not created!');
    console.log('INFO: added ' + expectedFile + ' to the phonebook!');
  });
});
