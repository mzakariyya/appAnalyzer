/**
 * This node.js script runs a command that collects a list of npm packages
 */

var fs = require('fs'),
  lineReader = require('line-reader'),
  execSync = require('exec-sync'),
  exec = require('child_process').exec,
  child,
  async = require('async');

run();

function run() {
  // check if an argument is present. 
  if (process.argv.length = 3) {
    console.log('reading ' + process.argv[2])
  } else {
    console.log("please specify a single filename as the argument")
    process.exit(1);
  }
  // instantiates the line reader with a callback
  lineReader.eachLine(process.argv[2], function(line, last, cb) {

    // split up the array into email and the app name 
    var array = line.toString().split("/");

    // array looks like ['email', 'appName']
    // loop through the array, saving the email and app name
    for (var i = 0; i < array.length; i++) {
      var email = array[i - 1];
      var appName = array[i];
    }

    // series of commands, called in an asyncronous mannner
    execSync('appc cloud su ' + email)

    execSync('appc cloud download ' + appName + '; mkdir ' + appName)

    execSync('tar -xf ' + appName + '*.tar.gz --strip-components=1 -C ' + appName)

    execSync('rm ' + appName + '*.tar.gz; cd ' + appName)

    var file = appName + '/package.json'; 
    //read the json file
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        console.log('Error ......: ' + err);
        return;
      }
      // parse the json file and store in a 'data' object
      data = JSON.parse(data);

      // create empty array to store the dependencies in
      var output = [];

      var allDependencies = data.dependencies;
      // for every dependency in the dependency list, if the read dependency is 
      // in the dependency key, add/push it to the array.
      for (var key in allDependencies) {
        if (allDependencies.hasOwnProperty(key)) {
          output.push(key);
        }
      }
      // loop over the output array and write the line to the npmlist text file.
      for (i = 0; i < output.length; i++) {
        pkge = output[i];
        fs.appendFileSync("npmlist", pkge + "\n");

      }

      // removes any duplicates in npmlist
      execSync('sort -u -o npmlist npmlist')
     
    });

    cb(); // line reader callback 
 
  execSync('rm -rf ' + appName)

   }); // end of line reader

} // end of run method

