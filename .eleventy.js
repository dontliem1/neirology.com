const fs = require("fs");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function(eleventyConfig) {
  // Add plugins

  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Human readable date
  eleventyConfig.addFilter("readableDate", function(dateStr) {
    return Date.parse(dateStr) ? (new Date(dateStr)).toLocaleDateString('ru', {day: "numeric", month: "long", year: "numeric"}) : dateStr;
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Copy the `static` folders to the output
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy({
    "node_modules/van11y-accessible-tab-panel-aria/dist/van11y-accessible-tab-panel-aria.min.js": "static/js/van11y-accessible-tab-panel-aria.min.js",
    "node_modules/dialog-polyfill/dist/dialog-polyfill.js": "static/js/dialog-polyfill.js",
    "node_modules/photoswipe/dist/default-skin": "static/css/default-skin",
    "node_modules/photoswipe/dist/photoswipe.css": "static/css/photoswipe.css",
    "node_modules/photoswipe/dist/photoswipe.min.js": "static/js/photoswipe.min.js",
    "node_modules/photoswipe/dist/photoswipe-ui-default.min.js": "static/js/photoswipe-ui-default.min.js",
  });
  eleventyConfig.addPassthroughCopy("favicon.svg");

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('docs/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don’t worry about leading and trailing slashes, we normalize these.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/neirology.com",
    // -----------------------------------------------------------------

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // Opt-out of pre-processing global data JSON files: (default: `liquid`)
    dataTemplateEngine: false,

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "docs"
    }
  };
};
