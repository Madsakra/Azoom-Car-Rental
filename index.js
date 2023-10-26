// OBJECTS TO BE STORED ON LOCAL STORAGE
const userAccount = 
{
  userName:"1234@gmail.com",
  password:"1234",
};
const adminAccount = {
  userName:"7169@gmail.com",
  password:"7169",
}
let userDetails =
{
  membershipStatus:"Basic",
  outstandingBill:0,
  membershipfee:8,
  damages:0,
  gst:0,
  totalOutstanding:0,
  vehicleReserved:"",
  dateOfReservation:"",
};
let tripRecords = [];
let counter = 1;
let billingAddress = {
  firstName: "",
  lastName:"",
  email:"",
  address:"",
  country:"",
  state:"",
  zip:"",
}

let creditInfo = {
  nameOnCard:"",
  creditCardNo:"",
  expiration:"",
  cv:"",
}
const carList = [
  car1 = {carPlateNo:"SP1228",location:"Bukit Timah Mall",reserved:"no"},
  car2 = {carPlateNo:"SP2933",location:"King Albert Park",reserved:"no"}, 
  car3 = {carPlateNo:"SP8128",location:"SIM Institute",reserved:"yes"},
]

let savedCar;


// GLOBAL VARIABLE USED FOR COMPUTING BILL AMOUNT
let flatRate;
let membershipfee;
let gst;
let total;
let damages;



// FETCH USER RECORDS
let userObject = JSON.parse(localStorage.getItem("user"));

//FETCH DRIVER SAVED INFO
let savedDriverInfo  = JSON.parse(localStorage.getItem("savedDriverInfo"));

// FETCH VEHICLE LIST
let carListArray = JSON.parse(localStorage.getItem("carList"));

//SAVED VEHICLE
let saved = JSON.parse(localStorage.getItem("saved"));

//FETCH TRIP RECORDS
let recordFromStorage = JSON.parse(localStorage.getItem("tripRecords"));

// CHANGE TO 2DP FOR FLOAT
function format2Decimals(num) {
  return Math.round(num * 100) / 100;
}


// login page
$(".access-world").click(function(event)
{
  let email = $("#inputEmail").val();
  let password = $("#inputPassword").val();
 
  if (email !="" && password !="")
  {
    if (email == userAccount.userName && password== userAccount.password)
    {
      window.location = "userPage.html";
      goOnline();
      return false;
    }

    else if (email == adminAccount.userName && password== adminAccount.password)
    {
      window.location = "adminPage.html";
      return false;
    }


  else
  {
    $(".warning").css(
    {
      'color': 'red'
    }) 
  
    $(".warning").text("Wrong Credentials, please try again");
    event.preventDefault();
  }
  }
})

function goOnline()
{
  if (localStorage.getItem("user")==null)
  {
    localStorage.setItem("user",JSON.stringify(userDetails));
    localStorage.setItem("carList",JSON.stringify(carList));
    localStorage.setItem("tripRecords",JSON.stringify(tripRecords));
    localStorage.setItem("saved",JSON.stringify(savedCar));
  }
}

//ONLOAD FOR MEMBERSHIP PAGE
function chosenMembership()
{ 

  let txt1 = "<h1>Your current plan:</h1>"

  if (userObject.membershipStatus == "Basic")
  {
    $('#bmes > *').addClass("bill").removeClass("basic");
    $('.bs-h> *').addClass("bill").removeClass("basic");
    $('.currentPlan-basic').prepend(txt1);
    $('.bs-b> *').addClass("bill").removeClass("basic");
    $('.bsdivider >*').addClass("bill").removeClass("basic");

    // IF USER ALREADY SELECTED BASIC, BUTTON WILL NOT BE USABLE
    $(".buttonBasic").removeClass("border-success").addClass("disabled");
  }

  else{
   
    $('#pmes > *').addClass("bill").removeClass("premium");
    $('.pm-h-h> *').addClass("bill").removeClass("premium");
    $('.currentPlan-premium').prepend(txt1);
    $('.pm-h> *').addClass("bill").removeClass("premium");
    $('.pmdivider >*').addClass("bill").removeClass("premium");

    // IF USER ALREADY SELECTED PREMIUM, BUTTON WILL NOT BE USABLE 
    $(".buttonPremium").removeClass("border-success").addClass("disabled");
  }
}

function changeToBasic()
{
  //READ OBJ
  userObject.membershipStatus = "Basic";
  userObject.membershipFee=8;
  //WRITE OBJ
  let newObj = JSON.stringify(userObject)
  localStorage.setItem("user",newObj);
  location.reload();
}

function changeToPremium()
{
  //READ OBJ
  userObject.membershipStatus = "Premium";
  userObject.membershipFee=18;
  //WRITE OBJ
  let newObj = JSON.stringify(userObject)
  localStorage.setItem("user",newObj);
  location.reload();
}


//LOAD THE DASHBOARD
function loadDashboard()
{
  // LOAD USER MEMBERSHIP PLAN AND OUTSTANDING BILL
  let outstandingBill = userObject.totalOutstanding;
  $(".membership-plan-show").text(userObject.membershipStatus);
  $(".billAmount").prepend("<p>$" + outstandingBill +"</p>");
  if (outstandingBill == 0)
  {
    $("#bill-button").click(function(){
      alert("You do not have any outstanding bill currently");
      return false;
    });
  }
 
  
  //IF DRIVER ALREADY HAS CAR, DISABLE THE RESERVE TAB
  if (userObject.vehicleReserved !="")
  {
    $(".reserve-tab").click(function()
    {
      alert("You already have a reservation currently");
      return false;
    })
  }

  //IF DRIVER HAS NO CAR, DISABLE THE RETURN TAB
  //NO VEHICLE TO RETURN
  if (userObject.vehicleReserved.length==0)
  {
    $(".return-tab").click(function()
    {
      alert("You do not have a car to return!");
      return false;
    })
  }

  // LOAD DRIVER SAVED INFO
  if (localStorage.getItem("savedDriverInfo") != null)
  {
    $(".licence-num-show").text(savedDriverInfo.licenceNum);
    $(".insurance-num-show").text(savedDriverInfo.insuranceNum);
  }


  if (userObject.vehicleReserved.length !=0)
  {
  // LOAD VEHICLE DETAILS IF HAVE
  $(".show-vehicle-booked").text(userObject.vehicleReserved);
  let savedDateTime = localStorage.getItem("savedTime");
  $(".start-clock").text(savedDateTime);
  
  let splitDateTime = savedDateTime.split("----");
  let time = splitDateTime[1].split(":");
  let hour = JSON.parse(time[0]);
  let minute = JSON.parse(time[1]);
  



  
  let date = new Date();
  // TIME CALCULATED BASED ON HOUR+MINUTE, IGNORE SECONDS
  let hourDiff;
  let realHour = date.getHours();
  if (realHour>=12)
  {
    realHour-=12;
  }

  let minDiff = (realHour*60 +date.getMinutes())-(hour*60 + minute);


  if (minDiff >60)
  {
    hourDiff =1;
    minDiff-=60;
  }
  $(".hours-clocked").text(hourDiff);
  $(".min-clocked").text(minDiff);
  }
}

//ON LOAD FOR CHECKOUT
function loadBill()
{
  $(".bill-amount").text("$" + userObject.outstandingBill.toFixed(2));
  $(".mbs-amount").text("$" +userObject.membershipfee)
  $(".damages-amount").text("$"+userObject.damages)
  $(".gst").text("$" + userObject.gst);
  $(".total-outstanding").text("$"+ userObject.totalOutstanding.toFixed(2));

  // IF USER SAVED DATA PREVIOUSLY 
  if (localStorage.getItem("save-billing") == "yes")
  {
 
    //load billing information
    let addressObj = JSON.parse(localStorage.getItem("billingAddress"));
    $(".fN").val(addressObj.firstName);
    $(".lN").val(addressObj.lastName);
    $(".eM").val(addressObj.email);
    $(".aD").val(addressObj.address);
    $(".cT").val(addressObj.country);
    $(".sT").val(addressObj.state);
    $(".zC").val(addressObj.zip);

    // load credit card information
    let creditInfo = JSON.parse(localStorage.getItem("creditInfo"));
    $("#cc-name").val(creditInfo.nameOnCard);
    $("#cc-number").val(creditInfo.creditCardNo);
    $("#cc-expiration").val(creditInfo.expiration);
    $("#cc-cvv").val(creditInfo.cv);
  }
}

// FORM VALIDATION--FOR ALL FORMS
const forms = document.querySelectorAll(".needs-validation");
Array.prototype.slice.call(forms).forEach(function(form){
  form.addEventListener("submit",function(event)
  {
    if (!form.checkValidity())
    {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add("was-validated");
  },false);  
}
);


$(".checkOut").click(function(event)
{
    //REMOVE ANY OLD BILING ADDRESS/CREDIT
    localStorage.removeItem("billingAddress");
    localStorage.removeItem("creditInfo");
    

    //USE OBJECT TO CHECK IF INFORMATION SUFFICIENT TO CONFIRM PAYMENT
    billingAddress.firstName = $(".fN").val();
    billingAddress.lastName = $(".lN").val();
    billingAddress.email = $(".eM").val();
    billingAddress.address = $(".aD").val();
    billingAddress.country = $(".cT").val();
    billingAddress.state = $("#state").val();
    billingAddress.zip = $("#zip").val();
  
    creditInfo.nameOnCard = $("#cc-name").val();
    creditInfo.creditCardNo = $("#cc-number").val();
    creditInfo.expiration = $("#cc-expiration").val();
    creditInfo.cv = $("#cc-cvv").val();

    //SAVES INFORMATION TO LOCAL STORAGE ONLY IF CHECKED
    if ($("#save-billing-address").is(':checked'))
    {
      localStorage.setItem("save-billing","yes");
      let newObj = JSON.stringify(billingAddress)
      localStorage.setItem("billingAddress",newObj);
  
      let credObj = JSON.stringify(creditInfo);
      localStorage.setItem("creditInfo",credObj);
    }
  
    else{
      localStorage.setItem("save-billing","no");
    }

  let exist = Object.values(billingAddress).includes("");
  let exist2 = Object.values(creditInfo).includes("");
  //CHECK IF FIELDS ARE FULLY FILLED OUT
  if (!exist && !exist2)
  {
    window.location = "confirmPayment.html";
    return false;
  }
})

//CONFIRM PAYMENT
function confirmPaymentInfo()
{
  $(".flatRentalFee").text("$" + userObject.outstandingBill);
  $(".membership-amount").text("$" + userObject.membershipfee);
  $(".damages-amount").text("$" + userObject.damages);
  $(".tax-amount").text("$" + userObject.gst);
  $(".total-confirm").text("$" + userObject.totalOutstanding);
}

//AFTER CONFIRM PAYMENT BUTTON IS CLICKED
$(".final-check").click(function()
{
  userObject.outstandingBill = 0;
  userObject.gst = 0;
  userObject.totalOutstanding = 0;
  userObject.damages = 0;
  localStorage.setItem("user",JSON.stringify(userObject));
  window.location = "thankYou.html";
})

// LOAD VEHICLE WHEN RESERVE TAB IS CLICKED
function loadVehicle()
{
  for (let i=0;i<carListArray.length;i++)
  {
    let concat = i+1;
    let chosenCar = carListArray[i];
    let carPlateClass = ".car"+concat+"-plate-num";
    let carLocationClass = ".car"+concat+"-location";

    //USED FOR DISABLING THE BUTTON BELOW
    let buttonClass = ".button"+concat;

    $(carPlateClass).text(chosenCar.carPlateNo);
    $(carLocationClass).text(chosenCar.location);

    // CAR NOT AVAILABLE WILL TURN RED
    if (chosenCar.reserved =="yes")
    {
      $(carPlateClass).addClass("text-danger").removeClass("text-success");
      $(carLocationClass).addClass("text-danger");
      $(buttonClass).attr("disabled",true);
      $(buttonClass).removeAttr('href');
      $(buttonClass).addClass("btn-outline-danger").removeClass("btn-outline-success");
    }    
  }
}

function sendData(obj)
{
  let name = obj.className;
  const myArray = name.split(" ");
  let fullWord = myArray[2];
  let selectedCarNumIndex = fullWord.split("button")[1]-1;
  localStorage.setItem("saved",JSON.stringify(selectedCarNumIndex));
}

// REFLECT REAL TIME
function refreshTime(){
  const dateObj = new Date();
  const localDate = dateObj.toLocaleDateString('en-GB');
  const localtime = dateObj.toLocaleTimeString();
  $("#datetime-display").val(localDate + " ---- " + localtime);
}

function loadSelected()
{
  // EVERY 1 SECOND TIME WILL CHANGE 
  // RECORD TIME 
  refreshTime();
  // IF LOCAL STORAGE HAS DRIVER'S DETAILS, WILL AUTOMATICALLY FETCH
  if (localStorage.getItem("savedDriverInfo") != null)
  {
    $(".licence-num").val(savedDriverInfo.licenceNum);
    $(".insurance-num").val(savedDriverInfo.insuranceNum);
  }

  let currentCar = carListArray[saved]; 
  $(".cPN").val(currentCar.carPlateNo);  
  setInterval(refreshTime,1000)
}

//WHEN DRIVER CLICKS ON RESERVE
$(".reserve-now").click(function(){
  if ($("#save-driver-info").is(':checked'))
  {
    let savedDriverInfo = {
      licenceNum: $(".licence-num").val(),
      insuranceNum: $(".insurance-num").val()
    }

    localStorage.setItem("savedDriverInfo",JSON.stringify(savedDriverInfo));
  }

  else{
    localStorage.removeItem("savedDriverInfo");
  }

  let selectedCar = $(".cPN").val()
  let currentDate = $("#datetime-display").val()


  //UPDATE VEHICLE STATUS TO RESERVE
  let currentCar = carListArray[saved]; 
  currentCar.reserved = "yes";
  localStorage.setItem("carList",JSON.stringify(carListArray));

  // UPDATE USER OBJECT
  userObject.vehicleReserved = selectedCar;
  localStorage.setItem("savedTime",currentDate);
  localStorage.setItem("user",JSON.stringify(userObject));

  //ALERT SUCCESS THEN GO BACK DASHBOARD
  alert("Booking Successful");
  window.location = "userPage.html";
})


//WHEN RETURN CAR, TO UPDATE INFORMATION
function updateUserAndCar()
{
    // UPDATE ADMIN RECORD
    let record =  {
      "recordNum": "r"+counter,
      "user":userAccount.userName,
      "vehicleReserved": userObject.vehicleReserved,
      "startDateTime":userObject.dateOfReservation,
      "returnDateTime":  $("#datetime-display").val(),
      "vehicleDamage":$("#damage-check").val()
    }

    recordFromStorage.push(record);
    localStorage.setItem("tripRecords",JSON.stringify(recordFromStorage));
    counter++;

     // UPDATE USER OBJECT
    userObject.vehicleReserved = "";
    userObject.returnDateTime = $("#datetime-display").val();
    localStorage.setItem("user",JSON.stringify(userObject));

    //UPDATE VEHICLE STATUS
    let currentCar = carListArray[saved]; 
    currentCar.reserved = "no";
    currentCar.damage = $("#damage-check").val();
    localStorage.setItem("carList",JSON.stringify(carListArray));
    alert("Return Succesful");
    window.location = "userPage.html";
}

// WHEN RETURN BUTTON IS CLICKED
$("#return-confirm").click(function()
{
  if (!($("#confirm-damage-free").is(':checked')))
  {
    // IF DAMAGE-FREE BOX IS UNCHECKED, WARNING WILL APPEAR
    let damageText = $("#damage-check").val();
    if (damageText.length==0)
    {
      $(".warning-damage").text("*You Need to give a brief description of the damage if the checkbox above is Unticked");
      return false;
    }
    else
    {
      updateUserAndCar();
    }
  }
  else
  {
      updateUserAndCar();
  }
})


// -----------------------------ADMIN PAGE SECTION-------------------------------//
// LOAD ADMIN PAGE
function loadAdmin()
{
  let monthlyReservations = recordFromStorage.length;
  $(".monthly-num").text(monthlyReservations);

  // SHOW THE LATEST 3 RECORDS, REVERSE RECORD ARRAY
  // LATEST ON TOP
  let reverseRecord = recordFromStorage.reverse();
  for (let i=0;i<recordFromStorage.length;i++)
  {
    let counter = i+1;
    let nextOnList = reverseRecord[i];

    $(".box"+counter).append("<p>"+ "Time of reservation:" +"</p>" +"<p>"+" FROM: "+nextOnList.startDateTime+ "</p>"+
                              "<p>"+"TO:"+"</p>" 
                              +nextOnList.returnDateTime +"</p>");
    $(".un"+counter).text(nextOnList.user);

    switch(counter)
    {
      case 1:
        $(".box"+counter).css("color","#FFDB01");
        break;
      case 2:
        $(".box"+counter).css("color","#FD6585");
        break;
      case 3:
        $(".box"+counter).css("color","#FFA8A8");
        break;
    }
  }
  
  //LOAD THE NUMBER OF CARS AVAILABLE CURRENTLY
  let carList = JSON.parse(localStorage.getItem("carList"))
  let countCar=0;
  carList.forEach( car=>{
    if (car.reserved == "no")
    {
      countCar+=1;
    }
    } )
    $(".car-num").text(countCar);
}

// WHEN CLICK ON ALL RECORDS, DISPLAY EVERY RECORD
function showRecords()
{
  let bar1 = $(".record-1");
  let records = JSON.parse(localStorage.getItem("tripRecords"))

  // CLONE ALL RECORDS FIRST, SERVE AS A TEMPLATE
  for (let i=0;i<records.length-1;i++)
  {
    bar1.clone().appendTo(".big-cylinder");
  }

  // LOOP THROUGH CHILDREN OF BIG CONTAINER
  // CHANGE THE VALUES OF EACH ROW INDIVIDUALLY
  let childrenList = $(".big-cylinder").children();
  for (let i=0;i<records.length;i++)
  {
    // TAKE OUT RECORD FIRST
    let next = records[i];
    // TARGET THE CHILD OF THE BIG CONTAINER, INDEX +1
    let nextChild = childrenList[i+1];
    $(nextChild).find(".userName").text(next.vehicleReserved);
    $(nextChild).find(".userName").css("color","#89de54");

    // GIVE THE CHILD A CLASS BASED ON THE INDEX
    $(nextChild).find('.check-vehicle').addClass(i+1+"");
    $(nextChild).find(".user").text(next.user);
    $(nextChild).find(".user").css("color","#89de54");
    $(nextChild).find(".time-end").text(next.returnDateTime);
    $(nextChild).find(".time-end").css("color","#CA98E9");
  }
}


//WHEN CHECK VEHICLE BUTTON/SEND BILLING BUTTON IS CLICKED
// STORE CHILD CLASS INFORMATION BEFORE REDIRECTING
function reDirect(obj)
{
  let targetClass = $(obj).attr("class").split(" ");
  let targetNum = JSON.parse(targetClass[2]);

  // STORE THE CLASS INDEX NUMBER ON LOCAL STORAGE
  // USE FOR LOADING INFO ON THE NEXT PAGE
  localStorage.setItem("globalTarget",targetNum);

  window.location = "checkVehicle.html";
}


function timeDifference(start,end)
{
  // DIFFERENCE CALCULATED BASED ON MINUTES
  let startFull = (parseInt(start[0])*60)+parseInt(start[1]);

  let endFull = (parseInt(end[0])*60)+parseInt(end[1]);

  return (endFull-startFull);
}

// CALCULATE OUTSTANDING INCURRED BASED ON FLAT RATE
function calculateOutstanding(timediff,userObj)
{
  let outstanding = 0;
  if (userObj.membershipStatus == "Basic")
  {
    outstanding = timediff*0.42;
  }

  else {
    outstanding = timediff*0.22;
  }
  return outstanding;
}

// ON CHECK-VEHICLE PAGE
// TAKE OUT INFORMATION FROM LOCAL STORAGE, USE INDEX "GLOBAL TARGET"
function loadSelectedRecord()
{
  let targetNum = JSON.parse(localStorage.getItem("globalTarget"))-1;
  let target = recordFromStorage[targetNum];

  // FETCH THE START AND END TIME
  let startTime = target.startDateTime.split("----")[1].split(":");
  let endTime = target.returnDateTime.split("----")[1].split(":");
  
  //PASS THE TWO INFO ABOVE INTO A FUNCTION TO CALCULATE
  let timeDiff = timeDifference(startTime,endTime);
  let outstandingAmount = calculateOutstanding(timeDiff,userObject);

  //OUTSTANDING AMOUNT CALCULATED BASED ON FLAT RATE
  // WILL NOT CHANGE
  userObject.outstandingBill = outstandingAmount;

  // UPDATE THE HTML PAGE INFORMATION
  $("#os-amount").val("$"+outstandingAmount.toFixed(2));
  $("#totalTime").val(timeDiff);
  $("#carNum").val(target.vehicleReserved);
  $("#userName").val(target.user);
  $("#bill-to").val(target.user);
  $("#startTime").val(target.startDateTime);
  $("#endTime").val(target.returnDateTime);
  $("#membership-amount").val(userObject.membershipfee);

  // UPDATE USEROBJECT
  // WILL UPDATE AGAIN IF ANY DAMAGES AFTER INSPECTION
  localStorage.setItem("user",JSON.stringify(userObject));
}


//CHECK IF THE CHECKBOX IS TICKED, IF TICKED NO CHECK REQUIRED
function outerValidate()
{
  let checkRequired = false;
  if (!($("#damage-free").is(':checked')))
  {
    checkRequired = true;
  }

  else{
    checkRequired = false;
  }
  return checkRequired;
}


// COMPUTE TOTAL BILL AMOUNT
// TAKE THE INFO FROM USER OBJECT 
// WILL COMPUTE WHEN BUTTON IS PRESSED
function computeBill(obj)
{
  //TAKES FLAT RATE AND MEMBERSHIP FEE FROM USER OBJ WHEN PAGE FIRST LOAD
  flatRate = obj.outstandingBill;
  membershipfee = obj.membershipfee;

  // TAKES INFO FROM PAGE WHEN SUBMIT BUTTON IS CLICKED
  if (($("#damage-amount").val() !=""))
  {
    damages = parseInt($("#damage-amount").val());
  }
  else{
    damages = 0;
  }
  gst = format2Decimals((flatRate+damages+membershipfee)*0.08);
  total = format2Decimals(flatRate+damages+membershipfee+gst);
}

function transferAmount()
{
  userObject.damages = damages;
  userObject.membershipfee = membershipfee;
  userObject.gst = gst;
  userObject.totalOutstanding = total;
  localStorage.setItem("user",JSON.stringify(userObject));
  alert("Bill sent Succesfully.");
  window.location = "adminPage.html";
}

function sendBill()
{
  //CHECK IF NO DAMAGE CHECKBOX IS TICKED
  let checkReq = outerValidate();
  let secondCheck;
  let thirdCheck;

  computeBill(userObject);

  if (checkReq == true)
  {
      if ($("#damage").val()!="" && $("#damage-amount").val()!="")
      {
        
        secondCheck = confirm("Calculated Total Amount: $"+ total.toFixed(2) +" \n(Inclusive of GST(8%)) confirm?");
        if (secondCheck==true)
        {
          //CHECK PASSWORD
          thirdCheck = prompt("Enter the admin password: ")
          if (thirdCheck == "1234")
          {
            transferAmount();
            return false;
          }
          else
          {
            alert("Wrong password");
          }
        }
      }
      // INSUFFICIENT INFO ABOUT DAMAGE
      else{
        $(".insufficient-info").text("*You Need to enter the damage amount if the vehicle is not damage-free.")
      }
  }
  else
  {
    // TICKED THE BOX
    computeBill(userObject);
    secondCheck = confirm("Calculated Total Amount: $"+total.toFixed(2)+" \n(Inclusive of GST) confirm?");
    if (secondCheck==true)
    {
      thirdCheck = prompt("Enter the admin password: ")
      if (thirdCheck == "1234")
      {
        transferAmount();
      }
      else
      {
        alert("wrong password");
      }
    }
  }
}




 

