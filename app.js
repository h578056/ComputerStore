let balance = 0;
let pay = 0;
let loan = false;
let loanRepaid = true;
let loanAmount = 0;
let curretlySelectedPc = "";
/**
 * gets all element for operations under from the html file
 */
const loanButton = document.getElementById("loan");
const balanceElement = document.getElementById("balance");
const outstandingLoanElement= document.getElementById("outstandingLoan")
const workBtn = document.getElementById("work");
const currentPay = document.getElementById("currentPay");
const bankBtn = document.getElementById("bank");
const payBackBtn = document.getElementById("payBackLoan");
const computersSelect = document.getElementById("computersDropDown");
const pcSpecsElement = document.getElementById("pcSpecs");
const infoHeaderElement = document.getElementById("pcTitle");
const infoSpanElement = document.getElementById("pcDescription");
const infoImgElement = document.getElementById("pcImg");
const infoPcPrice = document.getElementById("pcPrice");
const infoBuyPc = document.getElementById("buynow");
const apiUrl = "https://noroff-komputer-store-api.herokuapp.com";
pay = document.getElementById(currentPay); 

/**
 * gets computers from the api
 */
let computers = [];
fetch(apiUrl + "/computers")
  .then((reponse) => reponse.json())
  .then((data) => (computers = data))
  .then((computers) => addComputersToList(computers));

/**
 * adds computers to select in html
 */  
function addComputersToList(computers) {
  computers.forEach((c) => addComputerToList(c));
  displaySelect(computers[0]);
}
/**
 * adds opptions for each of the computers from the api
 */
function addComputerToList(computer) {
  const pcOption = document.createElement("option");
  pcOption.value = computer.id;
  pcOption.appendChild(document.createTextNode(computer.title));
  computersSelect.appendChild(pcOption);
}
/**
 * gets the selected pc from selectbar onchange 
 */
function handlePcSpecs(event) {
  const selectedPc = computers[event.target.selectedIndex];
  curretlySelectedPc = selectedPc;
  pcSpecsElement.innerHTML = "";
  displaySelect(selectedPc);
}
/**
 * changes pc specs to be te selected pc from select element 
 * and fills data in det info section under select
 */
function displaySelect(computer) {
  listMultipleSpecs(computer.specs);
  populateInfoSection(computer);
}
/**
 * calls method to list pc specs 
 */
function listMultipleSpecs(specs) {
  specs.forEach(listSpecs);
}
/**
 * create list element for current pc spec
 */
function listSpecs(spec) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(spec));
  pcSpecsElement.appendChild(li);
}
/**
 *  populates the lower part of page with info about selected pc
 * this is the function called by displaySelect
 * this is pc image
 * pc name and description
 * pc price
 */
async function populateInfoSection(computer) {
  infoHeaderElement.innerText = computer.title;
  infoSpanElement.innerText = computer.description;
  infoPcPrice.innerText = computer.price + " NOK";
  const imgurlString = apiUrl + "/" + computer.image;
  try {
    const image = await fetch(imgurlString);
    if (!image.ok) {
      infoImgElement.setAttribute("src", "catpc2.jfif");
    } else {
      infoImgElement.setAttribute("src", imgurlString);
    }
  } catch (error) {
    console.log(error);
  }
}
/**
 * when loan button is pressed this function is called by onclick
 * then checks if user can loan money
 * then if loan ok=> display payback loan button
 * then showOutstandingLoan to display outstanding loan
 * then updateOutstanding loan value
 * show feedback in alert
 */
function loanMoney() {
  amount = prompt("Amount to loan:");
  if (
    amount != null &&
    amount != "" &&
    amount <= balanceElement.innerHTML * 2 &&
    loan != true &&
    loanRepaid === true
  ) {
    balanceElement.innerHTML = Number(balance) + Number(amount);
    balance = Number(balanceElement.innerHTML);
    loan = true;
    loanRepaid = false;
    loanAmount = amount;
    hidePayBackBtn();
    showOutstandingLoan();
    outstandingLoanUpdate();
    alert("Loan amount: " + amount + ", Granted");
  } else if (amount > balanceElement.innerText * 2) {
    alert("Max loan Amount: Balance * 2");
  }else {
    alert("Loan must be repaid and PC must be bought before more money can be loaned")
  }
}
/**
 * update pay with 100 for each click on work button
 */
function workForMoney() {
  if (currentPay.innerHTML != null) {
    pay = Number(currentPay.innerText) + 100;
    currentPay.innerText = pay;
  }
}
/**
 * transfer pay to bank, deduct 10% if user has loan
 * update outstandingLoan display
 */
function bankPay() {
  if (balance != null && pay > 0) {
    if (!loanRepaid) {
      deductLoan(0.1);
    }
    balanceElement.innerText = Number(balance) + Number(pay);
    balance = Number(balance) + Number(pay);
    currentPay.innerText = 0;
    pay = 0;
  }
  if(!loanRepaid){
    outstandingLoanUpdate();
  }
}
/**
 * pays back all money to loan, leaves rest in pay
 * done by calling deduct loan with value 1 
 * and update outstanding loan
 */
function payLoan() {
  deductLoan(1);
  outstandingLoanUpdate();
}
/**
 * checks if loanAmount>pay*val
 *      if then 
 *          if val<1 money is to be banked, and 10% should be deducted
 *           else all is to be deducted from pay to bayback loan, if rest keep at pay
 *      else update pay and set loan to 0
 *      then hide paybackbutton
 */
function deductLoan(val) {
  if (loanAmount > (pay * val)) {
    loanAmount = loanAmount - (pay * val);
    if (val < 1) {
        pay= pay - (pay * val);
    } else {
      loanAmount = loanAmount - pay;
    }
  } else {
    pay = pay - loanAmount;
    currentPay.innerText = pay;
    loanRepaid = true;
    loanAmount = 0;
    hidePayBackBtn();
  }
}
/**
 * function to hide or display the paybackButton
 */
function hidePayBackBtn() {
  if (payBackBtn.style.display === "none" || payBackBtn.style.display === "") {
    payBackBtn.style.display = "block";
  } else {
    payBackBtn.style.display = "none";
  }
}
/**
 * function showOutsanding loan if user has taken a loan
 */
function showOutstandingLoan(){
    if(outstandingLoanElement.style.display === "none" || outstandingLoanElement.style.display === ""){
        outstandingLoanElement.style.display="block";
    }
}
/**
 * function to maipulate outstandingLoanElements amount
 */
function outstandingLoanUpdate(){
    outstandingLoanElement.innerText = "Outstanding loan: " + loanAmount;
}
/**
 * lets user buy a pc if user has enough money
 * then give feedback with alert
 */
function buyNow() {
  const selectedComputer = computers[computersSelect.selectedIndex];
  const pcPrice = selectedComputer.price;
  console.log(pcPrice);
  if (balance >= pcPrice) {
    balance = balance - pcPrice;
    balanceElement.innerText = balance;
    loan = false;
    alert("Congratulations on your brand new computer");
  }else{
      alert("Cannot afford computer");
  }
}
/**
 * attaches all eventlistners to corresponding html elements
 */
const main = () => {
  payBackBtn.addEventListener("click", payLoan);
  loanButton.addEventListener("click", loanMoney);
  workBtn.addEventListener("click", workForMoney);
  bankBtn.addEventListener("click", bankPay);
  computersSelect.addEventListener("change", handlePcSpecs);
  infoBuyPc.addEventListener("click", buyNow);
};
/**
 * calls the method to attach eventlistners
 */
main();
