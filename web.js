const express = require('express')
const app = express()
const port = 3000
const foo = require('./demo.js')

/*
app.get('/', (req, res) => {
  res.send('Hello World!' + req.)
})
*/

app.get('*', async function(req, res) {
  if (req.url.endsWith(".js") || req.url.endsWith(".json") || req.url.endsWith(".ico")) {
	  res.send("")
	  return
  }
  url = "https://www.haaretz.co.il" + req.url
  html = await foo(url)
  res.send(html)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
