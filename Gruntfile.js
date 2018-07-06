module.exports = function(grunt)
{
	grunt.initConfig(
	{
	  jimp: 
	  {
	    placeholders:
	    {
	    	options:
	    	{
	    		suffix: 'placeholder',
	    		actions:
	    		{
	    			blur: 30,
	    			quality: 20,
	    		}
	    	},
	    	files:
	    	[{
	    		expand: true,
	    		cwd: './'
	    	}]
	    }

	  },
	})
	grunt.loadNpmTasks('grunt-jimp');
}
