var updateStats = function() {
//	dmaGlobals.lattice.get("cells")[0][0][1].parentType
	// place random number in each stat just to prove update works
  var numTetra = getCellCountOfType("tetra");
  var numOcta = getCellCountOfType("octa");
  var numIcosa = getCellCountOfType("icosa");
  var numTroxes = 4*numTetra + 8*numOcta + 20*numIcosa;

	var tetra = document.getElementsByClassName("countTetra");
	tetra[0].innerHTML = numTetra;

  var octa = document.getElementsByClassName("countOcta");
	octa[0].innerHTML = numOcta;

  var icosa = document.getElementsByClassName("countIcosa");
	icosa[0].innerHTML = numIcosa;

  var troxes = document.getElementsByClassName("countTroxes");
	troxes[0].innerHTML = numTroxes;
};

var getCellCountOfType = function(type) {
    var count = 0;
    var cells = dmaGlobals.lattice.get("cells")[0][0];

    _.each(cells, function (cell) {
  		if(cell == null)
  			return;
  		if(cell.getType() === type) {
  			count++;
  		}
  	});

    return count;
};
