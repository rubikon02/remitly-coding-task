# Remitly Coding Task


## Description
Write a method verifying the input JSON data. Input data format is defined as AWS::IAM::Role Policy - definition and example ([AWS IAM Role JSON definition and example](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-role-policy.html)). Input JSON might be read from a file.

Method should return logical false if an input JSON Resource field contains a single asterisk and true in any other case.


## Prerequisites
This project requires Node.js and npm to run. 

To make sure you have them installed, try running the following commands:
```shell
npm -v  # 9.6.4
node -v # 20.9.0
```

## Installation
Clone the repository and install dependencies

```
git clone https://github.com/rubikon02/remitly-coding-task
cd remitly-coding-task
npm install
```


## Usage

To verify the policy from the file, execute:

```
npm run verify <file_path>
```


### Examples:

Correct policy:

```
npm run verify tests/data/noAsterisk.json
```

Incorrect policy:

```
npm run verify tests/data/asterisk.json
```


## Tests
Tests are located in `tests` directory with sample policies in `tests/data`.

To run all the tests, execute:

```
npm test
```