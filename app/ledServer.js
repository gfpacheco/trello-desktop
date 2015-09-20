const net = require('net');
const five = require("johnny-five");


const board = new five.Board();


var server;
var leds;

board.on('ready', function() {
    leds = [
        new five.Led.RGB({
            pins: {
                red: 10,
                green: 9,
                blue: 11
            }
        }),
        // for white led
        // new five.Led(3),
        // new five.Led(5),
        // new five.Led(6),
        // new five.Led(9),
        // new five.Led(10),
        // new five.Led(11)
    ];

    leds.forEach(function(led) {
        // led.color("#fd3f3e"); //original color
        led.color("#fd1514"); //color for failing leds
    });


    this.wait(2500, function() {
      if (leds) {
          leds.forEach(function(led) {
              led.stop().off();
          });
      }
    });
});

server = net.createServer(function(conn) {
    console.log('client connected');

    conn.on('data', function(data) {
        if (data == "blink") {
            if (leds) {
                leds.forEach(function(led) {
                    led.blink(500);
                });
            }
        } else {
            if (leds) {
                leds.forEach(function(led) {
                    led.stop().off();
                });
            }
        }
        console.log("Data Received: " + data);
    });

    conn.on('end', function() {
        console.log("Server ended!");
    });
});


server.listen(8124, function() { //'listening' listener
    console.log('server bound');
});
