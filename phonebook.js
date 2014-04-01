module.exports = function(pbDir) {
  return new PhoneBook(pbDir);
};

var PhoneBook = function(pbDir) {
  this.fs = require('fs');
  this.pbDir = pbDir;
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


PhoneBook.prototype.mkDirRecursive = function(dirArray, accArray, f) {
  var that = this;
  var lastDir = dirArray.shift();
  accArray.push(lastDir);
  var dirName = this.pbDir + '/' + accArray.join('/');
  console.log(dirName);
  this.fs.mkdir(dirName, function(err) {
    if (dirArray.length === 0) {
      f(accArray);
    }
    else
      that.mkDirRecursive(dirArray, accArray, f);
  });
};

PhoneBook.prototype.findNumber = function(name) {
  var dirString = this.pbDir + '/' + this.strToDir(name);
  console.log('[findNumber] ' + dirString);
  var num = this.fs.readdir(dirString, function(err, files) {
    for (var i = 0; i < files.length; i++)
      console.log('[findNumber] [readdir]' + files[i]);
    if (err) {
      return null;
    }
    else {
      // Just one phone number per name:
      return files[0];
    }
  });
  return num;
};

PhoneBook.prototype.addNumber = function(name, number) {
  var that = this;
  if (this.findNumber(name)) {
    return null;
  }
  var lettersArray = this.strToCleanArray(name);
  this.mkDirRecursive(lettersArray, [], function(dirArray) {
    var dir = that.pbDir + dirArray.join('/');
    var fname = dir + '/' + number;
    that.fs.writeFile(fname, '', function(err) {
      if (err) throw err;
      console.log('[PhoneBook.addNumber] ' + name + ' added with number ' + number);
    });
  });
};
