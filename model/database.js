const { Client } = require('pg');

const client = new Client(
    {
        user: 'postgres',
        host: 'localhost',
        database: 'testDB',
        password: 'admin',
        port: '5432',
    });



function Submission(ATM_Online, GPS_Coordinates) {
    this.ATM_Online = ATM_Online;
    this.GPS_Coordinates = '(' + GPS_Coordinates[0] +' , '+ GPS_Coordinates[1]+ ')';
    
    
    function getTimezone () {
        const date = new Date();
        let offset = -date.getTimezoneOffset() / 60;
        const sign = (offset >= 0) ? '+' : '-';
        offset = Math.abs(offset);
        offset = (offset < 10) ? ('0' + offset) : offset;
        let TIMESTAMPTZ = date.toISOString();
        TIMESTAMPTZ = TIMESTAMPTZ.replace('T', ' ');
        TIMESTAMPTZ = TIMESTAMPTZ.replace('Z', `000${sign}${offset}`);
        return TIMESTAMPTZ;
    };

    this.Timestamp = getTimezone();

}
const testSubmission = new Submission(true, [18.020340513302376, -76.7672947774441])

client.connect().then(
    () => {
        console.log('Connected to PostgreSQL database!');
    }).catch(
        (err) => { console.error('Error connecting to the database:', err); });

client.on("end", () => { console.log("Disconnected from the database"); })



async function getAllATM() {
    // await client.connect();
    const result = await client.query('Select * from "ATM data"');
    console.log(result.rows);
}

async function insertATMstatus(isOnline, coordinates, timestamp) {
    const result = await client.query('Insert into "ATM data"(submission_id,"ATM_Online","GPS Coordinates","Timestamp") values(gen_random_uuid(),$1,$2,$3) RETURNING *', [testSubmission.ATM_Online,testSubmission.GPS_Coordinates,testSubmission.Timestamp]);
    console.log(result.rows);
}




// client.query('Select * from "ATM data"', (err, result) => {
//     if (!err) {
//         console.log(result.rows);
//     }
//     // client.end();
// })

getAllATM();
insertATMstatus();
getAllATM();
