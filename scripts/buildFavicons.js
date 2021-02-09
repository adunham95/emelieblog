const path = require("path")
const fs = require("fs")
// let faviconInfo = [

// ]
let images = [];
let html = [];
var favicons = require('favicons'),
    source = path.join(__dirname,'../static/img/default-logo.png'),                     // Source image(s). `string`, `buffer` or array of `string`
    configuration = {
        path: "/",                                // Path for overriding default icons path. `string`
        appName: null,                            // Your application's name. `string`
        appShortName: null,                       // Your application's short_name. `string`. Optional. If not set, appName will be used
        appDescription: null,                     // Your application's description. `string`
        developerName: null,                      // Your (or your developer's) name. `string`
        developerURL: null,                       // Your (or your developer's) URL. `string`
        dir: "auto",                              // Primary text direction for name, short_name, and description
        lang: "en-US",                            // Primary language for name and short_name
        background: "#fff",                       // Background colour for flattened icons. `string`
        theme_color: "#fff",                      // Theme color user for example in Android's task switcher. `string`
        appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
        display: "standalone",                    // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
        orientation: "any",                       // Default orientation: "any", "natural", "portrait" or "landscape". `string`
        scope: "/",                               // set of URLs that the browser considers within your app
        start_url: "/?homescreen=1",              // Start URL when launching the application from a device. `string`
        version: "1.0",                           // Your application's version string. `string`
        logging: false,                           // Print logs to console? `boolean`
        pixel_art: false,                         // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
        loadManifestWithCredentials: false,       // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
        icons: {
            // Platform Options:
            // - offset - offset in percentage
            // - background:
            //   * false - use default
            //   * true - force use default, e.g. set background for Android icons
            //   * color - set background for the specified icons
            //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
            //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
            //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
            //
            android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            appleStartup: false,         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            coast: false,                // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            favicons: true,             // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            windows: true,              // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
            yandex: false                // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
        }
    },
    callback = function (error, response) {
        if (error) {
            console.log(error.message); // Error description e.g. "An unknown error has occurred"
            return;
        }

        // console.log(response.images);   // Array of { name: string, contents: <buffer> }
        // console.log(response.files);    // Array of { name: string, contents: <string> }
        console.log(response.html);     // Array of strings (html elements)


        images = response.images;
        html = response.html;

        finish()
    };
 
favicons(source, configuration, callback);

function finish(){
    // console.log(images);

    let faviconInfo = images.map(i => {
            console.log(i)
            //Make the favicon if does not exist
            let dir = path.join(__dirname,`../static/img/favicons`)
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }

            //Get the Data from the string
            const found = html.find(element => element.includes(i.name));

            //Make the file path
            let filePath = path.join(__dirname,`../static/img/favicons/${i.name}`);
            // console.log(typeof found)
            if(typeof found !== "undefined"){
                const regex = /href="([^"]*)/gi;
                let htmlString = found.replace(regex, `href="${filePath}"`);
                // console.log(htmlString)
                return ({
                    data: i.contents,
                    link: filePath,
                    htmlString
                })
            }
            else{
                return ({
                    data: i.contents,
                    link: filePath,
                    htmlString: ""
                })
            }
            // fs.writeFile(filePath, i.contents, function updateMarkDown(err) {
            //     if (err) return console.log(err)
            //     console.log("writing to " + filePath)

            //     if(typeof found !== "undefined"){
            //         const regex = /href="([^"]*)/gi
            //         let htmlString = found.replace(regex, `href="${filePath}"`);
            //         return ({
            //             link: filePath,
            //             htmlString
            //         })
            //     }
            //   })
        }).map(img => {
            fs.writeFile(img.link, img.data, function updateMarkDown(err) {
                    if (err) return console.log(err)
                    console.log("writing to " + img.link)
            })
            delete img.data;
            return img
        }).filter(i => i.htmlString !== "")

        console.log(faviconInfo)

        const metaDataPath = path.join(__dirname, '../data/meta.json')
        fs.readFile(metaDataPath, "utf8", (err, data) => {
            let metaData = JSON.parse(data);
            console.log(metaData)
            metaData.favicons = faviconInfo.map(img => {delete img.data; return img});

            fs.writeFile(metaDataPath, JSON.stringify(metaData), function updateMarkDown(err) {
                if (err) return console.log(err)
                console.log("writing to " + metaDataPath)
        })
        })

}