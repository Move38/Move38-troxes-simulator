var updateStats = function() {
//	dmaGlobals.lattice.get("cells")[0][0][1].parentType
	// place random number in each stat just to prove update works
  var numTetra = getCellCountOfType("tetra");
  var numOcta = getCellCountOfType("octa");
  var numIcosa = getCellCountOfType("icosa");
  var numTroxes = 4*numTetra + 8*numOcta + 20*numIcosa;

  updateStatWithType("countTetra", numTetra);
  updateStatWithType("countOcta", numOcta);
  updateStatWithType("countIcosa", numIcosa);
  updateStatWithType("countTroxes", numTroxes);
};

var updateStatWithType = function(statType, statValue) {
  var statText = document.getElementsByClassName(statType);
  _.each(statText, function(text) {
    text.innerHTML = statValue;
  });
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
