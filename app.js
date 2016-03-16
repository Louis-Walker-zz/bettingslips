// DOM reference
var $betSlips = $(".bet-slips")[0],
    $userSlips = $(".user-slips")[0],
    $activeReceipts = $(".active-receipts")[0];

// Gets open bets (string) and parses them into a JS array
var getOpenBets = new XMLHttpRequest();
getOpenBets.open("GET", "https://bedefetechtest.herokuapp.com/v1/markets", false);
getOpenBets.send();

var openBets = JSON.parse(getOpenBets.responseText);

// Checks if XHR was successful, if not then error dialog
if (getOpenBets.status == 200) {
  // Populates .bet-slips with openBets
  for (var i = 0; i < openBets.length; i++) {

    // Betting Slip Template
    var _slip = document.createElement("li");
    $betSlips.appendChild(_slip);
    _slip.classList.add("slip");
    _slip.classList.add("flex");
    var dataSlipId = document.createAttribute("data-slipId");
    dataSlipId.value = openBets[i].bet_id;
    _slip.setAttributeNode(dataSlipId);
    var $slip = $(".slip")[i];

    var _teamLogo = document.createElement("div");
    $slip.appendChild(_teamLogo);
    _teamLogo.classList.add("team-logo");
    _teamLogo.classList.add("sprites");

    var _teamName = document.createElement("span");
    $slip.appendChild(_teamName);
    _teamName.classList.add("team-name");

    var _condition = document.createElement("span");
    $slip.appendChild(_condition);
    _condition.classList.add("condition");

    var _odds = document.createElement("div");
    $slip.appendChild(_odds);
    _odds.classList.add("odds");
    var $odds = $(".odds")[i];

    var _num = document.createElement("span");
    $odds.appendChild(_num);
    _num.classList.add("odds-num");

    var _slash = document.createElement("span");
    $odds.appendChild(_slash);
    _slash.classList.add("odds-slash");
    _slash.innerHTML = "/";

    var _denom = document.createElement("span");
    $odds.appendChild(_denom);
    _denom.classList.add("odds-denom");

    // Slip Reference
    var $teamLogo = $(".team-logo")[i],
        $teamName = $(".team-name")[i],
        $condition = $(".condition")[i],
        $oddsNum = $(".odds-num")[i],
        $oddsDenom = $(".odds-denom")[i];

    // Populates slip elements with openBets[i]
    var eventName = openBets[i].event;
    eventName = eventName.replace(/\s/g, "-").toLowerCase();

    _slip.classList.add(eventName);
    $teamLogo.classList.add(openBets[i].name.toLowerCase());
    $teamName.innerHTML = openBets[i].name;
    $condition.innerHTML = "to win " + openBets[i].event;
    $oddsNum.innerHTML = openBets[i].odds.numerator;
    $oddsDenom.innerHTML = openBets[i].odds.denominator;
  }

  // Adds click event listener to available bets for the user to select bets
  var $slip = $(".slip");

  for (var i = 0; i < $slip.length; i++) {
    $slip[i].addEventListener("click", addSlip);
  }

} else {
  vex.dialog.alert("Sorry we were unable to find available bets. Try refeshing the page or come back later.");
}

// Adds elements and openBet to userSlip
function addSlip() {
  var $slipId = this.getAttribute("data-slipId"),
      $slipArray = $(".selected-slip"),
      $thisSlip = $slipArray.length;

  var _userSlip = document.createElement("li");
  $userSlips.appendChild(_userSlip);
  _userSlip.classList.add("selected-slip");
  var $selectedSlipArray = $(".selected-slip"),
      $selectedSlip = $(".selected-slip").get($slipArray.length);
  $(".selected-slip").animate({opacity: 1}, 300);

  var _teamName = document.createElement("h4");
  $selectedSlip.appendChild(_teamName);
  _teamName.innerHTML = openBets[$slipId - 1].name;

  var _slipNum = document.createElement("span");
  $selectedSlip.appendChild(_slipNum);
  _slipNum.classList.add("sel-num");
  _slipNum.innerHTML = openBets[$slipId - 1].odds.numerator;

  var _slipSlash = document.createElement("span");
  $selectedSlip.appendChild(_slipSlash);
  _slipSlash.classList.add("sel-slash");
  _slipSlash.innerHTML = "/";

  var _slipDenom = document.createElement("span");
  $selectedSlip.appendChild(_slipDenom);
  _slipDenom.classList.add("sel-denom");
  _slipDenom.innerHTML = openBets[$slipId - 1].odds.denominator;

  var _slipStakeForm = document.createElement("form");
  $selectedSlip.appendChild(_slipStakeForm);
  _slipStakeForm.classList.add("stake-form");
  var $stakeForm = $(".stake-form").get($slipArray.length);

  var _stake = document.createElement("input");
  $stakeForm.appendChild(_stake);
  _stake.classList.add("sel-stake");
  var stakeType = document.createAttribute("type");
  stakeType.value = "number";
  _stake.setAttributeNode(stakeType);
  var stakePlaceholder = document.createAttribute("placeholder");
  stakePlaceholder.value = "stake";
  _stake.setAttributeNode(stakePlaceholder);
  _stake.addEventListener("input", updateReturns);

  var _submitStake = document.createElement("button");
  $stakeForm.appendChild(_submitStake);
  _submitStake.id = "sumbitStakeBtn";
  _submitStake.classList.add("submit-stake");
  _submitStake.innerHTML = "Bet";
  var submitStakeType = document.createAttribute("type");
  submitStakeType.value = "button";
  _submitStake.setAttributeNode(submitStakeType);
  _submitStake.addEventListener("click", submitBet);

  var _returns = document.createElement("span");
  $selectedSlip.appendChild(_returns);
  _returns.classList.add("sel-returns");
  _returns.innerHTML = "Potential Profit: &pound0.00";

  function updateReturns() {
    var $selectedNum = $(".sel-num").get($thisSlip),
        $selectedDenom = $(".sel-denom").get($thisSlip),
        $selectedReturns = $(".sel-returns").get($thisSlip),
        stakeMultiplier = eval($selectedNum.innerHTML + "/" + $selectedDenom.innerHTML),
        stakeReturns = stakeMultiplier * this.value;

    $selectedReturns.innerHTML = "Potential Profit: &pound" + (stakeReturns.toFixed(2));
  }

  function submitBet() {
    var postBet = new XMLHttpRequest();
    postBet.open("Post", "https://bedefetechtest.herokuapp.com/v1/bets", false);
    postBet.setRequestHeader("Content-type", "application/json");

    var $betStakeValue = $(".sel-stake").get($slipArray.length).value,
        $betNum = $(".sel-num").get($slipArray.length).innerHTML,
        $betDenom = $(".sel-denom").get($slipArray.length).innerHTML;
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
      createReceipt(JSON.parse(postBet.responseText));

      // Removes betting slip
      $(this).parent().parent().fadeOut(300, function() {
        $(this).remove();
      });

      console.log(postBet.status);
    } else {
      console.log(postBet.status);
      vex.dialog.alert("Sorry we were unable to process your bet. Please try again later.");
    }
  }
}

// Adds receipt to active-receipts
function createReceipt(receiptParams) {

  // Receipt Template
  var transactionId = receiptParams.transaction_id;

  var _receipt = document.createElement("tr");
  $activeReceipts.appendChild(_receipt);
  var receiptId = document.createAttribute("name");
  receiptId.value = transactionId.toString();
  _receipt.setAttributeNode(receiptId);
  var $thisReceipt = document.getElementsByName(transactionId.toString())[0];

  var _transactionId = document.createElement("td");
  $thisReceipt.appendChild(_transactionId);

  var _eventName = document.createElement("td");
  $thisReceipt.appendChild(_eventName);

  var _teamName = document.createElement("td");
  $thisReceipt.appendChild(_teamName);

  var _odds = document.createElement("td");
  $thisReceipt.appendChild(_odds);

  var _stake = document.createElement("td");
  $thisReceipt.appendChild(_stake);

  var _return = document.createElement("td");
  $thisReceipt.appendChild(_return);

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
