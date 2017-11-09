module.exports = {
	html: true,
	images: true,
	fonts: true,
	static: true,
	svgSprite: true,
	ghPages: false,
	stylesheets: true,

	javascripts: {
		entry: {
			// Files paths are relative to
			// javascripts.dest in path-config.json
			app: [ "./app.js" ]
		},
		provide: {
			$: "jquery",
			jQuery: "jquery"
		},
		plugins: ( webpack ) => { return [ new webpack.DefinePlugin( { "global.GENTLY_HIJACK": false } ) ]; },
		customizeWebpackConfig: function( webpackConfig, env, webpack ) {
			webpackConfig.resolve.extensions.push( ".json" );
			webpackConfig.node = {
				fs: "empty",
				net: "empty",
				tls: "empty",
				async: "empty",
				cheerio: "empty",
				request: "empty",
				package: "empty",
				_: "empty"
			};

			if ( env === "production" ) {
				webpackConfig.devtool = "source-map";
			}

			return webpackConfig;
		}
	},

	browserSync: {
		ui: false,
		server: {
			baseDir: "public"
		},
		open: false
	},

	production: {
		rev: true,
		devtool: "source-map"
	}
};
