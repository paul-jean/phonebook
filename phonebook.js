module.exports = function(pbDir) {
  return new PhoneBook(pbDir);
};

var fs = require('fs');

var PhoneBook = function(pbDir) {
  // TODO do I need to specify this.XXXX with everything like this?
  // TODO don't need to have fs as part of PhoneBook state
  this.baseDir = './phonebooks';
  this.pbDir = pbDir;
  if (!fs.existsSync(this.baseDir))
      fs.mkdirSync(this.baseDir);
  if (!fs.existsSync(this.baseDir + '/' + this.pbDir))
      fs.mkdirSync(this.baseDir + '/' + this.pbDir);
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


PhoneBook.prototype.mkDirRecursive = function(dirArray, accArray, f) {
  var that = this;
  var lastDir = dirArray.shift();
  accArray.push(lastDir);
  var dirName = accArray.join('/');
  fs.mkdir(dirName, function(err) {
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
  fs.readdir(dirString, function(err, files) {
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
    var dir = dirArray.join('/');
    var fname = dir + '/' + number;
    fs.writeFile(fname, '', function(err) {
      if (err) throw err;
      console.log(name + ' added with number ' + number);
    });
  });
};
