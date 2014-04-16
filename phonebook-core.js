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
    .replace(' ', '$')
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
      PhoneBook.prototype.mkDirRecursive.call(that, dirArray, accArray, callback);
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

PhoneBook.prototype.lookupName = function(name, callback) {
  var that = this;
  var dir = that.pbDir + '/' + that.strToDir(name);
  var statCallback = function(filePath, fileNoPath) {
    return function(err, stats) {
      if (!stats) {
        var statsErr = {
          name: 'NoFileStat',
          message: 'File ' + fileNoPath + ' had an empty stat.'
        };
        callback(statsErr, name + ' ' + fileNoPath);
      } else if (stats.isFile()) {
        callback(null, name + ' ' + fileNoPath);
      }
      else if (stats.isDirectory()) {
        PhoneBook.prototype.lookupName.call(that, name + fileNoPath, callback);
      }
    };
  };
  fs.exists(dir, function(exists) {
    if (!exists) {
      var err ={ name:'NameNotInPhonebook', message:'Name not in phonebook.' };
      callback(err, null);
    } else {
      fs.readdir(dir, function(err, files) {
        for (var i = 0; i < files.length; i++) {
          var filePath = dir + '/' + files[i];
          var fileNoPath = files[i];
          fs.stat(filePath, statCallback(filePath, fileNoPath));
        }
      });
    }
  });
};

// TODO test
PhoneBook.prototype.removeName = function(name, callback) {
  var that = this;
  var dir = that.pbDir + '/' + that.strToDir(name);
  PhoneBook.prototype.lookupName(name, function(err, file) {
    if (err) {
      callback(err, file);
    } else if (!name) {
      callback(null, name);
    } else {
      fs.unlink(dir + '/' + file, function(err) {
        fs.readdir(dir, function(err, files) {
          // if the directory is empty, remove it and recurse up the dir tree
          if (!files) {
            fs.rmdir(dir, function(err) {
              var truncatedDir = dir.substring(0, dir.length - 1);
              PhoneBook.prototype.removeName(truncatedDir, callback);
            });
          }
        });
      });
    }
  });
};

PhoneBook.prototype.addNumber = function(name, number, callback) {
  var that = this;
  var lettersArray = [this.pbDir].concat(this.strToCleanArray(name));
  var dir = lettersArray.join('/');
  var file = lettersArray.concat([number]).join('/');
  fs.exists(dir, function (exists) {
    if (exists) {
      var err = { name: 'NameExists', message: 'Error: Name already in phonebook.' };
      callback(err, null);
    } else {
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
