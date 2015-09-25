/**
 * This node.js script runs a command that collects a list of npm packages
 */

var fs = require('fs'),
  lineReader = require('line-reader'),
  execSync = require('exec-sync');

run();

function run() {
  // check if an argument is present. 
  if (process.argv.length == 3) {
    console.log('reading ' + process.argv[2] + ".....")
  } else {
    console.log("please specify a single filename as the argument")
    process.exit(1);
  }

  // returns false if the applist file does not exist
  try {
    var fileCheck = fs.readFileSync(process.argv[2], null);
  } catch (err) {
    console.log('File does not exist');
    return false;
  }

  execSync('echo " " > npmlist; ' + 'echo " " > report')
    // instantiates the line reader with a callback
  lineReader.eachLine(process.argv[2], function(line, last) {

    // split up the array into email and the app name 
    var array = line.toString().split("/");

    // asign array items to variables.
    var email = array[0];
    var appName = array[1];

    // series of commands, called in an asyncronous mannner
    try {
      execSync('appc cloud su ' + email)
      execSync('appc cloud download ' + appName + '; mkdir ' + appName)
      execSync('tar -xf ' + appName + '*.tar.gz --strip-components=1 -C ' + appName)
      execSync('rm ' + appName + '*.tar.gz')
    } catch (e) {
      console.log('Something went wrong, details => ', e);
    }

    // get the package.json file
    var file = appName + '/package.json';
    //read the json file
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) {
        console.log('Error : ' + err);
        return;
      }
      // parse the json file and store in a 'data' object
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log('Error : ', e);
      }

      // create empty array to store the dependencies in
      var output = [];

      try {
        var hCheck = data.healthCheck;
      } catch (e) {
        var hCheck = 'healthCheck does not exist'
      }
      
      var allDependencies = data.dependencies;
      var arr = data.dependencies['arrow'];

      //check if array is present
      if (arr == null) {
        arr = "no arrow version found";
      }

      // for every dependency in the dependency list, if the read dependency is 
      // in the dependency key, add/push it to the array.
      for (var key in allDependencies) {
        if (allDependencies.hasOwnProperty(key)) {
          output.push(key);
        }
      }

      // write date to the corresponding file
      fs.appendFileSync("report", 'Email: ' + email + '   ' + 'Name of app: ' + appName + "\n");
      fs.appendFileSync("report", 'HealthCheck: ' + hCheck + "\n");
      fs.appendFileSync("report", 'Arrow version: ' + arr + "\n");

      // loop over the output array and write the line to the npmlist text file.
      for (i = 0; i < output.length; i++) {
        pkge = output[i];

        // write packages to file
        fs.appendFileSync("npmlist", pkge + "\n");
      }
      
    }); // done with package.json

    // removes the app folder
    execSync('rm -rf ' + appName)

    //console.log(last)
    if (last) {
      execSync('sort -u -o npmlist npmlist')
    }

  }); // end of line reader

console.log('Node modules will be stored in the file "npmlist"')
console.log('A summary of each app will be stored in the file "report"')

} // end of run method