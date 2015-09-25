# npmlist


A Node.js app called npmlist. It is used to collect a list of npm packages information from apps that have been published.

## Running Locally

Before attempting to run the command, make sure that your have the latest version of [Node.js](http://nodejs.org/). Run 'npm install' to download the required modules


You need to have the email and the name of the app inside a text file. An example is shown below.

```sh
user1@email.com/app1
user1@email.com/app2
user2@email.com/myApp
user2@email.com/app1
```

To run the command, execute: 

```sh
node appAnalyzer <'filename'>
```

Node modules will be stored in the file "npmlist"
A summary of each app will be stored in the file "report"

## Documentation

For more information about using Node.js, see this link:

- [Node.js Documentation](https://nodejs.org/api/)

