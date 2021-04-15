This is some boiler plate code that can be used to set up a device to serve webpages stored on the device. It enables easier development as the web pages are minfied, quoted and inserted into the webserver file automatically using gulp. This means you can easily develop the code and deploy it to the device easily.

Once you have edited the files in the code directory, just run gulp and it will update the module in the modules folder. I then run the below commands to deploy the code to the device.

// basic cmd line to connect to devices
espruino -p COM10 --no-ble -b 115200


// I use the below one to automatically keep the code on the device in sync with the dev code.

espruino -p COM5 --no-ble -b 115200 -w main.js

Do not edit the webserver file in the modules folder. This will get over written by the next gulp run.

####EDIT webserver file in code/modules folder

Changes to the host website will need to be recompiled by running gulp before deployment. This will minify the separate html, css and js files and merge the files into the webserver file in the modules folder.
