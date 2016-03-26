// Static DOM reference
var $availableBets = document.getElementsByClassName("available-bets")[0],
    $slips = document.getElementsByClassName("slips")[0],
    $activeReceipts = document.getElementsByClassName("active-receipts")[0];

// openBets declaration
var openBets;

! function init() {
  // Gets openBets (string) and parses them into a JS array
  var getOpenBets = new XMLHttpRequest();
  getOpenBets.open("GET", "https://bedefetechtest.herokuapp.com/v1/markets", false);
  getOpenBets.send();

  openBets = JSON.parse(getOpenBets.responseText);

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
}();
