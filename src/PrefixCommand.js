const AWS = require("aws-sdk");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
const { Spinner } = require("cli-spinner");
const UrlHelper = require("./UrlHelper");
const spinner = new Spinner();
spinner.setSpinnerString("⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈");

async function generateUrl(prefix, pattern) {
  spinner.start();
  let logGroups = await getLogGroups(prefix, pattern);
  spinner.stop();
  console.log("\n");

  if (logGroups.length > 20) {
    logGroups = (
      await prompt({
        message: `CloudWatch Logs Insights has a limit of 20 log groups. You have selected ${logGroups.length}. Please select the ones you want to keep.`,
        name: "value",
        type: "checkbox",
        choices: logGroups
          .sort(),
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
  for (const logGroup of logGroups) {
    source += `$257E$2527${logGroup}`.replace(/\//g, "*2f")
  }
  return UrlHelper.getUrl("fields*20*40timestamp*2c*20*40message*2c*20*40logStream*0a*7c*20filter*20*40message*20like*20*2fException*2f*0a*7c*20sort*20by*20*40timestamp*20desc", source);
}

async function getLogGroups(prefix, pattern) {
  const logs = new AWS.CloudWatchLogs();
  const list = [];
  let token;
  do {
    const response = await logs
      .describeLogGroups({ nextToken: token, logGroupNamePrefix: prefix })
      .promise();

    list.push(
      ...response.logGroups
        .filter((p) => {
          return p.logGroupName.match(pattern) && p.storedBytes > 0;
        })
        .map((p) => p.logGroupName)
    );
    token = response.nextToken;
  } while (token);
  return list;
}

module.exports = { generateUrl };
