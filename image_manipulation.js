// imports
var Jimp = require('jimp');
const fs = require('fs')
const pngToJpeg = require('png-to-jpeg');

// inputs
dir    = process.argv[2]
target = process.argv[3]
suffix = process.argv[4]

// collect files
let dirCont = fs.readdirSync( dir );

const files = dirCont.filter( ( elm ) => /.*\.(png|jpg)/gi.test(elm) );

// run jimp on each file and write to target directory

for (i in files)
{  
	let file = files[i]
	let file_name_without_ext = file.replace(/\.[^/.]+$/, "")
	let extension = file.match(/\.[^/.]+$/)
	if (extension[0] == '.png')
	{
		console.log('found')
		let buffer = fs.readFileSync(dir+file);
		pngToJpeg({quality: 100})(buffer)
		.then(output => {
		fs.writeFileSync(dir+file_name_without_ext+'.jpg', output);
		extension = '.jpg'

		//
		let target_file = target + file_name_without_ext + '.' + suffix  + extension
		Jimp.read(dir+file_name_without_ext+extension).then(function (image) 
		{
			var w = image.bitmap.width; // the width of the image
			var h = image.bitmap.height; // the height of the image
			console.log(w,h)
		    return image.quality(20)
		    			.scale(0.01)
		    			.resize(w, h)
		    			.blur(30)
		    
		          .write(target_file);               
		})
		setTimeout(function(){
		fs.unlinkSync(dir+file_name_without_ext+'.jpg')}, 3000);
		});
	}
	else
	{
	    let target_file = target + file_name_without_ext + '.' + suffix  + extension
	    Jimp.read(dir+file_name_without_ext+extension).then(function (image) 
	    {
	    	var w = image.bitmap.width; // the width of the image
	    	var h = image.bitmap.height; // the height of the image
	    	console.log(w,h)
	        return image.quality(20)
	        			.blur(30)
	        
	              .write(target_file);               
	    })
	}
}


