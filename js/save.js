//	Thanks Dinesh Ygv
//	http://stackoverflow.com/users/1439313/dinesh-ygv

var blobObject = null;

function createDownloadLink(anchorSelector, str, fileName){

	var element = document.getElementById(anchorSelector);

	if(window.navigator.msSaveOrOpenBlob)
	{
		var fileData = [str];
		blobObject = new Blob(fileData);
		element.addEventListener("click", function()
		{
			window.navigator.msSaveOrOpenBlob(blobObject, fileName);
		});
	}
	else
	{
		var url = "data:application/json;charset=utf-8," + encodeURIComponent(str);
		element.setAttribute("href", url);
	}
}

document.addEventListener("click", function(){
  // fill string with json element
	var str = JSON.stringify(dmaGlobals.lattice.get("cells"));
	createDownloadLink("export",str,"troxes.json");
});
