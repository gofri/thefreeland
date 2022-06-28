const puppeteer = require("puppeteer");

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight - 1000){
                    clearInterval(timer);
                    resolve();
                }
            }, 10);
        });
    });
}

async function simpleScroll(page){
	await page.evaluate(async() => {
		var imgs = document.querySelector("img")
		for (var i = 0; i < imgs.length; i++) {
			imgs[i].scrollIntoView()
		}
	})
}

async function getPage(url) {
  try {
    // launch a new headless browser
    const browser = await puppeteer.launch();

      // check for https for safety!
      if (url.includes("https://")) {
        const page = await browser.newPage();

        // set the viewport size
        await page.setViewport({
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        });

	     /*
	await page.setExtraHTTPHeaders({
		'ismobileapp': 'true',
	})
	*/
	      await page.setExtraHTTPHeaders({
		'ismobileapp': 'true',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'upgrade-insecure-requests': '1',
        'accept': '*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,en;q=0.8'
    })

        // tell the page to visit the url
	// await page.waitForTimeout(10000)
	// await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
	// await page.setOfflineMode(true);
	 /*
        await page.setRequestInterception(true);
	page.on('request', request => {
		var url = request.url()
		if (url.startsWith('/_next')) {
			console.log(url)
		}
		if (url.startsWith('file:///_next')) {
			console.log(url)
			var x = url.substring(len('file://'))
			request.continue({url: 'https://haaretz.co.il'+x})
		} else {
			request.continue()
		}
	})
	*/

      var d1 = new Date()
      await page.goto(url, {waitUntil: 'load'});
      var d2 = new Date()
      console.log("time diff for url: " + url, d2 - d1)
	  /*
	await page.evaluate(() => {
		var scripts = document.querySelectorAll("script")
		for (var i = 0; i < scripts.length; i++) {
			var cur = scripts[i].getAttribute('href')
			if (cur && cur.startsWith('/_next')) {
				scripts[i].setAttribute('href', 'https://haaretz.co.il'+cur)
			}
		}
		scripts = document.querySelectorAll("link")
		for (var i = 0; i < scripts.length; i++) {
			var cur = scripts[i].getAttribute('href')
			if (cur && cur.startsWith('/_next')) {
				scripts[i].setAttribute('href', 'https://haaretz.co.il'+cur)
				scripts[i].setAttribute('rel', '')
			}
		}

	})
	*/
	// await page.setOfflineMode(false);
	// await page.waitForNavigation({waitUntil: 'load'})
        // await page.reload({waitUntil: 'load'})
	      /*
	await page.evaluate(() => {
		document.querySelector("h2#commentsSection").scrollIntoView({behavior: "smooth"})
	})*/
	await page.evaluate(() => {
		var header = document.querySelector("h2#commentsSection")
		if (header) {
			var section = header.parentElement
			// section.remove()
			section.hidden = true
		}
	})
	await autoScroll(page);
	// await page.waitForTimeout(2000)
	
	await page.evaluate(() => {
		var site = '' // TODO replace to free land
		var links = document.querySelectorAll('[data-test="link"]')
		for (var i = 0; i < links.length; i++) {
			var link = links[i]
			var href = link.getAttribute('href')
			if (href && href.startsWith('/')) {
				links[i].setAttribute('href', site + href)
			}
		}

		var links = document.querySelectorAll('[data-test="articleLink"]')
		for (var i = 0; i < links.length; i++) {
			var link = links[i]
			var href = link.getAttribute('href')
			if (href && href.startsWith('/')) {
				links[i].setAttribute('href', site + href)
			}
		}
		
	})

        // take a screenshot and save it in the screenshots directory
	// var path = `./screenshots/${args[i].replace("https://", "")}.png`
	// path = path.replaceAll("/", "_")
	var path = "./screenshots/new.png"
	// await page.screenshot({ path: path  });
	// await page.screenshot({ path: path  });
	// const pdfBuffer = await page.pdf({ path: path + '.pdf' });
	var h = await page.content();
	      if(typeof String.prototype.replaceAll === "undefined") {
		    String.prototype.replaceAll = function(match, replace) {
		       return this.replace(new RegExp(match, 'g'), () => replace);
		    }
		}
	// var s = h.replaceAll('"/_next/static', '"https://haaretz.co.il/_next/static')
	var s = h
	return s

        // done!
        // console.log(`✅ Screenshot of ${args[i]} saved!`);
      } else {
        console.error(`❌ Could not save screenshot of ${url}`);
      }

    // close the browser
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
module.exports = getPage
