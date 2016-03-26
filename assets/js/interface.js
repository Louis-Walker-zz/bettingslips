function showSlip(target) {
  setTimeout(function() {
    target.classList.remove("hide");
  }, 1);
}

function removeSlip(target) {
  elevateNode(target, 2).classList.add("hide");
  setTimeout(removeSlipNode.bind(null, target), 300);

  function removeSlipNode(target) {
    removeNode(elevateNode(target, 2));
  }
}
