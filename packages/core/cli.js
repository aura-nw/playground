#!/usr/bin/env node
require("source-map-support/register");

const semver = require("semver"); // to validate Node version
// const TaskError = require("./lib/errors/taskerror");
// const version = require("./lib/version");
// const versionInfo = version.info();
const XRegExp = require("xregexp");


// pre-flight check: Node version compatibility
const minimumNodeVersion = "12.0.0";
if (!semver.gte(process.version, minimumNodeVersion)) {
  console.log(
    "Error: Node version not supported. You are currently using version " +
      process.version.slice(1) +
      " of Node. Mokata requires Node v" +
      minimumNodeVersion +
      " or higher."
  );

  process.exit(1);
}

// This should be removed when issue is resolved upstream:
// https://github.com/ethereum/web3.js/issues/1648
const listeners = process.listeners("warning");
listeners.forEach(listener => process.removeListener("warning", listener));

const inputStrings = process.argv.slice(2);

const userWantsGeneralHelp =
  inputStrings.length === 0 ||
  (inputStrings.length === 1 && ["help", "--help"].includes(inputStrings[0]));

if (userWantsGeneralHelp) {
  const { displayGeneralHelp } = require("./lib/command-utils");
  displayGeneralHelp();
  process.exit(0);
}

const {
  getCommand,
  prepareOptions,
  runCommand
} = require("./lib/command-utils");

const command = getCommand({
  inputStrings,
  options: {},
  noAliases: false
});
const options = prepareOptions({
  command,
  inputStrings,
  options: {}
});

runCommand(command, options)
  .then(returnStatus => {
    process.exitCode = returnStatus;
    return;
  })
  .then(() => {
    // process.exit();
  })
  .catch(error => {
    if (typeof error === "number") {
      // If a number is returned, exit with that number.
      process.exit(error);
    } else {
      let errorData = error.stack || error.message || error.toString();
      // remove identifying information if error stack is passed to analytics
      if (errorData === error.stack) {
        const directory = __dirname;
        // making sure users' identifying information does not get sent to
        // analytics by cutting off everything before truffle. Will not properly catch the user's info
        // here if the user has truffle in their name.
        let identifyingInfo = String.raw`${directory.split("truffle")[0]}`;
        let removedInfo = new XRegExp(XRegExp.escape(identifyingInfo), "g");
        errorData = errorData.replace(removedInfo, "");
      }
      // Bubble up all other unexpected errors.
      console.log(error.stack || error.message || error.toString());
      // version.logTruffleAndNode(options.logger);
    }
    process.exit(1);
  });


//TODO Using source-map-support/register to call other module


// console.log("Hello world");
