# Events scheduler

A simple CRUD for events

## Architecture

AWS Api Gateway -> AWS Lambda ->  Amazon DynamoDB

![schemas](docs/serverless.png)
## DynamoDB partition key

* I have chosen 'user_id'  as the hash key because all queries will be user-level.
* We have chosen 'start_date' as the sort key because all queries will be based on the start date.