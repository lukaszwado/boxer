/**
 * Created by Unknown on 2016-09-02.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.fileName %>.js',
                dest: 'build/<%= pkg.fileName %>.min.js'
            }
        },
        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },
        connect:{
            options: {
                hostname: 'localhost',
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('src')
                        ];
                    }
                }
            }
        }
    });

    // Load Karma
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('test', [
        'connect:test',
        'karma'
    ]);

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    // grunt.registerTask('default', ['uglify']);

    grunt.registerTask('build', ['test', 'uglify']);

};