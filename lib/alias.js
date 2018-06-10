/*
  This is from: https://github.com/dannytatom/muddy
  All credit to him for this!
*/

var path = require('path')
  , fs   = require('fs')

var aliases, file = 'config/aliases.json'

fs.exists(file, function(exists) {
  if (exists) {
    aliases = JSON.parse(fs.readFileSync(file, 'utf8'))
  } else {
    fs.writeFileSync(file, '{}', 'utf8')
    aliases = JSON.parse(fs.readFileSync(file, 'utf8'))
  }
})

exports.list = function() {
  return aliases
}

exports.create = function(alias, callback) {
  var string = alias.replace(';alias add ', '')
    , array  = string.match(/\{(?:[^\\}]+|\\.)*}/g)
    , key    = array[0].replace('{', '').replace('}', '')
    , value  = array[1].replace('{', '').replace('}', '')

  aliases[key] = value

  fs.writeFile(file, JSON.stringify(aliases), function(err) {})
}

exports.remove = function(alias, callback) {
  var string  = alias.replace(';alias rm ', '')
    , array   = string.match(/\{(?:[^\\}]+|\\.)*}/g)

  for (var i = 0; i < array.length; i++) {
    var alias = array[i].replace('{', '').replace('}', '')

    if (aliases[alias]) {
      delete aliases[alias]
    }
  }

  fs.writeFile(file, JSON.stringify(aliases), function(err) {})
}

exports.format = function(data) {
  for (var alias in aliases) {
    var data = data.replace(alias, aliases[alias])
  }

  return data + '\r\n'
}
