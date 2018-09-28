var EMR = artifacts.require("./EMR.sol");

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

contract('Initialize EMR Smart-Contract.', function (accounts) {

    const owner = accounts[0];
    const admin1 = accounts[1];
    const admin2 = accounts[2];
    const patient1 = accounts[3];
    const patient2 = accounts[4];
    const patient3 = accounts[5];
    const patient4 = accounts[6];

    it("Initialized the EMR project.", function () {
        return EMR.deployed().then(function (instance) {
            EMRInstance = instance;
            return EMRInstance.version();
        }).then((version) => {
            assert.equal(version, "0.0.1", 'Correct version.');
        })
    })

    it("Kill the app.", function () {
        return EMR.deployed().then(function (instance) {
            EMRInstance = instance;
            return EMRInstance.kill({ from: admin1 });
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            //return EMRInstance.kill({from: accounts[0]});
        })
    })


    it("Add administrator.", function () {
        return EMR.deployed().then(function (instance) {
            EMRInstance = instance;
            return EMRInstance.SetAdministrator(admin2, { from: admin1 });
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            return EMRInstance.SetAdministrator(admin1, { from: owner });
        }).then((receipt) => {
            //console.log(receipt)
            return EMRInstance.administrator(admin1);
        }).then((result) => {
            assert.equal(result, true, 'Account Hash is correct');
            return EMRInstance.SetAdministrator(admin2, { from: owner });
        }).then((receipt) => {
            //console.log(receipt)
            return EMRInstance.administrator(admin2);
        }).then((result) => {
            assert.equal(result, true, 'Account Hash is correct');
        })
    })

    it("Sign Up Patient.", function () {
        const _fullname = "Papan Das";
        const _dob = "14th Nov 1987";
        const _sex = 0;
        const _marital = 1;
        const _postal_address = "Champashri Anchal";
        const _city = "Siliguri";
        const _postal_code = "734003";
        const _contact_phone = "9641443962";
        const _email = "hum.tum.8765@gmail.com";
        const _occupation = "Blockchain Developer";
        const _employer_name = "Freelancer";
        const _employer_address = "Online Plateform.";
        const _employer_city = "Free Country";
        const _employer_state = "West Bengal";
        const _employer_postal_code = "734003";
        const _employer_country = "INDIA";
        const _language = "English";
        const _ethnicity = "Asian";
        const _race = "COol";
        const _provider = "LIC";
        const _plan_name = "Jeven Anand";
        const _policy_number = "0766636636";
        const ReportDocsArray = [0]

        return EMR.deployed().then(function (instance) {
            EMRInstance = instance;

            /*return EMRInstance.SignupPatient(_fullname, _dob, _sex,
                _marital, _postal_address, _city, _postal_code,
                _contact_phone, _email, _occupation, _language,
                _ethnicity, _race, ReportDocsArray, { from: patient1 });*/
            return EMRInstance.SignupPatient(_fullname, _dob, _sex,
                _marital, _email, ReportDocsArray, { from: patient1 });

        }).then((receipt) => {

            //console.log(receipt.receipt.transactionHash)

            return EMRInstance.SignupPatient(_fullname, _dob, _sex,
                _marital, _email, ReportDocsArray, { from: patient1 });


        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            return EMRInstance.patients(patient1);
        }).then((results) => {

            assert.equal(results[0], patient1, 'Account Hash is correct');

            return EMRInstance.SavePatientDetails(_postal_address, _city,
                parseInt(_postal_code), parseInt(_contact_phone), _occupation,
                _language, _ethnicity, _race, { from: patient1 });

        }).then((receipt)=>{

            return EMRInstance.PatientDetailUpdate(_postal_address, _city,
                parseInt(_postal_code + "1"), parseInt(_contact_phone),
                _occupation, _language, _ethnicity, _race);
        
        }).then((receipt)=>{

            return EMRInstance.patientdetails(patient1);
        }).then((results) => {
            //console.log(results);
            assert.equal(results[2].toNumber(), parseInt(_postal_code + "1"), 'Contact Phone is correct');

            const increment = 1;

            /*return EMRInstance.PatientUpdate(_fullname + increment, _dob, _sex + increment,
                _marital + increment, _postal_address + increment, _city + increment, _postal_code + increment,
                _contact_phone + increment, _email, _occupation, _language,
                _ethnicity, _race, { from: patient1 });*/

            return EMRInstance.PatientUpdate(_fullname + increment, _dob, _sex + increment,
                _marital + increment, _email, { from: patient1 });

        }).then((results) => {
            return EMRInstance.patients(patient1);
        }).then((results) => {
            //console.log(results);
            const increment = 1;
            assert.equal(results[0], patient1, 'Full name is correct');

            return EMRInstance.PatientUpdate(_fullname + increment, _dob, _sex + increment,
                _marital + increment, _email, { from: patient2 });


        }).then(assert.fail).catch(function (error) {
                assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
                return EMRInstance.SignupPatient(_fullname + "p2", _dob, _sex,
                    _marital, _email, ReportDocsArray, { from: patient2 });


        }).then((receipt) => {
                return EMRInstance.patients(patient2);
        }).then((results) => {
                assert.equal(results[0], patient2, 'Account Hash is correct');
                return EMRInstance.SignupPatient(_fullname + "p3", _dob, _sex,
                    _marital, _email, ReportDocsArray, { from: patient3 });


            }).then((receipt) => {
                return EMRInstance.patients(patient3);
            }).then((results) => {
                assert.equal(results[0], patient3, 'Account Hash is correct');
            })
    })


    it("Add Appointment.", function () {
        var random = Math.floor(Math.random() * (10 - 1)) + 10;
        const _datetime = new Date("2018-09-25").getTime();// + random; 
        const AppointmentStat = 0;
        const _remark = "";

        //console.log(_datetime, new Date(_datetime) );

        let AppointmentIndex;

        return EMR.deployed().then(function (instance) {
            EMRInstance = instance;
            return EMRInstance.AppointmentAdd(_datetime, AppointmentStat, _remark, { from: patient1 });
        }).then((reply) => {

            return EMRInstance.AppointmentAdd(_datetime, AppointmentStat, _remark, { from: patient4 });
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            return EMRInstance.AppointmentAdd(new Date("2018-09-20").getTime(), AppointmentStat, _remark, { from: patient1 });
        }).then((receipt) => {
            //console.log(receipt);
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'eAppointmentAdd', 'should be the "eAppointmentUpdate" event');
            //assert.equal(receipt.logs[0].args.index, AppointmentIndex, 'correct index');
            //console.log("Appointment Index", receipt.logs[0].args.index)
            assert.equal(receipt.logs[0].args.sender, patient1, 'correct sender');
            return EMRInstance.AppointmentIndex()
        }).then((results) => {
            //console.log(results);
            AppointmentIndex = results.toNumber();
            return EMRInstance.appointments(AppointmentIndex);
        }).then((results) => {
            //console.log(results);
            return EMRInstance.AppointmentUpdate(AppointmentIndex, 1, { from: admin1 });
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'eAppointmentUpdate', 'should be the "eAppointmentUpdate" event');
            assert.equal(receipt.logs[0].args.index, AppointmentIndex, 'correct index');
            assert.equal(receipt.logs[0].args.sender, admin1, 'correct sender');

        })
    })

    it("Add medical report", function () {
        const docname = "docname";
        const docpath = "docpath";
        const docdesc = "docdesc";

        return EMR.deployed().then(function (instance) {
            EMRInstance = instance;
            return EMRInstance.MedicalReportAdd(docname + "1", docpath + "1", docdesc + "1", { from: patient1 });
        }).then((reply) => {
            //console.log(reply);
            return EMRInstance.MedicalReportAdd(docname + "2", docpath + "2", docdesc + "2", { from: patient1 });
        }).then((reply) => {
            //console.log(reply);
            return EMRInstance.medicalreports(1);
        }).then((reply) => {
            console.log(reply);
            return EMRInstance.MedicalReportGet(patient1);
        }).then((reply) => {
            console.log(reply.length);
        })
    })

})