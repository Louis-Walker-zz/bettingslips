// DOM reference
var $availableBets = document.getElementsByClassName("available-bets")[0],
    $slips = document.getElementsByClassName("slips")[0],
    $activeReceipts = document.getElementsByClassName("active-receipts")[0];

// Gets open bets (string) and parses them into a JS array
var getOpenBets = new XMLHttpRequest();
getOpenBets.open("GET", "https://bedefetechtest.herokuapp.com/v1/markets", false);
getOpenBets.send();

var openBets = JSON.parse(getOpenBets.responseText);

// Checks if XHR was successful, if not then error dialog
if (getOpenBets.status == 200) {
  // Populates $availableBets with openBets
  for (var i = 0; i < openBets.length; i++) {
    // Bet Template
    createElement($availableBets, "li", ["bet", "flex"], openBets[i].bet_id);
    var $bet = document.getElementsByClassName("bet")[i];

    createElement($bet, "div", ["team-logo", "sprites"]);
    createElement($bet, "span", ["team-name"]);
    createElement($bet, "span", ["condition"]);
    createElement($bet, "div", ["odds"]);

    // Slip Reference
    var $teamLogo = document.getElementsByClassName("team-logo")[i],
        $teamName = document.getElementsByClassName("team-name")[i],
        $condition = document.getElementsByClassName("condition")[i],
        $odds = document.getElementsByClassName("odds")[i];

    // Populates slip elements with openBets[i]
    var eventName = openBets[i].event;
    eventName = eventName.replace(/\s/g, "-").toLowerCase();

    $bet.classList.add(eventName);
    $teamLogo.classList.add(openBets[i].name.toLowerCase());
    $teamName.innerHTML = openBets[i].name;
    $condition.innerHTML = "to win " + openBets[i].event;
    $odds.innerHTML = openBets[i].odds.numerator + "/" + openBets[i].odds.denominator;
  }

  // Adds click event listener to available bets for the user to select bets
  var $bet = document.getElementsByClassName("bet");

  for (var i = 0; i < $bet.length; i++) {
    $bet[i].addEventListener("click", addSlip);
  }

} else {
  // TODO: Replace Vex Dialogue
}

// Creates slip with $slipId
function addSlip() {
  var $slipId = this.getAttribute("data-betId"),
      $slipArray = document.getElementsByClassName("slip"),
      $thisSlip = $slipArray.length,
      thisBet = openBets[$slipId - 1];

  createElement($slips, "li", ["slip"], $slipId);
  var $selectedSlip = document.getElementsByClassName("slip")[$slipArray.length - 1];

  createElement($selectedSlip, "h4", ["slip-name"]);
  getElementByBetId($slipId, document.getElementsByClassName("slip-name")).innerHTML = thisBet.name;

  createElement($selectedSlip, "span", ["slip-odds"]);
  getElementByBetId($slipId, document.getElementsByClassName("slip-odds")).innerHTML = thisBet.odds.numerator + "/" + thisBet.odds.denominator;

  createElement($selectedSlip, "form", ["stake-form"]);
  var $stakeForm = document.getElementsByClassName("stake-form")[$slipArray.length - 1];

  createElement($stakeForm, "input", ["slip-stake"]);
  var stakeType = document.createAttribute("type");
  stakeType.value = "number";
  getElementByBetId($slipId, document.getElementsByClassName("slip-stake"), 2).setAttributeNode(stakeType);
  var stakePlaceholder = document.createAttribute("placeholder");
  stakePlaceholder.value = "stake";
  getElementByBetId($slipId, document.getElementsByClassName("slip-stake"), 2).setAttributeNode(stakePlaceholder);
  getElementByBetId($slipId, document.getElementsByClassName("slip-stake"), 2).addEventListener("input", updateReturns);

  createElement($stakeForm, "button", ["submit-stake"]);
  getElementByBetId($slipId, document.getElementsByClassName("submit-stake"), 2).innerHTML = "Bet";
  var submitStakeType = document.createAttribute("type");
  submitStakeType.value = "button";
  getElementByBetId($slipId, document.getElementsByClassName("submit-stake"), 2).addEventListener("click", submitBet);
  getElementByBetId($slipId, document.getElementsByClassName("submit-stake"), 2).setAttributeNode(submitStakeType);

  createElement($selectedSlip, "span", ["slip-returns"]);
  getElementByBetId($slipId, document.getElementsByClassName("slip-returns")).innerHTML = "Potential Profit: &pound0.00";

  function updateReturns() {
    var $slipOdds = getElementByBetId($slipId, document.getElementsByClassName("slip-odds")),
        stakeMultiplier = eval($slipOdds.innerHTML),
        stakeReturns = stakeMultiplier * this.value,
        $returns = elevateNode(this, 2);

    $returns.lastChild.innerHTML = "Potential Profit: &pound" + (stakeReturns.toFixed(2));
  }

  function submitBet() {
    var postBet = new XMLHttpRequest();
    postBet.open("Post", "https://bedefetechtest.herokuapp.com/v1/bets", false);
    postBet.setRequestHeader("Content-type", "application/json");

    var $betStakeValue = getElementByBetId($slipId, document.getElementsByClassName("slip-stake"), 2).value,
        $betNum = openBets[$slipId - 1].odds.numerator,
        $betDenom = openBets[$slipId - 1].odds.denominator,
        betObject = {
          "bet_id": $slipId,
          "odds": {
            "numerator": $betNum,
            "denominator": $betDenom
          },
          "stake": $betStakeValue
        },
        betParams = JSON.stringify(betObject);

    postBet.send(betParams);

    // Checks if XHR was successful, if not then error dialog
    if (postBet.status == 201) {
      createReceipt(JSON.parse(postBet.responseText), $slipId);

      // TODO: Removes betting slip


    } else {
      // TODO: Replace Vex Dialogue
    }
  }
}

// Adds receipt to active-receipts
function createReceipt(receiptParams, $slipId) {
  // Receipt Template
  createElement($activeReceipts, "tr", ["receipt"], $slipId);
  var receiptId = document.createAttribute("name");
  receiptId.value = receiptParams.transaction_id.toString();
  getElementByBetId($slipId, document.getElementsByClassName("receipt"), 0).setAttributeNode(receiptId);
  var $thisReceipt = document.getElementsByName(receiptParams.transaction_id.toString())[0];

  createElement($thisReceipt, "td");
  createElement($thisReceipt, "td");
  createElement($thisReceipt, "td");
  createElement($thisReceipt, "td");
  createElement($thisReceipt, "td");
  createElement($thisReceipt, "td");

  // Receipt Reference
  var $transactionId = $thisReceipt.childNodes[0],
      $eventName = $thisReceipt.childNodes[1],
      $teamName = $thisReceipt.childNodes[2],
      $odds = $thisReceipt.childNodes[3],
      $stake = $thisReceipt.childNodes[4],
      $_return = $thisReceipt.childNodes[5];

  // Populates receipt with receiptParams
  $transactionId.innerHTML = receiptParams.transaction_id;
  $eventName.innerHTML = receiptParams.event;
  $teamName.innerHTML = receiptParams.name;
  $odds.innerHTML = receiptParams.odds.numerator + "/" + receiptParams.odds.denominator;
  $stake.innerHTML = "&pound" + receiptParams.stake;
  $_return.innerHTML = "&pound" + (eval($odds.innerHTML) * receiptParams.stake + receiptParams.stake).toFixed(2);
}

// Modular Functions
// Creates element with specified data-betId and classes
function createElement(parent, type, classes, betId) {
  var el = document.createElement(type);
  parent.appendChild(el);

  if (classes !== undefined) {
    for (var i = 0; classes.length > i; i++) {
      el.classList.add(classes[i]);
    }
  }

  if (betId !== undefined) {
    var dataBetId = document.createAttribute("data-betId");
    dataBetId.value = betId;
    el.setAttributeNode(dataBetId);
  }
}

// Gets element based on betId and className
function getElementByBetId(betId, className, elevation) {
  if (elevation == undefined) {
    var elevation = 1;
  }

  for (var i = 0; className.length > i; i++) {
    var target = elevateNode(className[i], elevation);

    if (getBetId(target) == betId) {
      return className[i];
    }
  }
}

// Gets DOM object of target's ascendant
function elevateNode(target, elevate) {
  var elevation = target;

  for (var i = 0; elevate > i; i++) {
    elevation = elevation.parentNode;
  }

  return elevation;
}

// Gets data-betId from target
function getBetId(target) {
  return target.getAttribute("data-betId");
}
