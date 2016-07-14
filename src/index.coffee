###
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
###

{statSync} = require 'fs'
{rmrfSync} = require 'fs.extra'
mkdirp = require 'mkdirp'
async = require 'async'
tempdir = require './tempdir'
ensureSelenium = require './selenium'
ensureChromedriver = require './chromedriver'

TEMP_PATH = "#{tempdir}testium"

makePaths = (binPath, tempPath) ->
  console.log('create paths')
  mkdirp.sync binPath
  mkdirp.sync tempPath

removeDir = (dir) ->
  console.log('remove dir')
  rmrfSync(dir)

binariesExist = (binPath) ->
  [ 'selenium.jar', 'chromedriver' ].every (binary) ->
  # [ 'selenium.jar' ].every (binary) ->
    console.log "src/index:53 >> #{binPath}/#{binary}"
    console.log ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - '
    try
      statSync "#{binPath}/#{binary}"
    catch e
      return false
    return true

ensure = (binPath, callback) ->
  return callback() if binariesExist(binPath)

  makePaths(binPath, TEMP_PATH)

  async.parallel [
    ensureSelenium(binPath, TEMP_PATH)
    ensureChromedriver(binPath, TEMP_PATH)
  ], callback

update = (binPath, callback) ->
  removeDir binPath
  console.log 'what the actual fuck'
  ensure(binPath, callback)

forceUpdate = (binPath, callback) ->
  removeDir binPath
  removeDir TEMP_PATH
  ensure(binPath, callback)

module.exports = { update, forceUpdate, ensure }
