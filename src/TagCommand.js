const AWS = require("aws-sdk");
const inquirer = require("inquirer");
const { type } = require("os");
const prompt = inquirer.createPromptModule();
const urlHelper = require("./UrlHelper");
const { Spinner } = require("cli-spinner");
const spinner = new Spinner();
spinner.setSpinnerString("⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈");

async function generateUrl(tag, pattern) {
  const logs = new AWS.CloudWatchLogs();
  const tags = new AWS.ResourceGroupsTaggingAPI();
  let tagKey;
  let tagValues;

  if (typeof tag === "string" || tag instanceof String) {
    const split = tag.split(":");
    tagKey = split[0].trim();
    tagValue = split[1].split(",").map((p) => p.trim());
  } else if (tag === true) {
    spinner.start();
    const tagKeys = await getAllTagKeys(tags);
    spinner.stop();
    console.log("\n");
    tagKey = (
      await prompt({
        message: "Select tag key",
        name: "value",
        type: "list",
        choices: tagKeys.sort((a, b) => {
          if (a.toLowerCase() > b.toLowerCase()) return 1;
          if (a.toLowerCase() < b.toLowerCase()) return -1;
          return 0;
        }),
      })
    ).value;
    spinner.start();
    const valuesForTag = await getAllTagValues(tags, tagKey);
    spinner.stop();
    console.log("\n");

    tagValues = (
      await prompt({
        message: "Select tag values",
        name: "value",
        type: "checkbox",
        choices: valuesForTag.sort((a, b) => {
          if (a.toLowerCase() > b.toLowerCase()) return 1;
          if (a.toLowerCase() < b.toLowerCase()) return -1;
          return 0;
        }),
        validate: async (input) => {
          if (!input.length) {
            return "Please select a tag value";
          }
          if (input.length > 20) {
            return "You can select max 20";
          }
          return true;
        },
      })
    ).value;
  }

  spinner.start();
  let resources = await getAllResources(tags, tagKey, tagValues, pattern);
  spinner.stop();
  console.log("\n");
  if (resources.length > 20) {
    resources = (
      await prompt({
        message: `CloudWatch Logs Insights has a limit of 20 log groups. You have selected ${resources.length}. Please select the ones you want to keep.`,
        name: "value",
        type: "checkbox",
        choices: resources
          .map((p) => {
            return { name: p.ResourceARN.split(":").slice(-1)[0], value: p };
          })
          .sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            return 0;
          }),
        validate: async (input) => {
          if (!input.length) {
            return "Please select a tag value";
          }
          return true;
        },
      })
    ).value;
  }

  let source = "";
  for (const resource of resources) {
    const lambdaName = resource.ResourceARN.split(":").slice(-1)[0];
    const existingLogGroup = await logs
      .describeLogGroups({ logGroupNamePrefix: `/aws/lambda/${lambdaName}` })
      .promise();
    if (existingLogGroup.logGroups.length) {
      source += `$257E$2527*2faws*2flambda*2f${lambdaName}`;
    }
  }
  return urlHelper.getUrl(
    "fields*20*40timestamp*2c*20*40message*2c*20*40logStream*0a*7c*20filter*20*40message*20like*20*2fException*2f*0a*7c*20sort*20by*20*40timestamp*20desc",
    source
  );
}

async function getAllResources(tags, tagKey, tagValues, pattern) {
  const list = [];
  let token;
  do {
    const response = await tags
      .getResources({
        PaginationToken: token,
        TagFilters: [
          {
            Key: tagKey,
            Values: tagValues,
          },
        ],
      })
      .promise();

    list.push(
      ...response.ResourceTagMappingList.filter(
        (p) =>
          p.ResourceARN.startsWith("arn:aws:lambda") &&
          p.ResourceARN.split(":").slice(-1)[0].match(pattern)
      )
    );
    token = response.PaginationToken;
  } while (token);
  return list;
}

async function getAllTagKeys(tags) {
  let list = [];
  let token;
  do {
    const response = await tags
      .getTagKeys({
        PaginationToken: token,
      })
      .promise();

    list.push(...response.TagKeys);

    token = response.PaginationToken;
  } while (token);
  return list;
}

async function getAllTagValues(tags, key) {
  let list = [];
  let token;
  do {
    const response = await tags
      .getTagValues({
        Key: key,
        PaginationToken: token,
      })
      .promise();

    list.push(...response.TagValues);

    token = response.PaginationToken;
  } while (token);
  return list;
}

module.exports = { generateUrl };
