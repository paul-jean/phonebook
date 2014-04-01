module.exports = function(pbDir) {
  return new PhoneBook(pbDir);
};

var PhoneBook = function(pbDir) {
  // TODO do I need to specify this.XXXX with everything like this?
  this.fs = require('fs');
  this.baseDir = './phonebooks';
  this.pbDir = pbDir;
  if (!this.fs.existsSync(this.baseDir))
      this.fs.mkdirSync(this.baseDir);
  if (!this.fs.existsSync(this.baseDir + '/' + this.pbDir))
      this.fs.mkdirSync(this.baseDir + '/' + this.pbDir);
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
  var dirName = this.baseDir + '/' + this.pbDir + '/' + accArray.join('/');
  this.fs.mkdir(dirName, function(err) {
    // If all subdirs have been created, call the callback to add the file with
    // the phone number
    if (dirArray.length === 0) f(accArray);
    else
      // TODO how best to specify the receiver here?
      // Why do I need to specify the receiver?
      // i.e. why can't I just say mkDirRecursive?
      that.mkDirRecursive(dirArray, accArray, f);
  });
};

PhoneBook.prototype.findNumber = function(name) {
  var dirString = this.baseDir + '/' + this.pbDir + '/' + this.strToDir(name);
  this.fs.readdir(dirString, function(err, files) {
    if (!files) {
      console.log('Name ' + name + ' not found in phonebook!');
      return null;
    }
    else if (files.length > 0)
      console.log(files[0]);
  });
};

PhoneBook.prototype.addNumber = function(name, number) {
  var that = this;
  if (this.findNumber(name)) {
    return null;
  }
  var lettersArray = [this.baseDir, this.pbDir].concat(this.strToCleanArray(name));
  this.mkDirRecursive(lettersArray, [], function(dirArray) {
    var dir = that.baseDir + '/' + that.pbDir + '/' + dirArray.join('/');
    var fname = dir + '/' + number;
    that.fs.writeFile(fname, '', function(err) {
      if (err) throw err;
      console.log(name + ' added with number ' + number);
    });
  });
};
