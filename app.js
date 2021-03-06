var fs = require('fs');
const crypto = require('crypto');
const express = require("express");
// const exStatic = require("express-static");
const DbConfig = {
  host     : 'bj-cynosdbmysql-grp-kqvvbnw0.sql.tencentcdb.com',
  port     : 28556,
  user     : 'test',
  password : 'test',
  database : 'dwz'
}

// 连接数据库
const mysql      = require('mysql');
const connection = mysql.createConnection(DbConfig)
 
const app = express();



app.get('/creat', (req, res) => {
  const data = req.query.data
  let md5 = crypto.createHash('md5').update(data).digest("hex")
  let md5Shot = md5.slice(0 , 16)
  console.log(`INSERT new URL: ${data}`)
  // connection.connect()
  connection.query('INSERT INTO `url` (shot, url) VALUES (? , ?)', [md5Shot, data], function (error, results, fields) {
    if (error) throw error;
    // connection.end()
    res.send({
      err: 0,
      data: md5Shot
    })
    
  });
})

app.get('/*', (req, res) => {
  if (!req.params[0] || req.params[0] == 'index.html') {
    fs.readFile('./www/index.html', 'utf-8', function(err,data){
      if(err) throw err;
      res.send(data);
    });
    return
  }
  const md5Shot = req.params[0]
  // connection.connect()
  connection.query('SELECT * FROM url WHERE shot = ?', [md5Shot], function (error, results, fields) {
    if (error) throw error;
    // connection.end()
    if (results[0]) {
      console.log(results[0].url)
      res.redirect(results[0].url)
    } else {
      res.send('404 not fond!')
    }
  });
})
 
// app.use(exStatic('./www'));
app.listen(8000);
console.log('App is runing at http://127.0.0.1:8000')