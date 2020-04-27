//https://api.github.com/users/Timansy

const inquirer = require('inquirer');
const axios = require("axios")

//general functions
const fs = require("fs");

function getCurrentDirectoryName() {
    var path = __dirname.split("\\");
    var cwd = path[path.length - 1];
    return cwd;
};

function getGithubInfo(user) {
    var resp = axios.get(`https://api.github.com/users/${user}`)
        .then(response => {
            var res = [];
            // console.log(response);
            res.push(response.data.avatar_url);
            res.push(response.data.name);
            res.push(response.data.email);
            console.log(res);
            return res;
        }).catch(error => {
            console.log(error);
        });
    return resp;
}

function writeToFile(answers) {
    var gethubinfo = getGithubInfo(answers.githubname);
    gethubinfo.then(resdata => {
        var data = `
# ${answers.title}

## Project Description
${answers.description}
    
## Usage
${answers.usage}
    
## License
${answers.license}

## Contributing
${answers.contributing}

## FAQ
${answers.questions}

## Author
#### ${resdata[1]}
[EMAIL: ${resdata[2]}](mailto:${resdata[2]})

<img src="${resdata[0]}" alt="${answers.description}s GitHub Image" width="50"/>

## GitHub Page

\`\`\`
https://${answers.name}.github.io/${answers.title}
\`\`\`
`;

        console.log("about to write");
        fs.writeFile("README.MD", data, function (err) {
            if (err) return console.log(err);
            console.log('README.MD creadTimted successfully');
        });

    });

}


function askQuestions() {
    inquirer.prompt([
        {   //github name
            type: 'input',
            name: 'githubname',
            message: 'What is your github name?',
            default: 'Timansy'
        }
        , {   //Title
            type: 'input',
            name: 'title',
            message: 'What is the title of this project?',
            default: getCurrentDirectoryName()
        }
        , {   //Description
            type: 'input',
            name: 'description',
            message: 'Description:',
        }
        , {   //Usage
            type: 'input',
            name: 'usage',
            message: 'Usage:'
        }
        , {   //licensing
            type: 'list',
            name: 'license',
            message: 'Licensing?',
            choices: ['Apache License 2.0'
                , 'BSD 3-Clause license'
                , 'BSD 2-Clause license'
                , 'GNU General Public License (GPL)'
                , 'GNU Library or "Lesser" General Public License (LGPL)'
                , 'MIT license'
                , 'Mozilla Public License 2.0'
                , 'Common Development and Distribution License'
                , 'Eclipse Public License version 2.0'
                , 'Other...'],
            default: 'MIT license'
        }
        , {   //Contributing
            type: 'input',
            name: 'contributing',
            message: 'Contributing instructions:'
        }
        , {   //Tests
            type: 'input',
            name: 'contributing',
            message: 'Testing instructions:'
        }
        , {   //Questions
            type: 'input',
            name: 'questions',
            message: 'FAQ:'
        }
    ])
        .then(answers => {
            // console.log(answers);
            console.log("here");
            writeToFile(answers);
        })
        .catch(error => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });

}
// const questions = [

// ];

// function writeToFile(fileName, data) {
// }

// function init() {

// }

// init();
askQuestions();
// getCurrentDirectoryName();