const AWS = require('aws-sdk');


var proxy = require('proxy-agent');    
AWS.config.update({
    httpOptions: { agent: proxy(process.env.HTTPS_PROXY) }
});

var kinesis = new AWS.Kinesis();



const makeBatch = (size) => {
    let records = [];
    for(let i = 0; i < size; i++) {
        records.push({
            Data: 'All work and no play makes Jack a dull boy',
            PartitionKey: `${i}`
        });
    }

    return records;
};


let params = {
    Records: makeBatch(25),
    StreamName: 'K3Stream'
};

kinesis.putRecords(params, (err, data) => {
    if(err) console.log(err)
    else console.log('Records sent');
});