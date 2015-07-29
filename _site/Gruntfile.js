module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //less编译
        less: {
            development: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: 'assets/src/less/*.less',
                    dest: 'assets/src/css/',
                    ext: '.css'
                }]
            }
        },
        // 文件合并
        concat: {
            options: {
                stripBanners: true
            },
            js: {
                src: ["assets/src/js/*.js"],
                dest: "docs/dist/myblog.js"
            },
            css: {
                src: [
                    "assets/src/css/*.css"
                ],
                dest: "dist/myblog.css"
            }
        },
        //js压缩
        uglify: {
            prod: {
                options: {
                    mangle: {
                        except: ['require', 'exports', 'module', 'window']
                    },
                    compress: {
                        global_defs: {
                            PROD: true
                        },
                        dead_code: true,
                        pure_funcs: [
                            "console.log",
                            "console.info"
                        ]
                    }
                },

                files: [{
                    expand: false,
                    cwd: '',
                    src: '/dist/myblog.js',
                    dest: '/dist/myblog.min.js'

                }]
            }
        },
        //压缩CSS
        cssmin: {
            prod: {
                options: {
                    report: 'gzip'
                },
                files: [{
                    expand: false,
                    cwd: '',
                    src: 'dist/myblog.css',
                    dest: 'dist/myblog.min.css'
                }]
            }
        },
        //复制
        copy: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'assets/vendor',
                    src: ['**/*'],
                    dest: 'dist/vendor/'
                }]
            }
        },
        //js检查
        jshint: {
            // define the files to lint
            files: ['Gruntfile.js', 'src/js/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                globals: {
                    "asi": true,
                    "browser": true,
                    "eqeqeq": false,
                    "eqnull": true,
                    "es3": true,
                    "expr": true,
                    "jquery": true,
                    "latedef": true,
                    "laxbreak": true,
                    "nonbsp": true,
                    "strict": true,
                    "undef": true,
                    "unused": true,
                    "laxcomma": false,
                    "newcap": true,
                    "predef": ["CLASSMAP", "console"]
                }
            }
        },

        // qunit: {
        //     options: {
        //         inject: 'test/qunit/phantom.js'
        //     },
        //     files: 'test/test.html'
        // },

        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['jshint', 'less', 'concat', 'uglify', 'cssmin', 'copy'],
                options: {
                    spawn: false,
                },
            },
            html: {
                files: ['*.html'],
                tasks: ['jshint', 'less', 'concat', 'uglify', 'cssmin', 'copy'],
                options: {
                    spawn: false,
                },
            }
        },
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify', 'cssmin', 'copy']);
};
