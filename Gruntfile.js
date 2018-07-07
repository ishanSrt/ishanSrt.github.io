module.exports = function(grunt)
{
	grunt.initConfig
	({
	  	run: 
	  	{
			options: 
			{
				// Task-specific options go here.
			},
			your_target: 
			{
				cmd: 'node',
				args: 
				[
				  'image_manipulation.js',
				  grunt.option('dir'),
				  grunt.option('target'),
				  grunt.option('suffix'),
				],
			},
	    }
	});
	grunt.loadNpmTasks('grunt-run');
	grunt.registerTask('default', ['run:your_target'])
}
