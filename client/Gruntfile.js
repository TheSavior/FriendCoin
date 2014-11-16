module.exports = function(grunt) {
  // var build = '../server/build/';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        options: {
          style: "expanded"
        },
        files: [{
          '../server/build/stylesheet/total.css': 'public/stylesheet/total.scss',
        }]
      },
      dist: {
        options: {
          style: "compressed",
        },
        files: [{
          '../server/build/stylesheet/total.css': 'public/stylesheet/total.scss',
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
        files: ['../server/build/**/*'],
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
          out: "../server/build/javascript/main.min.js",

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
          '../server/build/javascript/main.min.js': ['../server/build/javascript/main.min.js']
        }
      }
    },

    clean: {
      map: ["../server/build/javascript/main.min.js.map"],
      images:["../server/build/images/"],
      fonts:["../server/build/fonts/"],
      files:["../server/build/files/"]
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
          '../server/build/index.html': 'public/index.html'
        }
      },
    },

    copy: {
      images: {
        expand: true,
        flatten: true,
        filter: 'isFile',

        src: 'public/images/**/*',
        dest: '../server/build/images/',
      },

      fonts: {
        expand: true,
        flatten: true,
        filter: 'isFile',

        src: 'public/fonts/**/*',
        dest: '../server/build/fonts/',
      },

      cname: {
        filter: 'isFile',

        src: 'public/CNAME',
        dest: '../server/build/CNAME',
      },

      files: {
        expand: true,
        flatten: true,
        filter: 'isFile',

        src: 'public/files/**/*',
        dest: '../server/build/files/',
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: { // Dictionary of files
          '../server/build/index.html': '../server/build/index.html',
          '../server/build/404.html': '../server/build/404.html'
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
        src: ['../server/build/index.html', '../server/build/404.html'],
        dest: ['../server/build/']
      }
    },

    'http-server': {
        tests: {
            root: '../server/build',
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