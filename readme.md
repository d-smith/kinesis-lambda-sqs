# kinesis-lambda-sqs

Simple kinesis serverless example, with a lambda procesing records from a
stream, writing messages to an sqs queue in batches for processing.

Parameters to experiment with:

* The batch size for the stream (batchSize in serverless.yml)
* The concurrency limit on the lambda processing messages from the queue (reserverdConcurrency in serverless.yml)

## Set Up

Install dependencies

```console
npm install
```

Deploy the stack

```console
sls deploy --stage <stage> --aws-profile <profile>
```

Write a batch of records to the stream. Edit send-batch.js to send batches of different sizes.

```console
node send-batch.js --stream-name <stream name> --batch <num records>
```

Example:

```console
node send-batch.js --stream K3Stream-ds --batch 10
```

Note that to run the node send-batch you need to set your AWS_PROFILE and AWS_REGION environment variables. If running behind a firewall, make sure the https_proxy environment variable is set as well, which you need for the sls/serverless commands.

View the function log to verify the processing of the record

```console
sls logs --function hello --aws-profile <profile>
sls logs --function processRecord --aws-profile <profile>
```

