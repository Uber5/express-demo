var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World! I\'m an Express Server!')
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Basic Express app listening at http://%s:%s', host, port)

})