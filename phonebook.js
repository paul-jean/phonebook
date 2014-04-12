var PhoneBook = require('./phonebook-core.js');
var fs = require('fs');

var args = process.argv.slice(2);

var create = function (name) {
  var pbDir = ['.', 'phonebooks', name].join('/');
  fs.exists(pbDir, function (exists) {
    if (exists) {
      console.log('Phonebook ' + name + ' already exists at ' + pbDir);
    } else {
      var pb = PhoneBook(['phonebooks', name].join('/'));
    }
  });
};

var add = function(name, number, phoneBookName) {
  var pbDir = ['.', 'phonebooks', phoneBookName].join('/');
  var pb = new PhoneBook(pbDir);
  pb.addNumber(name, number, function(err, fname) {
    if (err) { throw err; }
    else {
      console.log('[' + name + ', ' + number + ']' + ' added to phonebook ' + phoneBookName);
      console.log('at path: ' + fname);
    }
  });
};

switch (true) {
  case args.length == 2  && args[0] === 'create':
    create(args[1]);
    break;
  case args.length == 5 && args[0] === 'add':
    add(args[1], args[2], args[4]);
    break;
  default:
    console.log(args + ' not supported');
}






