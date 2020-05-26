//https://api.github.com/users/Timansy
//[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
//[![Maintenance](https://img.shields.io/badge/Maintained%3F-no-red.svg)](https://bitbucket.org/lbesson/ansi-colors)

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
    var resp = axios.get(`https://api.github.com/users/${user}`, {
        // headers: {
        //     authorization: `token 6140073a91d485f651909bb1eab80bd3909bc516`
        // }
    })
        .then(response => {
            var res = [];
            // console.log(response);
            res.push(response.data.avatar_url);
            res.push(response.data.name);
            res.push(response.data.email);
            // console.log(res);
            return res;
        }).catch(error => {
            console.log(error);

        });
    return resp;
}

function writeToFile(answers) {
    var gethubinfo = getGithubInfo(answers.githubname);
    gethubinfo.then(resdata => {
        //badge grabbin
        var badge = "![Maintenance](https://img.shields.io/badge/maintained-yes-green)";
        
        if (answers.maintained != "yes"){
            badge = "![Maintenance](https://img.shields.io/badge/maintained-no-red)";
        }
        var data = `
# ${answers.title}

${badge}
        
## Project Description
${answers.description}

## Table of Contents
[\`Project Description\`](#project-description)

[\`Usage\`](#usage)

[\`License\`](#license)

[\`Contributing\`](#contributing)

[\`FAQ\`](#faq)

[\`Author\`](#author)

[\`GitHub Page\`](#github-page)

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

## GitHub Page {#ProjectDescription}

\`\`\`
https://${answers.name}.github.io/${answers.title}
\`\`\`
`;

        console.log("about to write...");
        fs.writeFile("README.MD", data, function (err) {
            if (err) return console.log(err);
            console.log('README.MD creadted successfully');
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
        , {
            type: 'input',
            name: 'maintained',
            message: 'Is this repository maintained? (any non-"yes" answer results in "no"',
            default:'yes'
        }
    ])
        .then(answers => {
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

askQuestions();
