import { customers, slab, silver, gold, diamond, platinum } from './data.js';

// document variables
const month1 = document.getElementById('month1');
const month2 = document.getElementById('month2');
const month3 = document.getElementById('month3');
const btnSubmit = document.getElementById('btnSubmit');
const btnReset = document.getElementById('btnReset');
const resultContainer = document.getElementById('result');
const custNumber = document.getElementById('custNo');
const btnCustSubmit = document.getElementById('custBtnSubmit');
const custResult = document.getElementById('custResult');

// Variables for calculation
let qtrValue = 0;
let month1Slab = 'Not Qualified';
let month2Slab = 'Not Qualified';
let month3Slab = 'Not Qualified';
let qtrSlab = 'Not Qualified';
let month1Points = 0;
let month2Points = 0;
let month3Points = 0;
let qtrPoints = 0;
let totalPoints = 0;
let month1SchemeValue = 0;
let month2SchemeValue = 0;
let month3SchemeValue = 0;
let qtrSchemeValue = 0;
let allThreeMonthBonus = 0;
let activeBonus = 0;
let activeBonusVirtual = 0;
let categoryBonus = 0;

//Active Club Member
let isActive = false;

// Click event listner on customer submit
btnCustSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  if (custValidate()) {
    isActive = false;
    showCustResult();
  }
});

function custValidate() {
  const customerNumber = custNumber.value.trim();
  let returnValue = true;
  const alphanumeric = /^[0-9a-zA-Z]+$/;

  if (customerNumber === '') {
    setError(custNumber, 'Customer number is required');
    returnValue = false;
  } else if (!customerNumber.match(alphanumeric)) {
    setError(
      custNumber,
      'Enter only alphanumeric characters, no special characters'
    );
    returnValue = false;
  } else if (!validCustNumber(customerNumber)) {
    setError(
      custNumber,
      'Not a valid customer number for eg. 2NDS123456 or 3NDS123456'
    );
  } else {
    setSuccess(custNumber);
  }
  return returnValue;
}

function validCustNumber(n) {
  let custNumStr = n.toUpperCase().split('');
  let returnValue = true;
  let validNum = /\d{1}[a-z]{3}\d{6}/gi;
  console.log(custNumStr, custNumStr.length, n.match(validNum));
  if (custNumStr.length !== 10) {
    returnValue = false;
  }
  if (!n.match(validNum)) {
    returnValue = false;
  }
  return returnValue;
}

function showCustResult() {
  let customer = custNumber.value.trim().toUpperCase();
  let custData = customers.find((ele) => {
    return ele['Member ID'] === customer;
  });
  if (custData) {
    custResult.innerHTML = `<h5><u>${custData['Member Name']}</u><br><small class="text-info">Customer Status: ${custData['Member Status']}</small></h5>`;
    if (custData['Member Status'] === 'Active Club') {
      isActive = true;
    }
    btnCustSubmit.disabled = true;
  } else {
    custResult.innerHTML = `<small class="text-danger">Error: No customer with this ID found</small>`;
  }
}

//Click event listner on submit
btnSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  if (validate()) {
    initializeVariables();
    calculateScheme();
    showResult();
  }
});

//Click event listener on reset
btnReset.addEventListener('click', (e) => {
  e.preventDefault();
  resetAll();
});

//form validation function
function validate() {
  const month1Val = month1.value.trim();
  const month2Val = month2.value.trim();
  const month3Val = month3.value.trim();
  let returnValue = true;

  if (month1Val === '' && month2Val === '' && month3Val === '') {
    setError(month3, 'Atleast one month needs to be filled');
    returnValue = false;
  } else {
    setSuccess(month3);
  }

  if (month1Val !== '') {
    if (!isNumber(month1Val)) {
      setError(month1, 'Only numbers without comma should be entered');
      returnValue = false;
    } else if (parseFloat(month1Val) < 0) {
      setError(month1, 'Only positive numbers without comma should be entered');
      returnValue = false;
    } else {
      setSuccess(month1);
    }
  }

  if (month2Val !== '') {
    if (!isNumber(month2Val)) {
      setError(month2, 'Only numbers without comma should be entered');
      returnValue = false;
    } else if (parseFloat(month2Val) < 0) {
      setError(month2, 'Only positive numbers without comma should be entered');
      returnValue = false;
    } else {
      setSuccess(month2);
    }
  }

  if (month3Val !== '') {
    if (!isNumber(month3Val)) {
      console.log('month3 Is not a number');
      setError(month3, 'Only numbers without comma should be entered');
      returnValue = false;
    } else if (parseFloat(month3Val) < 0) {
      setError(month3, 'Only positive numbers without comma should be entered');
      returnValue = false;
    } else {
      setSuccess(month3);
    }
  }

  return returnValue;
}

// isNumber validation function
function isNumber(val) {
  return !isNaN(val) && isFinite(val);
}

// give error message to relevant input field
function setError(id, message) {
  const element = id.parentElement;
  const errorElement = element.querySelector('#error');
  errorElement.innerHTML = message;
}

// remove error message to relevant input field
function setSuccess(id) {
  const element = id.parentElement;
  const errorElement = element.querySelector('#error');
  errorElement.innerHTML = '';
}

function initializeVariables() {
  qtrValue = 0;
  month1Slab = 'Not Qualified';
  month2Slab = 'Not Qualified';
  month3Slab = 'Not Qualified';
  qtrSlab = 'Not Qualified';
  month1Points = 0;
  month2Points = 0;
  month3Points = 0;
  qtrPoints = 0;
  totalPoints = 0;
  month1SchemeValue = 0;
  month2SchemeValue = 0;
  month3SchemeValue = 0;
  qtrSchemeValue = 0;
  allThreeMonthBonus = 0;
  activeBonus = 0;
  activeBonusVirtual = 0;
  categoryBonus = 0;
}

// Calculation of scheme function
function calculateScheme() {
  const month1Val = parseFloat(month1.value.trim());
  const month2Val = parseFloat(month2.value.trim());
  const month3Val = parseFloat(month3.value.trim());
  qtrValue =
    (month1Val ? month1Val : 0) +
    (month2Val ? month2Val : 0) +
    (month3Val ? month3Val : 0);

  if (month1Val) {
    if (month1Val < 50000) {
      month1Slab = 'Not Qualified';
    } else if (month1Val >= 50000 && month1Val <= 124999) {
      month1Slab = 'silver';
    } else if (month1Val >= 125000 && month1Val <= 249999) {
      month1Slab = 'gold';
    } else if (month1Val >= 250000 && month1Val <= 399999) {
      month1Slab = 'diamond';
    } else if (month1Val >= 400000) {
      month1Slab = 'platinum';
    }
  }

  if (month1Slab === 'silver') {
    month1Points = parseInt(month1Val / 10000) * silver.monthPoints;
    month1SchemeValue = month1Points * silver.value;
  }

  if (month1Slab === 'gold') {
    month1Points = parseInt(month1Val / 10000) * gold.monthPoints;
    month1SchemeValue = month1Points * gold.value;
  }

  if (month1Slab === 'diamond') {
    month1Points = parseInt(month1Val / 10000) * diamond.monthPoints;
    month1SchemeValue = month1Points * diamond.value;
  }

  if (month1Slab === 'platinum') {
    month1Points = parseInt(month1Val / 10000) * platinum.monthPoints;
    month1SchemeValue = month1Points * platinum.value;
  }

  if (month2Val) {
    if (month2Val < 70000) {
      month2Slab = 'Not Qualified';
    } else if (month2Val >= 70000 && month2Val <= 174999) {
      month2Slab = 'silver';
    } else if (month2Val >= 175000 && month2Val <= 349999) {
      month2Slab = 'gold';
    } else if (month2Val >= 350000 && month2Val <= 499999) {
      month2Slab = 'diamond';
    } else if (month2Val >= 500000) {
      month2Slab = 'platinum';
    }
  }

  if (month2Slab === 'silver') {
    month2Points = parseInt(month2Val / 10000) * silver.monthPoints;
    month2SchemeValue = month2Points * silver.value;
  }

  if (month2Slab === 'gold') {
    month2Points = parseInt(month2Val / 10000) * gold.monthPoints;
    month2SchemeValue = month2Points * gold.value;
  }

  if (month2Slab === 'diamond') {
    month2Points = parseInt(month2Val / 10000) * diamond.monthPoints;
    month2SchemeValue = month2Points * diamond.value;
  }

  if (month2Slab === 'platinum') {
    month2Points = parseInt(month2Val / 10000) * platinum.monthPoints;
    month2SchemeValue = month2Points * platinum.value;
  }

  if (month3Val) {
    if (month3Val < 80000) {
      month3Slab = 'Not Qualified';
    } else if (month3Val >= 80000 && month3Val <= 199999) {
      month3Slab = 'silver';
    } else if (month3Val >= 200000 && month3Val <= 399999) {
      month3Slab = 'gold';
    } else if (month3Val >= 400000 && month3Val <= 599999) {
      month3Slab = 'diamond';
    } else if (month3Val >= 600000) {
      month3Slab = 'platinum';
    }
  }

  if (month3Slab === 'silver') {
    month3Points = parseInt(month3Val / 10000) * silver.monthPoints;
    month3SchemeValue = month3Points * silver.value;
  }

  if (month3Slab === 'gold') {
    month3Points = parseInt(month3Val / 10000) * gold.monthPoints;
    month3SchemeValue = month3Points * gold.value;
  }

  if (month3Slab === 'diamond') {
    month3Points = parseInt(month3Val / 10000) * diamond.monthPoints;
    month3SchemeValue = month3Points * diamond.value;
  }

  if (month3Slab === 'platinum') {
    month3Points = parseInt(month3Val / 10000) * platinum.monthPoints;
    month3SchemeValue = month3Points * platinum.value;
  }

  if (qtrValue < 200000) {
    qtrSlab = 'Not Qualified';
  } else if (qtrValue >= 200000 && qtrValue <= 499999) {
    qtrSlab = 'silver';
  } else if (qtrValue >= 500000 && qtrValue <= 999999) {
    qtrSlab = 'gold';
  } else if (qtrValue >= 1000000 && qtrValue <= 1499999) {
    qtrSlab = 'diamond';
  } else if (qtrValue >= 1500000) {
    qtrSlab = 'platinum';
  }

  if (qtrSlab === 'silver') {
    qtrPoints = parseInt(qtrValue / 10000) * silver.qtrPoints;
    qtrSchemeValue = qtrPoints * silver.value;
  }

  if (qtrSlab === 'gold') {
    qtrPoints = parseInt(qtrValue / 10000) * gold.qtrPoints;
    qtrSchemeValue = qtrPoints * gold.value;
  }

  if (qtrSlab === 'diamond') {
    qtrPoints = parseInt(qtrValue / 10000) * diamond.qtrPoints;
    qtrSchemeValue = qtrPoints * diamond.value;
  }

  if (qtrSlab === 'platinum') {
    qtrPoints = parseInt(qtrValue / 10000) * platinum.qtrPoints;
    qtrSchemeValue = qtrPoints * platinum.value;
  }

  if (month1Val > 49999 && month2Val > 69999 && month3Val > 79999) {
    totalPoints = month1Points + month2Points + month3Points + qtrPoints;
    allThreeMonthBonus = totalPoints * 2;
  }

  if (isActive) {
    activeBonus = parseInt(qtrValue * 0.005);
    activeBonusVirtual = parseInt(qtrValue * 0.005);
  }

  categoryBonus = parseInt(qtrValue * 0.005);

  console.log(month1Slab, month2Slab, month3Slab, qtrSlab);
  console.log(
    qtrValue,
    month1Val,
    month2Val,
    month3Val,
    month1SchemeValue,
    month2SchemeValue,
    month3SchemeValue,
    qtrSchemeValue,
    month1Points,
    month2Points,
    month3Points,
    qtrPoints,
    totalPoints,
    allThreeMonthBonus,
    activeBonus,
    activeBonusVirtual,
    categoryBonus
  );
}

// reset All function
function resetAll() {
  setSuccess(month1),
    setSuccess(month2),
    setSuccess(month3),
    initializeVariables();
  custNumber.value = '';
  custResult.innerHTML = '';
  isActive = false;
  btnCustSubmit.disabled = false;
  month1.value = '';
  month2.value = '';
  month3.value = '';
  resultContainer.innerHTML = '';
}

// display result function
function showResult() {
  let totalEarnings =
    month1SchemeValue +
    month2SchemeValue +
    month3SchemeValue +
    qtrSchemeValue +
    allThreeMonthBonus;
  resultContainer.innerHTML = `<div class="border result p-4 rounded bg-white">
          <h6 class="mb-3 text-success text-uppercase font-weight-bold">Scheme Result</h6>
          <p class="m-0 mb-2">Total Quarterly Purchase: Rs. ${qtrValue}</p>
          <h6 class="m-0">Monthly earnings:</h6>
          <p class="m-0">Month 1 scheme earning : Rs. ${month1SchemeValue}; slab: ${month1Slab}</p>
          <p class="m-0">
            Month 2 scheme earning : Rs. ${month2SchemeValue}; slab: ${month2Slab}
          </p>
          <p class="m-0 mb-2">
            Month 3 scheme earning : Rs. ${month3SchemeValue}; slab: ${month3Slab}
          </p>
          <h6 class="m-0">Quarterly earnings:</h6>
          <p class="m-0">Quarterly Slab: ${qtrSlab}</p>
          <p class="m-0 mb-2">Quarterly earning: Rs. ${qtrSchemeValue} </p>
          <h6 class="m-0">Top up for buying all 3 months:</h6>
          <p class="m-0 mb-2">Top Up Value: Rs. ${allThreeMonthBonus} </p>
          <h6 class="mb-2 text-info text-uppercase font-weight-bold">Total Scheme Earning: Rs. ${totalEarnings}</h6>
          
          ${
            isActive
              ? `<h6 class="m-0">Bonus for active club members only:</h6>
              <p class="m-0">Bonus Value: Rs ${activeBonus} </p>
          <p class="m-0 mb-2">Bonus Value (Virtual Payment): Rs ${activeBonusVirtual}</p>`
              : ''
          }          
          <h6 class="m-0">
            Top up bonus for adding new category (<small
              >20% contribution of quarter sales</small
            >):
          </h6>
          <p class="m-0">New Category Bonus Value: Rs. ${categoryBonus}</p>
        </div>
      </div>`;
}
