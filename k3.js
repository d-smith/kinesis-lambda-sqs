const _ = require('lodash');
const AWSXray = require('aws-xray-sdk');
const AWS =  AWSXray.captureAWS(require('aws-sdk'));
const SQS = new AWS.SQS();
var Chance = require('chance'),
    chance = new Chance();

console.log(`QueueUrl is ${process.env.DOWNSTREAM_Q_URL}`);

const doIt = async (event, context, callback) => {
    let records = event["Records"];
    console.log(`doIt invoked with ${records.length}`);

    let fail = chance.bool({likelihood: 0});
    if(fail == true) {
        console.log('Failure!!!');
        callback(new Error('fail!'), 'ding it');
        return;
    }
    
    var chunks;
    AWSXray.captureFunc('chunkInput', function(subsegment){
        chunks = _.chunk(records, 10);
        console.log(`${chunks.length} chunks`);
        subsegment.close();
    });
    


    chunks.forEach((chunk) => {
        AWSXray.captureAsyncFunc('processChunk', function(ss){
            processChunk(chunk, ss);
        });
        
    });

    callback(null, 'ok');
};

const processChunk = (chunk, subsegment) => {
    let id = 0;
    let entries = [];

    chunk.forEach((cr) => {
        let crData = Buffer.from(cr.kinesis.data, 'base64').toString()
        entries.push({
            Id: `${id++}`,
            MessageBody: crData
        });
    })

    let params = {
        QueueUrl: process.env.DOWNSTREAM_Q_URL,
        Entries: entries
    };  

    SQS.sendMessageBatch(params, (err, data) => {
        if(err) console.log(err, err.stack)
        else {console.log(data);}
        subsegment.close();
    });
}

const doRecord = async (event, context, callback) => {
    console.log(`doRecord called with event ${JSON.stringify(event)}`);
    callback(null, 'ok');
};

module.exports = {
    doRecord,
    doIt
};