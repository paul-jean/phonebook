module.exports = function(pbDir) {
  return new PhoneBook(pbDir);
};

var fs = require('fs');

var PhoneBook = function(pbDir) {
  this.pbDir = pbDir;
  var pbDirArray = pbDir.split('/');
  var i, pbSubDir;
  for (i = 1; i <= pbDirArray.length; i++) {
    pbSubDir = pbDirArray.slice(0,i).join('/');
    fs.exists(pbSubDir, function (exists) {
      if (!exists)
        fs.mkdir(pbSubDir, function (err) {
          if (err) throw(err);
        });
    });
  }
};

PhoneBook.prototype.strToCleanArray = function(str) {
  var letters = str
    .replace(' ', '')
    .replace('-', '')
    .toLowerCase()
    .split('');
  return letters;
};

PhoneBook.prototype.strToDir = function(str) {
  var letters = this.strToCleanArray(str);
  return letters.join('/');
};

// TODO empty folder for separator between first and last name

// PhoneBook.prototype.create = function(name);

PhoneBook.prototype.mkDirRecursive = function(dirArray, accArray, callback) {
  var that = this;
  var lastDir = dirArray.shift();
  accArray.push(lastDir);
  var dirName = accArray.join('/');
  fs.mkdir(dirName, function(err) {
    // TODO don't ignore err
    // If all subdirs have been created, call the callback to add the file with
    // the phone number
    if (dirArray.length === 0) callback(accArray);
    else
      // TODO how best to specify the receiver here?
      // Why do I need to specify the receiver?
      // i.e. why can't I just say mkDirRecursive?
      that.mkDirRecursive(dirArray, accArray, callback);
  });
};

// TODO: test
PhoneBook.prototype.rmDirRecursive = function(dirArray, levels, callback) {
  var dArray, d, i, s;
  for (i = 0; i < levels; i++) {
    s = nameDirArray.slice(0, i);
    dArray = baseDirArray.concat(s);
    d = dArray.join('/');
    console.log('INFO: Looking for directory ' + d);
    fs.rmdir(d, function(err) {
      if (err) {
        callback(err, d);
      }
    });
    callback(null, d);
  }
};

// TODO: add callback arg
PhoneBook.prototype.findNumber = function(name, callback) {
  var dirString = this.pbDir + '/' + this.strToDir(name);
  fs.readdir(dirString, function(err, files) {
    if (callback) {
      callback(err, files);
    } else if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
      }
    } else {
        console.log(name + ' not found in phonebook at ' + dirString);
    }
  });
};

PhoneBook.prototype.addNumber = function(name, number, callback) {
  var that = this;
  var lettersArray = [this.pbDir].concat(this.strToCleanArray(name));
  var file = lettersArray.concat([number]).join('/');
  fs.exists(file, function (exists) {
    if (exists) {
      throw { name: 'DuplicateName', message: 'Error: Name already in phonebook.' };
    }
    else {
      that.mkDirRecursive(lettersArray, [], function(dirArray) {
        var dir = dirArray.join('/');
        var fname = dir + '/' + number;
        fs.writeFile(fname, '', function(err) {
          if (callback) {
            callback(err, fname);
          } else if (err) throw err;
        });
      });
    }
  });
};
