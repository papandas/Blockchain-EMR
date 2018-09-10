App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  isAdmin: false,
  isPatient: false,
  CONST_SEX: new Array('Male', 'Female'),
  CONST_MARITAL: new Array('Single', 'Married', 'Remarried', 'Separated', 'Divorced', 'Widowed'),
  CONST_APPOINTMENT: new Array('CREATED', 'APPROVED', 'REJECTED', 'PENDING', 'DONE'),

  init: function () {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function () {
    $.getJSON("EMR.json", function (emr) {
      App.contracts.EMR = TruffleContract(emr);
      App.contracts.EMR.setProvider(App.web3Provider);
      App.contracts.EMR.deployed().then(function (emr) {
        console.log("Contract Address:", 'https://rinkeby.etherscan.io/address/' + emr.address);
      });

      return App.render();
    })
  },

  render: function () {
    if (App.loading) {
      return;
    }
    App.loading = true;

    App.loaderShow(true);

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        console.log("Account Address:", 'https://rinkeby.etherscan.io/address/' + account);
      }
    });

    App.LoadDefaultPage();
  },

  LoadDefaultPage: function () {

    App.contracts.EMR.deployed().then(function (instance) {
      EMRInstance = instance;
      return EMRInstance.administrator(App.account);
    }).then((isAdmin) => {
      console.log("Is admin", isAdmin);
      App.loaderShow(false);

      if (isAdmin) {
        // Load Admin Page;
        App.isAdmin = true;

      } else {
        return EMRInstance.patients(App.account).then((patient) => {
          //console.log("Is patients", patient);
          if (patient[0] == App.account) {
            // Load Patiend Detail Page
            App.isPatient = true;

            $('#content').load('ProfileView.html', function () {
              $('#sliderbarContainer').load('SliderbarContainer.html');

              $('#account').html('Account Hash: <a href="#">' + App.account + '</a>');
              $('#fullname').html('Name: ' + patient[1]);
              $('#dob').html('DOB: ' + patient[2]);
              $('#sex').html('Sex: ' + App.CONST_SEX[patient[3].toNumber()]);
              $('#marital').html('Marital Status: ' + App.CONST_MARITAL[patient[4].toNumber()]);
              $('#email').html('Email: ' + patient[5]);

              //patientdetails
              return EMRInstance.patientdetails(App.account).then((patient) => {
                $('#postal_address').html('Address: ' + patient[0]);
                $('#city').html('City: ' + patient[1]);
                $('#postal_code').html('Postal Code: ' + patient[2]);
                $('#contact_phone').html('Contact Phone: ' + patient[3]);

                $('#occupation').html('Occupation: ' + patient[4]);

                $('#language').html('Language: ' + patient[5]);
                $('#ethnicity').html('Ethnicity: ' + patient[6]);
                $('#race').html('Race: ' + patient[7]);
              })
            })

          } else {
            // Load Signin page
            App.LoadSignupPage();

          }
        })
      }
    })
  },

  PopulateUserData: function () {

    App.contracts.EMR.deployed().then(function (instance) {
      EMRInstance = instance;
      return EMRInstance.patients(App.account);
    }).then((patient) => {

      $('#fullname').val(patient[1]);
      $('#dob').val(patient[2]);
      $('#sex').val(App.CONST_SEX[patient[3].toNumber()]);
      $('#marital').val(App.CONST_MARITAL[patient[4].toNumber()]);
      $('#email').val(patient[5]);

      //patientdetails
      return EMRInstance.patientdetails(App.account);

    }).then((patient) => {

      $('#postal_address').val(patient[0]);
      $('#city').val(patient[1]);
      $('#postal_code').val(patient[2]);
      $('#contact_phone').val(patient[3]);

      $('#occupation').val(patient[4]);

      $('#language').val(patient[5]);
      $('#ethnicity').val(patient[6]);
      $('#race').val(patient[7]);
    })
  },

  LoadSignupPage: function () {
    //$(this).parent().addClass('active');
    //console.log($(this).parent());

    $('#content').load('ProfileEdit.html', function () {
      $('#sliderbarContainer').load('SliderbarContainer.html');

      App.PopulateUserData();

      if (App.isPatient == true) {
        $('#ButtonContainer').html('<button onclick="App.PatientUpdate()" class="btn btn-primary pull-right">Update Profile</button>');
        $('#PageTitle').html('Update Profile');

      } else {
        $('#ButtonContainer').html('<button onclick="App.SignupPatient()" class="btn btn-primary pull-right">Save New Profile</button>');
        $('#PageTitle').html('Edit Profile');
      }
    })
  },

  PatientUpdate: function () {

    const _fullname = $('#fullname').val();
    const _dob = $('#dob').val();
    const _sex = $('#sex').val();
    const _marital = $('#marital').val();
    const _postal_address = $('#postal_address').val();
    const _city = $('#city').val();
    const _postal_code = $('#postal_code').val();
    const _contact_phone = $('#contact_phone').val();
    const _email = $('#email').val();
    const _occupation = $('#occupation').val();
    const _language = $('#language').val();
    const _ethnicity = $('#ethnicity').val();
    const _race = $('#race').val();
    //console.log(">>>> Just hit me! " + $('#fullname').val());

    App.loaderShow(true);

    App.contracts.EMR.deployed().then(function (instance) {
      EMRInstance = instance;
      return EMRInstance.PatientUpdate(_fullname, _dob, parseInt(_sex),
        parseInt(_marital), _postal_address, _city, _postal_code,
        _contact_phone, _email, _occupation, _language,
        _ethnicity, _race, { from: App.account });

    }).then((recipt) => {
      console.log("Update successfully.");
      App.LoadDefaultPage();
    });


  },

  SignupPatient: function () {

    const _fullname = $('#fullname').val();
    const _dob = $('#dob').val();
    const _sex = $('#sex').val();
    const _marital = $('#marital').val();
    const _postal_address = $('#postal_address').val();
    const _city = $('#city').val();
    const _postal_code = $('#postal_code').val();
    const _contact_phone = $('#contact_phone').val();
    const _email = $('#email').val();
    const _occupation = $('#occupation').val();
    const _language = $('#language').val();
    const _ethnicity = $('#ethnicity').val();
    const _race = $('#race').val();
    const ReportDocsArray = [0]

    App.loaderShow(true);

    App.contracts.EMR.deployed().then(function (instance) {
      EMRInstance = instance;
      return EMRInstance.SignupPatient(_fullname, _dob, parseInt(_sex),
        parseInt(_marital), _postal_address, _city, _postal_code,
        _contact_phone, _email, _occupation, _language,
        _ethnicity, _race, ReportDocsArray, { from: App.account });

    }).then((recipt) => {
      console.log("Saved successfully.");
      App.LoadDefaultPage();
    });


  },

  /*** DOCUMENTS  */

  LoadDocumentsPage: function () {
    if(!App.isPatient){
      return;
    }

    App.loaderShow(false);

    $('#content').load('Documents.html', function () {
      $('#sliderbarContainer').load('SliderbarContainer.html');

      App.contracts.EMR.deployed().then(function (instance) {
        EMRInstance = instance;
        return EMRInstance.MedicalReportGet(App.account);
      }).then((reports) => {
        $('#ReportsRow').empty();
        //console.log(reports.length, reports);
        for (let each in reports) {
          (function (idx, arr) {
            //console.log(arr[idx].toNumber());
            if (arr[idx].toNumber() != 0) {
              EMRInstance.medicalreports(arr[idx].toNumber()).then((report) => {
                let str = '<div class="col-md-4">';
                str += '<div class="col">';
                str += '<img src="' + report[1] + '" alt="" width="150" height="200">';
                str += '<dd>' + report[0] + '</dd>';
                str += '</div></div>';
                $('#ReportsRow').append(str);
              });
            }
          })(each, reports)
        }
      })

    })
  },

  MedicalReportAdd: function () {

    const docname = $('#docname').val();
    const docpath = $('#docpath').val();
    const docdesc = $('#docdesc').val();

    App.loaderShow(true);

    App.contracts.EMR.deployed().then(function (instance) {
      EMRInstance = instance;
      return EMRInstance.MedicalReportAdd(docname, docpath, docdesc, { from: App.account });
    }).then((reply) => {
      console.log("Docuemnt Uploaded Successfully.");
      App.LoadDocumentsPage();
    })
  },

  /*** APPOINTMENT  */

  LoadAppointmentPage: function () {
    if(!App.isPatient){
      return;
    }

    let AppCount = 0;

    $('#content').load('Appointment.html', function () {
      $('#sliderbarContainer').load('SliderbarContainer.html');
      
      $('#AppointmentCardContainer').empty();
      App.contracts.EMR.deployed().then(function (instance) {
        EMRInstance = instance;
        return EMRInstance.AppointmentIndex();
      }).then((reply) => {
        AppCount = reply.toNumber();

        //console.log("==> " + AppCount);

        
        let i = 1;

        while (i <= AppCount) {
          //console.log("Loop Run 1");
          EMRInstance.appointments(i)
          .then((appointment)=>{

            if(appointment[1] == App.account){
              var date = new Date(appointment[2].toNumber());
              let str = '<div class="row">';
              str += '<div class="col-md-12">';
              str += '<div class="col">';
              str += date.toLocaleString();
              str += '<br />' + appointment[4];
              str += '<br />Status: ' + App.CONST_APPOINTMENT[appointment[3].toNumber()];
              str += '</div>';
              str += '<hr />';
              str += '</div>';
              str += '</div>';
              $('#AppointmentCardContainer').append(str);
            }
            
          })
          

          i++;
        }
        App.loaderShow(false);
      })
    })
  },

  AppointmentAdd: function () {
    //const _datetime = $('#datetime').val();
   
    var day = $('#selDay').find(':selected').val();
    var month = $('#selMonth').find(':selected').val();
    var year = $('#selYear').find(':selected').val();
    var hours = $('#selHours').find(':selected').val();
    var min = $('#selMinute').find(':selected').val();
    var date = new Date( month + "/" + day + "/" + year + " " + hours + ":" + min + ":00");
    var milliseconds = date.getTime(); 
    const AppointmentStat = 0;
    const _remark = $('#remark').val();

    console.log(milliseconds);

    /*return;*/

    App.loaderShow(true);

    App.contracts.EMR.deployed().then(function (instance) {
      EMRInstance = instance;
      return EMRInstance.AppointmentAdd(milliseconds, AppointmentStat, _remark, { from: App.account });
    }).then((reply) => {
      console.log(reply);
      console.log("Appointment Saved Successfully.");
      App.LoadAppointmentPage();
    })
  },

  /** MISLENOUS FUNCTINOS */

  loaderShow: function (bool) {

    var loader = $('#loader');
    var content = $('#content');
    if (bool) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
}

$(function () {
  $(window).load(function () {
    App.init();
  })
});
