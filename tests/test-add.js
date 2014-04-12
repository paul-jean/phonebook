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
var expectedFile = baseDirArray
    .concat(nameArray)
    .concat([number])
    .join('/');

var testFile = function(err, fname) {
  if (err) throw err;
  fs.exists(expectedFile, function(exists) {
    assert.equal(exists, true, 'FAILED: foo bar was not created!');
    console.log('Added ' + expectedFile + ' to the phonebook pb_test!');
  });
}

fs.exists(expectedFile, function (exists) {
  if (exists) {
    fs.unlink(expectedFile, function(err) {
      if (err) { throw err; }
      pb.addNumber(name, number, testFile);
    });
  } else {
    pb.addNumber(name, number, testFile);
  }
});
