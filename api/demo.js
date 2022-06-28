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

const homepage = 'https://www.haaretz.co.il/'

async function getPage(url) {
  try {
	start = new Date()
    // launch a new headless browser
    const browser = await puppeteer.launch();

      // check for https for safety!
      if (url.includes("https://")) {
        const page = await browser.newPage();

        // set the viewport size
        await page.setViewport({
          width: 390,
          height: 844,
          deviceScaleFactor: 1,
        });

	     /*
	await page.setExtraHTTPHeaders({
		'ismobileapp': 'true',
	})
	*/
	      await page.setExtraHTTPHeaders({
		'ismobileapp': 'true',
        // 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
		'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        'upgrade-insecure-requests': '1',
        'accept': '*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,en;q=0.8',
		'z-backend-name': '0FXkDyJiycX8yd8K3dw1vx--F_react_www_htz',
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

	console.log("go to " + url)
    var d1 = new Date()
    await page.goto(url, {waitUntil: 'domcontentloaded'});
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
	if (url != homepage) {
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
	}

	// take a screenshot and save it in the screenshots directory
	// var path = `./screenshots/${args[i].replace("https://", "")}.png`
	// path = path.replaceAll("/", "_")
	// var path = "./screenshots/new.png"
	// await page.screenshot({ path: path  });
	// await page.screenshot({ path: path  });
	// const pdfBuffer = await page.pdf({ path: path + '.pdf' });
	_d1 = new Date()
	console.log("time before content: " + url, _d1 - d2)
	var h = await page.content();
	_d2 = new Date()
	console.log('time for content', _d2-_d1)

    // close the browser
    browser.close();

	if(typeof String.prototype.replaceAll === "undefined") {
		String.prototype.replaceAll = function(match, replace) {
			return this.replace(new RegExp(match, 'g'), () => replace);
		}
	}
	// var s = h.replaceAll('"/_next/static', '"https://haaretz.co.il/_next/static')
	console.log('time in foo', new Date() - start)
	return h
        // done!
        // console.log(`✅ Screenshot of ${args[i]} saved!`);
	} else {
		console.error(`❌ Could not save screenshot of ${url}`);
		return "<h1>load failed!</h1>";
	}
	
} catch (error) {
	console.log(error);
}
}
module.exports = getPage
