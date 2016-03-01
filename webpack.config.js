var getConfig = require('hjs-webpack');

module.exports = getConfig({
    in : 'src/index.js',

    out: 'public',

    isDev : process.env.NODE_ENV !== 'production',

    output : {
        hash: true
    },

    devServer: {
      hot: true,
      historyApiFallback: true,
      info: true
    },

    clearBeforeBuild: false,

     html: function (data) {
        // here we return an object where each key is a file to be generated
        return {
          'index.html': [
            '<html>',
              '<head>',
                '<meta charset="utf-8" />',
		            '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">',
		            '<meta name="apple-mobile-web-app-capable" content="yes">',
		            '<meta name="apple-mobile-web-app-status-bar-style" content="black">',
                '<meta content="" name="description" />',
                '<meta content="" name="author" />',
                '<base href="/">',
                '<link href="/' + data.css + '" rel="stylesheet" type="text/css" />',
                '<link href="http://fonts.googleapis.com/css?family=Lato:300,400,400italic,600,700|Raleway:300,400,500,600,700|Crete+Round:400italic" rel="stylesheet" type="text/css" />',
              '</head>',
              '<body>',
                '<div id="root"></div>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>',
                '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>',
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js"></script>',
                '<script src="' + data.main + '"></script>',
              '</body>',
            '</html>'
          ].join('')
        }
      }
});
