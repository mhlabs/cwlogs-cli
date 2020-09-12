# CWLogs CLI

CloudWatch Insights Logs is a great way to search your CloudWatch logs. Often you want to search across many log groups to, for example, tracing a correlation id across multiple services. CloudWatch Logs Insights lets you search across up to 20 log groups in one query, but adding log groups from the dropdown is a bit cumbersome.

This tool lets you generate and open a CloudWatch Logs Insights URL with your desired log groups pre-added. 

## Installation
`npm i -g @mhlabs/cwlogs-cli`

## Usage
You can specify which log groups you want to include as follows:

## By tag (Lambda logs only)

Command: `cwlogs tag [options]`

Usage:
```
$ cwlogs tag --help
Usage: cwlogs tag|t [options]

Opens a CloudWatch Logs console with multiple Lambda log groups matching a tag

Options:
  -t, --tag [tag]          Tag to filter on. Format: tagName:value1,value2. Optional. If omitted you will get prompted by available tags
  -p, --pattern [pattern]  Regex pattern used to filter the log group names
  -r, --region [region]    AWS region. Defaults to environment variable AWS_REGION
  --profile [profile]      AWS profile. Defaults to environment variable AWS_PROFILE
  -h, --help               display help for command
```

Example 1:
Query logs from lambda functions tagged with `team:ecommerce` that has the word `Api` in its name
`cwlogs tag -t team:ecommerce -p Api`

Example 2:
Query logs from lambda functions by cloudformation stack name tag using the guided menu
![Demo](https://raw.githubusercontent.com/mhlabs/cwlogs-cli/master/demo/demo-tag.gif)


## By log group prefix

Command: `cwlogs prefix <prefix> [options]`

Usage:
```
$ cwlogs prefix --help
Usage: `cwlogs prefix|p [prefix] [options] [prefix]`

Opens a CloudWatch Logs console with multiple log groups matching a prefix

Options:
  -p, --pattern [pattern]  Regex pattern used to filter the log group names
  -r, --region [region]    AWS region. Defaults to environment variable AWS_REGION
  --profile [profile]      AWS profile. Defaults to environment variable AWS_PROFILE
  -h, --help               display help for command
```

Example:
Query all RDS clusters' error logs
`cwlogs prefix /aws/rds/cluster --pattern \/error$`
![Demo](https://raw.githubusercontent.com/mhlabs/cwlogs-cli/master/demo/demo-prefix.gif)

## Known limitations
CloudWatch Logs Insights currently only allows up to 20 log groups in one query. The total numbe rof characters (query + log groups) may bot exceed 10000 characters.

