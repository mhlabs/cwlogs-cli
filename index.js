#!/usr/bin/env node
const AWS = require("aws-sdk");
const program = require("commander");
const open = require("open");
const package = require("./package.json");
require("@mhlabs/aws-sdk-sso");
const tagCommand = require("./src/TagCommand");
const prefixCommand = require("./src/PrefixCommand");

process.env.AWS_SDK_LOAD_CONFIG = 1;

AWS.config.credentialProvider.providers.unshift(
  new AWS.SingleSignOnCredentials()
);

program.version(package.version, "-v, --version", "output the current version");

program
  .command("insights")
  .alias("i")
  .option(
    "-t, --tag [tag]",
    "Tag to filter on. Format: tagName:value1,value2. Optional. If omitted you will get prompted by available tags",
    false
  )
  .option(
    "-p, --prefix [prefix]",
    "Log group prefix. I.e /aws/lambda/. The more granular this is specified, the faster the command will run"
  )
  .option(
    "--pattern [pattern]",
    "Regex pattern used to filter the log group names"
  )
  .option(
    "--region [region]",
    "AWS region. Defaults to environment variable AWS_REGION"
  )
  .option(
    "--profile [profile]",
    "AWS profile. Defaults to environment variable AWS_PROFILE"
  )
  .description(
    "Opens a CloudWatch Logs console with multiple log groups matching a tag or prefix"
  )
  .action(async (cmd) => {
    AWS.config.region = cmd.region || process.env.AWS_REGION;
    process.env.AWS_PROFILE = cmd.profile || process.env.AWS_PROFILE;
    const args = cmd.parent.args;
    let url;
    if (args.includes("--tag") || args.includes("-t")) {
      url = await tagCommand.generateUrl(cmd.tag, cmd.pattern);
    }
    if (args.includes("--prefix") || args.includes("-p")) {
      url = await prefixCommand.generateUrl(cmd.prefix, cmd.pattern);
    }
    if (url) {
      open(url);
    } else {
      program.help();
    }

  });

program.parse(process.argv);
