// Gruntfile with the configuration of grunt-express and grunt-open. No livereload yet!
module.exports = function(grunt) {
 
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  // Configure Grunt 
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    files: {
      modules: [
        'measure',
        'draw'
        // bg_switcher
        // infoclick
        // layer_switcher (toc?)
        // legend
        // copy_url
        // mouse_position
        // popup
        // tooltip
        // print
        // scale
        // search
        // bookmark
        // login
        // zoom_bar
        // artportalen
        // edit (wfs/wms (via wfs))
        // spatial_search
      ],
      vendor: [
        //'kartago-core/vendor/jquery-1.11.0/jquery-1.11.0.min.js',
        'kartago-core/vendor/handlebars-v1.3.0/handlebars-v1.3.0.js',
        'kartago-core/vendor/OpenLayers-2.13.1/OpenLayers.js',
        'kartago-core/vendor/underscore-1.6.0/underscore-min.js',
        'kartago-core/vendor/knockout-3.0.0/knockout-3.0.0.js'
      ]
    },

    copy: {
      project: {
        files: [
          { src:"<%= pkg.name %>/index.html", dest:"dist/index.html" },
          { src:"<%= pkg.name %>/config.js", dest:"dist/config.js" },
          { src:"<%= pkg.name %>/style.css", dest:"dist/style.css" },
          { src:"<%= pkg.name %>/app.js", dest:"dist/app.js" }

        ]
      }
    },

    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: [
          '<%= files.vendor %>',
          'kartago-core/core.js',
          'kartago-core/measure/measure.js',
          'kartago-core/draw/draw.js'
//          'kartago-core/<%= files.modules %>/*.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {

      }
    },

    uglify: {
      options: {
        mangle: false
      },
      js: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>.js']
        }
      }
    },

    // grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
    express: {
      all: {
        options: {
          port: 9000,
          hostname: "0.0.0.0",
          bases: ['dist'], // Replace with the directory you want the files served from
                              // Make sure you don't use `.` or `..` in the path as Express
                              // is likely to return 403 Forbidden responses if you do
                              // http://stackoverflow.com/questions/14594121/express-res-sendfile-throwing-forbidden-error
          livereload: true
        }
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        browser: true,
        multistr: true,
        funcscope: true,
        smarttabs: true,
        loopfunc: true,
        trailing: true,
        unused: false,
        white: true,
        globalstrict: true,        

        /* change this to true when debugging */
        devel: true,
        debug: true,

        globals: {
          '$': true,
          'OpenLayers': true,
          'Handlebars': true,
          'Kartago': true,
          'ko': true,
          '_': true
        }
      },
      files: {
        src: [
          'kartago-core/core.js',
          'kartago-core/measure/measure.js',
          'kartago-core/draw/draw.js',
//          'kartago-core/<%= files.modules %>/*.js',
          '<%= pkg.name %>/*.js'
        ]
      }
    },      
 
    // grunt-watch will monitor the projects files
    watch: {
      js: {
        files: [
          'kartago-core/core.js',
          'kartago-core/measure/measure.js',
          'kartago-core/draw/draw.js',
//          'kartago-core/<%= files.modules %>/*.js',
          '<%= pkg.name %>/*.js'
        ],
        tasks: ['jshint', 'concat:js', 'copy'],
        options: {
          livereload: true,
        }
      },

      css: {
        files: ['less/*.less'],
        tasks: ['less:style'],
        options: {
          livereload: true,
        }
      },

      html: {
        files: ['<%= pkg.name %>/index.html', '<%= pkg.name %>/style.css'],
        tasks: ['copy'],
        options: {
          livereload: true
        }
      }
    },
 
    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= express.all.options.port%>'
      }
    }
  });
 
  // Creates the `server` task
  grunt.registerTask('debug', [
    'jshint',
    'express',
    'concat:js',
    'copy',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat:js',
    'copy',
    'uglify'
  ]);
};