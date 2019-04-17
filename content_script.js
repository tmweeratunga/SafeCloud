var inputs = document.getElementsByTagName("input");
var i;
for (i = 0; i < inputs.length; i++) { 
	var input = inputs[i];
	if(input.type=='text'){
		console.log('message sending 1');
		var inputValue = input.value;
		var id = input.id;
		if(!isEmpty(inputValue) && (inputValue.includes('[enc]') || inputValue.includes('[dec]'))){
			console.log(new Date(),'message sending 2');
			chrome.runtime.sendMessage({inputType:'text',inputContent: inputValue,inputId:id}, function(response) {
				document.getElementById(response.inputId).value = response.responseMessage;
			});
		}
	}
	if(input.type=='file'){
		var id = input.id;
		if(document.getElementById(id).value != "") {
			const selectedFile = input.files[0];
			chrome.runtime.sendMessage({inputType:'file',inputContent: selectedFile,inputId:id}, function(response) {
				var element = document.createElement('a');
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response.responseMessage));
				element.setAttribute('download', new Date());

				element.style.display = 'none';
				document.body.appendChild(element);

				element.click();

				document.body.removeChild(element);
			});
		}
	}
	
}

function isEmpty(val){
    return !((val !== '') && (val !== undefined) && (val.length > 0) && (val !== null));
}
