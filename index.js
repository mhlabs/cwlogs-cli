#!/usr/bin/env node
const AWS = require("aws-sdk");
const program = require("commander");
const open = require("open");
const package = require("./package.json");
require("@mhlabs/aws-sdk-sso");
const tagCommand = require("./src/TagCommand");
const regexCommand = require("./src/PrefixCommand");

AWS.config.credentialProvider.providers.unshift(
  new AWS.SingleSignOnCredentials()
);

program.version(package.version, "-v, --vers", "output the current version");

program
  .command("tag")
  .alias("t")
  .option(
    "-t, --tag [tag]",
    "Tag to filter on. Format: tagName:value1,value2. Optional. If omitted you will get prompted by available tags"
  )
  .option(
    "-p, --pattern [pattern]",
    "Regex pattern used to filter the log group names"
  )
  .option(
    "-r, --region [region]",
    "AWS region. Defaults to environment variable AWS_REGION"
  )
  .option(
    "--profile [profile]",
    "AWS profile. Defaults to environment variable AWS_PROFILE"
  )
  .description(
    "Opens a CloudWatch Logs console with multiple Lambda log groups matching a tag"
  )
  .action(async (cmd) => {
    AWS.config.region = cmd.region || process.env.AWS_REGION;
    process.env.AWS_PROFILE = cmd.profile || process.env.AWS_PROFILE;

    const url = await tagCommand.generateUrl(cmd.tag, cmd.pattern);
    open(url);
  });
program
  .command("prefix [prefix]")
  .alias("p [prefix]")
  .option(
    "-p, --pattern [pattern]",
    "Regex pattern used to filter the log group names"
  )
  .option(
    "-r, --region [region]",
    "AWS region. Defaults to environment variable AWS_REGION"
  )
  .option(
    "--profile [profile]",
    "AWS profile. Defaults to environment variable AWS_PROFILE"
  )
  .description(
    "Opens a CloudWatch Logs console with multiple log groups matching a prefix"
  )
  .action(async (prefix, cmd) => {
    AWS.config.region = cmd.region || process.env.AWS_REGION;
    process.env.AWS_PROFILE = cmd.profile || process.env.AWS_PROFILE;
    const url = await regexCommand.generateUrl(prefix, cmd.pattern);
    open(url);
  });

program.parse(process.argv);
