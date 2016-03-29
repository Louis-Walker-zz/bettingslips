function showSlip(target) {
  setTimeout(function() {
    target.classList.remove("hide");
  }, 1);
}

function removeSlip(target) {
  elevateNode(target, 2).classList.add("hide");
  elevateNode(target, 2).classList.add("slip-completed");

  setTimeout(removeSlipNode.bind(null, target), 300);

  function removeSlipNode(target) {
    removeNode(elevateNode(target, 2));
  }
}

function createModal(title, body) {
  if (title == undefined && body == undefined) {
    title = "We are sorry.";
    body = "Your request could not be processed. Please try again at another time.";
  }

  createElement(document.body, "div", ["modal-wrapper", "modal-wrapper-enter"], null, true);
  var $modalWrapper = document.getElementsByClassName("modal-wrapper")[0];

  createElement($modalWrapper, "div", ["modal", "modal-enter"]);
  var $modal = $modal = document.getElementsByClassName("modal")[0];

  createElement($modal, "span", "modal-title");
  var $modalTitle = document.getElementsByClassName("modal-title")[0];
  $modalTitle.innerHTML = title;

  createElement($modal, "p", "modal-body");
  var $modalBody = document.getElementsByClassName("modal-body")[0];
  $modalBody.innerHTML = body;

  createElement($modal, "button", ["modal-close", "def-btn"]);
  var $modalClose = document.getElementsByClassName("modal-close")[0];
  $modalClose.innerHTML = "Close";

  $modalClose.addEventListener("click", function() {
    $modalWrapper.classList.remove("modal-wrapper-enter");
    $modalWrapper.classList.add("modal-wrapper-exit");

    $modal.classList.remove("modal-enter");
    $modal.classList.add("modal-exit");

    setTimeout(removeNode.bind(null, $modalWrapper), 800);
  }, false);
}
