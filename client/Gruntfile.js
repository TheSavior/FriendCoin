module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        files: [{
          'build/stylesheets/total.css': 'src/stylesheets/total.scss',
        }]
      },

      prod: {
        options: {
          style: 'compressed',
        },
        files: [{
          'build/stylesheets/total.css': 'src/stylesheets/total.scss',
        }]
      }
    },

    watch: {
      options: {
        livereload: false
      },

      scss: {
        files: ['src/stylesheets/*.scss'],
        tasks: ['sass:dev'],
      },

      javascript: {
        files: ['src/js/**/*.js', 'src/js/**/*.jsx'],
        tasks: ['browserify:dev']
      },

      html: {
        files: 'src/*.html',
        tasks: ['copy:html']
      },

      fonts: {
        files: 'src/fonts/**/*',
        tasks: ['clean:fonts', 'copy:fonts'],
      },

      build: {
        options: {
          livereload: true
        },
        files: 'build/**/*'
      }
    },

    env: {
      dev: {
        NODE_ENV: 'development'
      },

      prod: {
        NODE_ENV: 'production'
      }
    },

    clean: {
      fonts: ['build/fonts/']
    },

    copy: {
      html: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: 'src/*.html',
        dest: 'build/'
      },

      fonts: {
        expand: true,
        flatten: true,
        filter: 'isFile',

        src: 'src/fonts/**/*',
        dest: 'build/fonts/',
      },
    },

    browserify: {
      options: {
        transform: [
          require('grunt-react').browserify
        ],
        browserifyOptions: {
          debug: true
        }
      },

      dev: {
        src: 'src/js/main.js',
        dest: 'build/js/main.js'
      },

      prod: {
        options: {
          browserifyOptions: {
            debug: false
          }
        },
        src: 'src/js/main.js',
        dest: 'build/js/main.js'
      }
    },

    uglify: {
      build: {
        files: {
          'build/js/main.js': ['build/js/main.js']
        }
      }
    },

    'http-server': {
      dev: {
        root: 'build',
        port: 7777,
        host: 'localhost',
        ext: 'html',

        runInBackground: true
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', []);
  grunt.registerTask('dev', ['env:dev', 'browserify:dev', 'clean', 'copy', 'sass:dev', 'http-server', 'watch']);
  grunt.registerTask('prod', ['env:prod', 'browserify:prod', 'uglify', 'clean', 'copy', 'sass:prod']);

};
