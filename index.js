const express = require('express')
const app = express()
const port = 5000
const foo = require('./demo.js')

/*
app.get('/', (req, res) => {
  res.send('Hello World!' + req.)
})
*/

app.get('*', async function(req, res) {
  if (req.url.endsWith(".js") || 
    req.url.endsWith(".json") || 
    req.url.endsWith(".ico") ||
    req.url.endsWith(".woff") || 
    req.url.endsWith(".woff2")) {
	  res.send("")
	  return
  }
  /*
  url = "https://www.haaretz.co.il" + req.url
  d1 = new Date()
  html = await foo(url)
  d2 = new Date()
  console.log('total time', d2-d1)
  */
  html = "Express on Vercel"
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(html)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app
