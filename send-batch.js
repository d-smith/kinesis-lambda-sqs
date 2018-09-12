const AWS = require('aws-sdk');


var proxy = require('proxy-agent');    
AWS.config.update({
    httpOptions: { agent: proxy(process.env.https_proxy) }
});

var kinesis = new AWS.Kinesis();



const makeBatchData = (size) => {
    let records = [];
    for(let i = 0; i < size; i++) {
        records.push({
            Data: 'All work and no play makes Jack a dull boy',
            PartitionKey: `${i}`
        });
    }

    return records;
};

const makeBatch = (size, stream) => { 

    let params = {
        Records: makeBatchData(size),
        StreamName: stream
    };

    kinesis.putRecords(params, (err, data) => {
        if(err) console.log(err)
        else console.log('Records sent');
    });
}

const batchParse = (val) => {
    return parseInt(val);
}

let program = require('commander');

program
    .option('-s, --stream <stream>', 'Stream name')
    .option('-b, --batch <batch>', 'Batch size', batchParse, 50)
    .parse(process.argv);

if(program.stream === '' || program.stream == undefined) {
    console.log('Must specify stream name via -s or --stream option');
    process.exit(1);
}

console.log(`Create batch of size ${program.batch} in stream ${program.stream}`);
makeBatch(program.batch, program.stream);
