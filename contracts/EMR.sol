pragma solidity ^0.4.23;

contract EMR {

  enum SexType { MALE, FEMALE }
  enum MaritalType { single, married, remarried, separated, divorced, widowed }
  enum AppointmentStat { CREATED, APPROVED, REJECTED, BILLING, CLOSE }

  struct Patient {
    address client;
    string fullname;
    string dob;
    SexType sex;
    MaritalType marital;
    string email;
    uint256[] medicalreport;
  }

  struct PatientDetail {
    string postal_address;
    string city;
    uint256 postal_code;
    uint256 contact_phone;
    string occupation;
    string language;
    string ethnicity;
    string race;
  }

  struct PatientInsurance {
    string provider;
    string plan_name;
    string policy_number;
  }

  struct PatientEmployer {
    string employer_name;
    string employer_address;
    string employer_city;
    string employer_state;
    string employer_postal_code;
    string employer_country;
  }

  struct Appointment{
    uint256 index;
    address patient;
    uint256 datetime;
    AppointmentStat stat;
    string remark;
  }

  struct MedicalReport{
    string docname;
    string docpath;
    string docdesp;
    bool isActive;
  }
  
  mapping(address => Patient) public patients;
  mapping(address => PatientDetail) public patientdetails;
  mapping(address => PatientEmployer) public patientemployers;
  mapping(address => PatientInsurance) public patientinsurances;

  mapping(uint256 => Appointment) public appointments;
  mapping(address => bool) public administrator;

  mapping(uint256 => MedicalReport) public medicalreports;

  uint256 public AppointmentIndex;
  uint256 public MedicalReportIndex;

  address public owner;
  
  
  string public version = "0.0.1";

  event eAppointmentAdd(uint256 indexed index, address sender);

  event eAppointmentUpdate(uint256 indexed index, address sender);


  modifier isOwner() {
    if (msg.sender == owner) _;
  }

  modifier isAdministrator(address _admin) {
    if (administrator[_admin] == true) _;
  }

  constructor() public {
    owner = msg.sender;
    administrator[msg.sender] = true;
  }

  function UpdateVersion (string _version) public {
    version = _version;
  }

  function SetAdministrator (address _admin) public {
    require(msg.sender == owner);
    require(!administrator[_admin]);

    administrator[_admin] = true;
  }

  /*
  * Sign Up Patients
  */

  function SignupPatient(string _fullname,
      string _dob,
      SexType _sex,
      MaritalType _marital,
      string _email,
      uint256[] _medicalreport) public {

    require(msg.sender != patients[msg.sender].client);

    patients[msg.sender] = Patient(msg.sender, 
      _fullname, 
      _dob, 
      _sex, 
      _marital, 
      _email, 
      _medicalreport);

  }

  function SavePatientDetails(string _postal_address,
      string _city,
      uint256 _postal_code,
      uint256 _contact_phone,
      string _occupation,
      string _language,
      string _ethnicity,
      string _race) public {  

    require(msg.sender == patients[msg.sender].client);

    patientdetails[msg.sender] = PatientDetail(_postal_address,
      _city,
      _postal_code,
      _contact_phone,
      _occupation,
      _language,
      _ethnicity,
      _race);

  }


  function PatientUpdate(string _fullname,
      string _dob,
      SexType _sex,
      MaritalType _marital,
      string _email) public {

    require(msg.sender == patients[msg.sender].client);

    patients[msg.sender].fullname = _fullname;
    patients[msg.sender].dob = _dob;
    patients[msg.sender].sex = _sex;
    patients[msg.sender].marital = _marital;
    patients[msg.sender].email = _email;

  }

  function PatientDetailUpdate(string _postal_address,
      string _city,
      uint256 _postal_code,
      uint256 _contact_phone,
      string _occupation,
      string _language,
      string _ethnicity,
      string _race) public {

    require(msg.sender == patients[msg.sender].client);

    patientdetails[msg.sender].postal_address = _postal_address;
    patientdetails[msg.sender].city = _city;
    patientdetails[msg.sender].postal_code = _postal_code;
    patientdetails[msg.sender].contact_phone = _contact_phone;
    patientdetails[msg.sender].occupation = _occupation;
    patientdetails[msg.sender].language = _language;
    patientdetails[msg.sender].ethnicity = _ethnicity;
    patientdetails[msg.sender].race = _race;

  }

  
  function AppointmentAdd(uint256 _datetime, 
    AppointmentStat _stat, string _remark) public {
    
    require(msg.sender == patients[msg.sender].client);
    require(_datetime > now);
    
    AppointmentIndex++;

    appointments[AppointmentIndex] = Appointment(AppointmentIndex,
      msg.sender,
      _datetime,
      _stat,
      _remark);

    emit eAppointmentAdd(AppointmentIndex, msg.sender);

  }

  function AppointmentUpdate(uint256 _AppointmentIndex, 
    AppointmentStat _stat) public {

    require(administrator[msg.sender] == true || msg.sender == patients[msg.sender].client);
    require(_AppointmentIndex > 0);
    require(_AppointmentIndex <= AppointmentIndex);

    appointments[_AppointmentIndex].stat = _stat;
    //appointments[_AppointmentIndex].remark = _remark;

    emit eAppointmentUpdate(_AppointmentIndex, msg.sender);

  }

  function AppointmentGet() public view returns (uint256[]){
    uint256[] memory results;
    uint256 count;
    for (uint256 i = 1; i <= AppointmentIndex; i++) {
        if(appointments[i].patient == msg.sender)
        {
          //results.push(appointments[i].index);
          results[count] = i;
          count++;
        }
    }
    return results;
  }


  function MedicalReportAdd(string _docname,
    string _docpath,
    string _docdesp) public {

      require(msg.sender == patients[msg.sender].client, "Sender has to be a patient");

      MedicalReportIndex++;
      medicalreports[MedicalReportIndex] = MedicalReport(_docname, 
        _docpath, 
        _docdesp, 
        true);

      patients[msg.sender].medicalreport.push(MedicalReportIndex);

  }

  function MedicalReportGet(address _addr) public view returns(uint256[]){
    return patients[_addr].medicalreport;
  }

  /*function MedicalReportUpdate(uint256 _index, string _docname,
    string _docpath,
    string _docdesp, bool _isActive) public {

      require(msg.sender == patients[msg.sender].client, "Is a client");
      require(_index > 0, "Valid index number passed");
      //require(_index == medicalreports[msg.sender].index, "Correct Index number passed.");

      //medicalreports[patient].docname = _docname;
      //medicalreports[patient].docpath =  _docpath;
      //medicalreports[patient].docdesp =  _docdesp;
      //medicalreports[patient].isActive = _isActive;

  }*/

  function kill() public {
    require(msg.sender == owner);
    selfdestruct(msg.sender);
  }




}
