let balance = 0;
let pay = 0;
let loan = false;
let loanRepaid = true;
let loanAmount = 0;
let curretlySelectedPc = "";

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

let computers = [];
fetch(apiUrl + "/computers")
  .then((reponse) => reponse.json())
  .then((data) => (computers = data))
  .then((computers) => addComputersToList(computers));

function addComputersToList(computers) {
  computers.forEach((c) => addComputerToList(c));
  displaySelect(computers[0]);
}
function addComputerToList(computer) {
  const pcOption = document.createElement("option");
  pcOption.value = computer.id;
  pcOption.appendChild(document.createTextNode(computer.title));
  computersSelect.appendChild(pcOption);
}
function handlePcSpecs(event) {
  const selectedPc = computers[event.target.selectedIndex];
  curretlySelectedPc = selectedPc;
  pcSpecsElement.innerHTML = "";
  displaySelect(selectedPc);
}
function displaySelect(computer) {
  listMultipleSpecs(computer.specs);
  populateInfoSection(computer);
}
function listMultipleSpecs(specs) {
  specs.forEach(listSpecs);
}
function listSpecs(spec) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(spec));
  pcSpecsElement.appendChild(li);
}
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
    console.log(loan);
  }else {
    alert("Loan must be repaid and PC must be bought before more money can be loaned")
  }
}
function workForMoney() {
  if (currentPay.innerHTML != null) {
    pay = Number(currentPay.innerText) + 100;
    currentPay.innerText = pay;
  }
}
function bankPay() {
  if (balance != null && pay > 0) {
    if (!loanRepaid) {
      deductLoan(0.1);
    }
    balanceElement.innerText = balance + pay;
    balance = balance + pay;
    currentPay.innerText = 0;
    pay = 0;
  }
  outstandingLoanUpdate();
}
function payLoan() {
  deductLoan(1);
  outstandingLoanUpdate();
}
function deductLoan(val) {
  if (loanAmount > pay * val) {
    loanAmount = loanAmount - pay * val;
    if (val > 1) {
      pay = pay * 1 - val;
    } else {
      pay = pay - val;
    }
  } else {
    pay = pay - loanAmount;
    currentPay.innerText = pay;
    loanRepaid = true;
    loanAmount = 0;
    hidePayBackBtn();
  }
}
function hidePayBackBtn() {
  if (payBackBtn.style.display === "none" || payBackBtn.style.display === "") {
    payBackBtn.style.display = "block";
  } else {
    payBackBtn.style.display = "none";
  }
}
function showOutstandingLoan(){
    if(outstandingLoanElement.style.display === "none" || outstandingLoanElement.style.display === ""){
        outstandingLoanElement.style.display="block";
    }
}
function outstandingLoanUpdate(){
    outstandingLoanElement.innerText = "Outstanding loan: " + loanAmount;
}
function buyNow() {
  const selectedComputer = computers[computersSelect.selectedIndex];
  const pcPrice = selectedComputer.price;
  console.log(pcPrice);
  if (balance >= pcPrice) {
    balance = balance - pcPrice;
    balanceElement.innerText = balance;
    loan = false;
  }
}
const main = () => {
  payBackBtn.addEventListener("click", payLoan);
  loanButton.addEventListener("click", loanMoney);
  workBtn.addEventListener("click", workForMoney);
  bankBtn.addEventListener("click", bankPay);
  computersSelect.addEventListener("change", handlePcSpecs);
  infoBuyPc.addEventListener("click", buyNow);
};
main();
