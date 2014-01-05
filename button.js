var gpio = require('rpi-gpio');
var http = require('http');
//var request = require('request');

gpio.setup(11, gpio.DIR_IN);
gpio.setup(12, gpio.DIR_OUT);


function write() {

}



global.button_val = 1;

function readInput() {
    gpio.read(11, function(err, value) {
		console.log('testing ', value);
        if (value ==0 && value !== global.button_val) {
			var options = {
			  host: 'www.jimmytidey.co.uk',
			  port: 80,
			  path: '/ping.php'
			};
			/*
			http.get(options, function(res) {
			  console.log("Got response: " + res.statusCode);
			}).on('error', function(e) {
			  console.log("Got error: " + e.message);
			});
			*/
			global.clearInterval(checkInterval);
			
			flash();
			
			setTimeout(endFlash, 5000);
		}
         global.button_val = value;
        
    });
}

global.checkInterval = setInterval(readInput, 50);

function flash(){ 
	console.log('flashing');
	var state = 0; 

	global.flashInterval = setInterval(function(){
		if(state === 0) { 
			state =1; 
			gpio.write(12, true, function(err) {
				console.log('Written to pin');
			});
		} else { 
			state =0; 
			gpio.write(12, false, function(err) {
				console.log('Written to pin');
			});
		}
		console.log("state", state);
	}, 1000);
}

function endFlash(){
	
	console.log('ending flash cycle');
	clearInterval(global.flashInterval);
	gpio.write(12, false, function(err) {
		console.log('Written to pin');
	});
	global.checkInterval = setInterval(readInput, 50);
}

