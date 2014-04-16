var PhoneBook = require('./phonebook-core.js');
var fs = require('fs');

var commands = ['create', 'lookup', 'add', 'change', 'remove', 'reverse-lookup'];

var examples =
{
  create: 'phonebook create hsphonebook.pb\n',
  lookup: 'phonebook lookup Sarah -b hsphonebook.pb # error message on no such phonebook\n',
  add: 'phonebook add \'John Michael\' \'123 456 4323\' -b hsphonebook.pb # error message on duplicate name\n',
  change: 'phonebook change \'John Michael\' \'234 521 2332\' -b hsphonebook.pb # error message on not exist\n',
  remove: 'phonebook remove \'John Michael\' -b hsphonebook.pb # error message on not exist\n',
  'reverse-lookup': 'phonebook reverse-lookup \'312 432 5432\' -b hsphonebook.pb\n'
};

var usage = function(type) {
  var args = Array.prototype.slice.call(arguments),
      message = 'Phonebook usage:\n',
      i;
  for (i = 0; i < args.length; i++) {
    message += examples[args[i]];
  }
  return message;
};

if (process.argv.length < 3) {
  throw {
    name: 'BadArgs',
    message: usage.call(null, commands)
  };
}

var args = process.argv.slice(2);

var create = function(argsObj) {
  var name = argsObj.phonebook;
  var pbDir = ['.', 'phonebooks', name].join('/');
  fs.exists(pbDir, function (exists) {
    if (exists) {
      throw {
        name: 'DuplicateName',
        message:'Phonebook ' + name + ' already exists at ' + pbDir
      };
    } else {
      var path = ['phonebooks', name].join('/');
      var pb = PhoneBook(['phonebooks', name].join('/'));
      console.log('New phonebook created at ' + path);
    }
  });
};

var lookup = function(argsObj) {
  var pbName = argsObj.phonebook;
  var name = argsObj.name;
  var pbDir = ['.', 'phonebooks', pbName].join('/');
  var pb = new PhoneBook(pbDir);
  pb.lookupName(name, function(err, file) {
    var cleanName = name.replace('$', ' ');
    if (err) {
      if (err.name === 'NameNotInPhonebook') {
        console.log(cleanName + ' not found in phonebook at ' + pbDir);
      } else if (err.name === 'NoFileStat') {
        console.log(err.message);
      }
    } else {
      var cleanFile = file.replace('$', ' ');
      console.log(cleanName + ': ' + cleanFile);
    }
  });
};

var add = function(argsObj) {
  var name = argsObj.name,
      number = argsObj.number,
      phoneBookName = argsObj.phonebook;
  var pbDir = ['.', 'phonebooks', phoneBookName].join('/');
  var pb = new PhoneBook(pbDir);
  pb.addNumber(name, number, function(err, fname) {
    if (err) {
      console.log('Name \'' + name + '\' already in phonebook!');
    }
    else {
      console.log('[' + name + ', ' + number + ']' + ' added to phonebook ' + phoneBookName);
      console.log('at path: ' + fname);
    }
  });
};

var remove = function(argsObj) {
  var name = argsObj.name,
      phoneBookName = argsObj.phonebook;
  var pbDir = ['.', 'phonebooks', phoneBookName].join('/');
  var pb = new PhoneBook(pbDir);
  pb.removeName(name, function(err, file) {
    if (err) throw err;

  });
};

var parseArgs = function(args) {
  var switchPosition = -1,
      i,
      pbName,
      command,
      commandPosition = -1,
      argsObj = {},
      func;

  for (i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-b':
        switchPosition = i;
        break;
      case 'add':
      case 'change':
      case 'create':
      case 'lookup':
      case 'remove':
      case 'reverse-lookup':
        commandPosition = i;
        break;
    }
  }
  if (switchPosition < 0 && args[commandPosition] !== 'create') {
    throw {name: 'BadArgs', message: 'No phonebook name specified.'};
  }
  if (commandPosition < 0) {
    throw {name: 'BadArgs', message: 'Command not recognized.'};
  }
  command = args[commandPosition];

  switch (command) {
    // phonebook add 'John Michael' '123 456 4323' -b hsphonebook.pb # error message on duplicate name
    case 'add':
      if (!args[commandPosition + 2]) {
        throw {name: 'BadArgs', message: 'Must specify both name and number to add.'};
      }
      argsObj = {
        command: 'add',
        name: args[commandPosition + 1],
        number: args[commandPosition + 2],
        phonebook: args[switchPosition + 1]
      };
      func = add;
      break;
    // phonebook change 'John Michael' '234 521 2332' -b hsphonebook.pb # error message on not exist
    case 'change':
      if (!args[commandPosition + 2]) {
        throw {name: 'BadArgs', message: 'Must specify both name and number to change.'};
      }
      argsObj = {
        command: 'change',
        name: args[commandPosition + 1],
        number: args[commandPosition + 2],
        phonebook: args[switchPosition + 1]
      };
      func = change;
      break;
    // phonebook create hsphonebook.pb
    case 'create':
      if (!args[commandPosition + 1]) {
        throw {name: 'BadArgs', message: 'Must specify phonebook to create.'};
      }
      argsObj = {
        command: 'create',
        phonebook: args[commandPosition + 1]
      };
      func = create;
      break;
    // phonebook lookup Sarah -b hsphonebook.pb # error message on no such phonebook
    case 'lookup':
      if (!args[commandPosition + 1]) {
        throw {name: 'BadArgs', message: 'Must specify a name to look up.'};
      }
      argsObj = {
        command: 'lookup',
        name: args[commandPosition + 1],
        phonebook: args[switchPosition + 1]
      };
      func = lookup;
      break;
    // phonebook reverse-lookup '312 432 5432' -b hsphonebook.pb
    case 'reverse-lookup':
      if (!args[commandPosition + 1]) {
        throw {name: 'BadArgs', message: 'Must specify a number to look up.'};
      }
      argsObj = {
        command: 'reverse-lookup',
        number: args[commandPosition + 1],
        phonebook: args[switchPosition + 1]
      };
      func = reverse_lookup;
      break;
    default:
      throw {name: 'BadArgs', message: 'Command ' + command + ' not supported.'};
  }
  return {func: func, argsObj: argsObj};
};

var parsedArgs = parseArgs(args);
var func = parsedArgs.func;
var argsObj = parsedArgs.argsObj;

func(argsObj);



