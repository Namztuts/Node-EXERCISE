const fs = require('fs');
const process = require('process');
const axios = require('axios');

//initializing the path and output variables for later use
let path;
let output;

function outputs(data, output) {
   // if there is a provided output file, then write to that file |
   if (output) {
      fs.writeFile(output, data, 'utf8', (error) => {
         if (error) {
            console.log(`Couldn't write ${output}: `, error);
            process.exit(1);
         }
      });
      // else just console.log the data
   } else {
      console.log('No output file, just console.log: ', data);
   }
}

function cat(filePath, output) {
   fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
         console.log(`Error reading ${filePath}: `, error);
         process.exit(1);
      }
      outputs(data, output);
   });
}

async function webCat(urlPath, output) {
   try {
      let response = await axios.get(urlPath);
      outputs(response.data, output);
   } catch (error) {
      console.log(`Error fetching ${urlPath}: `, error);
      process.exit(1);
   }
}

// first two items in process.argv are always (0) path to node (1) path to file | the 3rd item, process.argv[2], would be '--out' if provided in the command line
if (process.argv[2] === '--out') {
   output = process.argv[3]; //output file
   path = process.argv[4]; //file data to be sent to output file
} else {
   path = process.argv[2]; //process.argv[2] is just the file if no '--out' is provided
}

if (path.slice(0, 4) === 'http') {
   webCat(path, output);
} else {
   cat(path, output);
}

// node step3.js --out output.txt one.txt | takes the contents from 'one' and creates 'output.txt' file with that content in it
for (let arg of process.argv) {
   console.log(arg);
}

/*
node app.js file.txt                          | Reads `file.txt` and prints content to console
node app.js --out poem.txt file.txt           | Reads `file.txt` and writes content to `poem.txt`
node app.js http://example.com                | Fetches `http://example.com` and prints content to console
node app.js --out poem.txt http://example.com | Fetches `http://example.com` and writes to `poem.txt`
*/
