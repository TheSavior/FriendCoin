module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        options: {
          style: "expanded"
        },
        files: [{
          'build/stylesheet/total.css': 'public/stylesheet/total.scss',
        }]
      },
      dist: {
        options: {
          style: "compressed",
        },
        files: [{
          'build/stylesheet/total.css': 'public/stylesheet/total.scss',
        }]
      }
    },

    watch: {
      options: {
        livereload: false
      },

      scss: {
        files: ['public/stylesheet/*.scss'],
        tasks: ['sass:dev'],
      },
      javascript: {
        files: 'public/javascript/**/*.js',
        tasks: ['requirejs'],
      },

      html: {
        files: 'public/*.html',
        tasks: ['env:dev', 'preprocess:html'],
      },

      images: {
        files: 'public/images/**/*',
        tasks: ['clean:images', 'copy:images'],
      },

      fonts: {
        files: 'public/fonts/**/*',
        tasks: ['clean:fonts', 'copy:fonts'],
      },

      files: {
        files: 'public/files/**/*',
        tasks: ['clean:files', 'copy:files'],
      },

      build: {
        files: ['build/**/*'],
        options: {
          livereload: true
        }
      },
    },

    requirejs: {
      compile: {
        options: {
          almond: true,

          name: "main",
          mainConfigFile: "public/javascript/config.js",
          out: "build/javascript/main.min.js",

          optimize: 'none',
          generateSourceMaps: false,

          preserveLicenseComments: false,
          wrap: true
        }
      },
    },

    uglify: {
      build: {
        files: {
          'build/javascript/main.min.js': ['build/javascript/main.min.js']
        }
      }
    },

    clean: {
      map: ["build/javascript/main.min.js.map"],
      images:["build/images/"],
      fonts:["build/fonts/"],
      files:["build/files/"]
    },

    env: {
      dev: {
        NODE_ENV: 'DEVELOPMENT'
      },

      prod: {
        NODE_ENV: 'PRODUCTION'
      }
    },

    preprocess: {
      html: {
        files: {
          'build/index.html': 'public/index.html'
        }
      },
    },

    copy: {
      images: {
        expand: true,
        flatten: true,
        filter: 'isFile',

        src: 'public/images/**/*',
        dest: 'build/images/',
      },

      fonts: {
        expand: true,
        flatten: true,
        filter: 'isFile',

        src: 'public/fonts/**/*',
        dest: 'build/fonts/',
      },

      cname: {
        filter: 'isFile',

        src: 'public/CNAME',
        dest: 'build/CNAME',
      },

      files: {
        expand: true,
        flatten: true,
        filter: 'isFile',

        src: 'public/files/**/*',
        dest: 'build/files/',
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: { // Dictionary of files
          'build/index.html': 'build/index.html',
          'build/404.html': 'build/404.html'
        }
      }
    },

    inline: {
      dist: {
        options: {
          tag: '',
          cssmin: true,
          uglify: true
        },
        src: ['build/index.html', 'build/404.html'],
        dest: ['build/']
      }
    },

    'http-server': {
        tests: {
            root: 'build',
            port: 3300,
            host: 'localhost',
            ext: 'html',

            runInBackground: true
        }
    }


  });

  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['env:prod', 'requirejs', /*'uglify', */ 'clean', 'preprocess', 'htmlmin', 'sass:dist', 'inline', 'copy' ]);
  grunt.registerTask('dev', ['env:dev', 'clean', 'copy', 'preprocess', 'requirejs', 'sass:dev', 'http-server', 'watch']);

};