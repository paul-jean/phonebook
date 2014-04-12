var PhoneBook = require('./phonebook-core.js');
var fs = require('fs');

console.log(process.argv);
var args = process.argv.slice(2);

if (args[0] === 'create') {
  if (args.length > 1) {
    var name = args[1];
    var pbDir = ['.', 'phonebooks', name].join('/'); 
    fs.exists(pbDir, function (exists) {
      if (exists) {
        console.log('Phonebook ' + name + ' already exists at ' + pbDir);
      } else {
        var pb = PhoneBook(['phonebooks', name].join('/'));
      }
    });
  }
}






