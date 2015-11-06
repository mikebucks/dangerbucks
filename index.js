// Use harmonize to allow es6
require('harmonize')();

// Modules
var metalsmith  = require('metalsmith');
var collections = require('metalsmith-collections');
var permalinks  = require('metalsmith-permalinks');
var markdown    = require('metalsmith-markdown');
var templates   = require('metalsmith-templates');
var handlebars  = require('handlebars');
var sass        = require('metalsmith-sass');
var watch       = require('metalsmith-watch');
var fs          = require('fs');


// Set up global view partials
handlebars.registerPartial('header',
    fs.readFileSync(__dirname + '/templates/_header.hbt')
    .toString());
handlebars.registerPartial('footer',
    fs.readFileSync(__dirname + '/templates/_footer.hbt')
    .toString());


// Run
metalsmith(__dirname)
    .use(collections({
        pages: {
            pattern: 'content/pages/*.md'
        },
        entries: {
            pattern: 'content/entries/*.md',
            sortBy: 'date',
            reverse: true,
            metadata: {
                prefix: 'journal'
            }
        }
    }))
    .use(markdown())
    .use(permalinks({
        pattern: ':title'
    }))
    .use(templates('handlebars'))

    .use(sass({
        outputDir: 'css/'
    }))
    .use(watch({
        paths: {
            "${source}/**/*": true,
            "templates/**/*": "**/*.md"
        },
        livereload: true
    }))
    .destination('./build')
    .build(function(error) {
        if(error) console.error(error)
    });
