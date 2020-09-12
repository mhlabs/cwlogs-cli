# CWLogs CLI

CloudWatch Insights Logs is a great way to search your CloudWatch logs. Often you want to search across many log groups to, for example, tracing a correlation id across multiple services. CloudWatch Logs Insights lets you search across up to 20 log groups in one query, but adding log groups from the dropdown is a bit cumbersome.

This tool lets you generate and open a CloudWatch Logs Insights URL with your desired log groups pre-added. 

## Installation
`npm i -g @mhlabs/cwlogs-cli`

## Usage
```
$ cwlogs insights --help
Usage: cwlogs insights|i [options]

Opens a CloudWatch Logs console with multiple log groups matching a tag or prefix

Options:
  -t, --tag [tag]        Tag to filter on. Format: tagName:value1,value2. Optional. If omitted you will get
                         prompted by available tags (default: false)
  -p, --prefix [prefix]  Log group prefix. I.e /aws/lambda/. The more granular this is specified, the faster the
                         command will run
  --pattern [pattern]    Regex pattern used to filter the log group names
  --region [region]      AWS region. Defaults to environment variable AWS_REGION
  --profile [profile]    AWS profile. Defaults to en
```

You can either use `--tag` or `--prefix` to group log groups 
## By tag (Lambda logs only)

Command: `cwlogs insights --tag <tag?> [options]`

Example 1:
Query logs from lambda functions tagged with `team:ecommerce` that has the word `Api` in its name
`cwlogs insights --tag team:ecommerce --pattern Api`

Example 2:
Query logs from lambda functions by cloudformation stack name tag using the guided menu
![Demo](https://raw.githubusercontent.com/mhlabs/cwlogs-cli/master/demo/demo-tag.gif)


## By log group prefix

Command: `cwlogs insights --prefix <prefix> [options]`

Example:
Query all RDS clusters' error logs
`cwlogs insights --prefix /aws/rds/cluster --pattern \/error$`
![Demo](https://raw.githubusercontent.com/mhlabs/cwlogs-cli/master/demo/demo-prefix.gif)

## Known limitations
CloudWatch Logs Insights currently only allows up to 20 log groups in one query. The total number of characters (query + log groups) may bot exceed 10000 characters.

