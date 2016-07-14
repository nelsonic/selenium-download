
/*
Copyright (c) 2014, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var copy, downloadFile, fs, validate;

fs = require('fs');

copy = require('fs.extra').copy;

downloadFile = require('../download');

validate = require('../checksum');

module.exports = function(binPath, tempPath, url, version, callback) {
  var binFilePath, file;
  file = 'selenium.jar';
  binFilePath = binPath + "/" + file;
  return fs.stat(binFilePath, function(error) {
    var tempFileName, tempFilePath, validTempFilePath;
    if (error == null) {
      return callback;
    }
    tempFileName = "selenium_" + version + ".jar";
    tempFilePath = tempPath + "/" + tempFileName + "/selenium-server-standalone-" + version + ".jar";
    console.log('selenium/download:45 tempFilePath:', tempFilePath);
    console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
    validTempFilePath = tempPath + "/" + tempFileName + ".valid";
    return fs.stat(validTempFilePath, function(error) {
      if (!error) {
        return copy(validTempFilePath, binFilePath, function(error, hash) {
          if (error != null) {
            return callback(error);
          }
        });
      } else {
        return downloadFile(url, tempPath, tempFileName, function(error, hash) {
          if (error != null) {
            return callback(error);
          }
          return validate(tempFilePath, hash, function(error) {
            if (error != null) {
              return callback(error);
            }
            return copy(tempFilePath, validTempFilePath, function(error) {
              if (error != null) {
                return callback(error);
              }
              return copy(tempFilePath, binFilePath, callback);
            });
          });
        });
      }
    });
  });
};
