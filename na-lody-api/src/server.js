const app = require('./app');

const PORT = process.env.PORT || 3000;

const https = require('https')
const fs = require('fs')

const httpsOptions = {
  key: fs.readFileSync('src/keytmp.pem'),
  cert: fs.readFileSync('src/cert.pem'),
  passphrase: 'admin'
}
const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log('server running at ' + PORT)
})