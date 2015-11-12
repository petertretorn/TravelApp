module.exports = function(grunt) {



	grunt.initConfig({

		clean: {
			js: 'build/js',
			css: 'build/css'
		},

		timestamp: {
			options: {
				file: '.timestamp_grunt'
			}
		},

		jshint: {
			client: [
				'public/**/*.js', '!public/lib/**/*.js'
			]
		},

		less: {
			compile: {
				files: {
					'build/css.compiled.css': ['public/stylesheets/*.less', 'public/stylesheets/**/*.less']
				}
			}
		},

		concat: {
			js: {
				files: {
					'build/js/bundle.js': ['public/**/*.js', '!public/lib/**/*.js']
				}
			}
		},

		uglify: {
			js: {
				files: {
					'build/js/bundle.min.js': 'build/js/bundle.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.registerTask('default', ['less']);

	//task alias
	grunt.registerTask('js', 'Concatenate and minify static JS assets', ['concat:js', 'uglify:js']);

	grunt.registerTask('timestamp', function(options) {
		var options = this.options({
			file: '.timestamp'
		});

		var timestamp = +new Date();
		var contents = timestamp.toString();

		grunt.file.write(options.file, contents);
	})

};