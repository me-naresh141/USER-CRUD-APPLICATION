let http = require('http')
let fs = require('fs')
let url = require('url')

let pathName = __dirname + '/users/'
let server = http.createServer(creatFile)

function creatFile(req, res) {
  let parsedURL = url.parse(req.url, true)
  console.log(parsedURL)
  let store = ''
  req.on('data', (chunk) => {
    store += chunk
  })
  req.on('end', () => {
    // create file
    if (req.url === '/users' && req.method === 'POST') {
      let username = JSON.parse(store).username
      fs.open(pathName + username + '.json', 'wx', (err, data) => {
        if (err) {
          console.log(err)
        }

        fs.writeFile(data, store, () => {
          res.end(`${username} successfully created`)
        })
      })
    }
    //   get a username
    if (parsedURL.pathname === '/users' && req.method === 'GET') {
      res.end(parsedURL.query.username)
    }
  })
  //   update username

  if (parsedURL.pathname === '/users' && req.method === 'PUT') {
    let username = parsedURL.query.username
    fs.open(pathName + username + '.json', 'r+', (err, data) => {
      if (err) return console.log(err)
      fs.ftruncate(data, (err) => {
        if (err) return console.log(err)
        fs.writeFile(data, store, (err) => {
          if (err) return console.log(err)
          fs.close(data, () => {
            res.end(data, `${username} update sucessfully`)
          })
        })
      })
    })
  }
  // delete  username

  if (parsedURL.pathname === '/users' && req.method === 'DELETE') {
    let username = parsedURL.query.username
    fs.unlink(pathName + username + '.json', (err) => {
      if (err) return console.log(err)
      res.end(`${username} deleted`)
    })
  }
}

server.listen(3000, () => {
  console.log('port num 3000')
})
