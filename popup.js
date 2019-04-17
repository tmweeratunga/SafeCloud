
var recipient;

document.addEventListener('DOMContentLoaded', function () {
	var manageMyKeysBtn = document.getElementById('manageMyKeys');
	var generateKeyPairBtn = document.getElementById('generateKeyPair');
	var updateKeyBtn = document.getElementById('updateKey');
	var backupOptionBtn = document.getElementById('backup');
	var backupAllDataBtn = document.getElementById('backupAllData');
	var backupAllKeysBtn = document.getElementById('backupAllKeys');
	var managerecipientBtn = document.getElementById('managerecipient');
	var addNewRecipientBtn = document.getElementById('addNewRecipient');
	var updateRecipientBtn = document.getElementById('updateRecipient');
	var deleteRecipientBtn = document.getElementById('deleteRecipient');
	var encryptBtn = document.getElementById('encrypt');
	var saveMyKeyBtn = document.getElementById('saveMyKey');
	var saveRecipientBtn = document.getElementById('saveRecipient');
	var encryiptForRecipient = document.getElementById('encryiptForRecipient');
	var recipientUpdateBtn = document.getElementById('recipientUpdate');
	var decryptBtn = document.getElementById('decrypt');
	var restoreBackupBtn = document.getElementById('restoreBackup');
	var restoreFileBtn = document.getElementById('restoreFile');
	
	/*var generatePublicKeyBtn = document.getElementById('generateKeyPair');
	var encryptTextFields = document.getElementById('encryptTextFields');
	var copyMyKeysBtn = document.getElementById('copyMyKeys');
	var addMyNewKeysBtn = document.getElementById('addMyNewKeys');
	var saveMyNewKeysBtn = document.getElementById('saveMyNewKeys');
	var addNewRecipientKeyBtn = document.getElementById('addNewRecipientKey');
	var saveNewRecipientKeyBtn = document.getElementById('saveNewRecipientKey');
	var encryptBtn = document.getElementById('encrypt');*/
	manageMyKeysBtn.addEventListener('click', function () {
		manageMyKeys();
	});
	generateKeyPairBtn.addEventListener('click', function () {
		generateKey(1024);
	});
	updateKeyBtn.addEventListener('click', function () {
		updateKey();
	});
	backupOptionBtn.addEventListener('click', function () {
		backupOption();
	});
	backupAllDataBtn.addEventListener('click', function () {
		backupAllData();
	});
	backupAllKeysBtn.addEventListener('click', function () {
		backupKeys();
	});
	managerecipientBtn.addEventListener('click', function () {
		manageRecipient();
	});
	addNewRecipientBtn.addEventListener('click', function () {
		addNewRecipient();
	});
	updateRecipientBtn.addEventListener('click', function () {
		updateRecipient();
	});
	deleteRecipientBtn.addEventListener('click', function () {
		manageRecipient();
	});
	encryptBtn.addEventListener('click', function () {
		var divList = ["manageKeyOptionDiv","updateKeyDiv","backupOptionDiv","menageRecipientDiv","recipientDetailsDiv","backupRestoreDiv"];
		hideAll(divList);
		
		$("#recipientListForEncryptDiv").removeClass("hide");
		$("#detailsDiv").removeClass("hide");
		selectRecipientForEncrypt();
	});
	saveMyKeyBtn.addEventListener('click', function () {
		var privetKey = $("#privetKey").val().trim();
		var publicKey = $("#publicKey").val().trim();
		saveMyKey(privetKey,publicKey);
	});
	saveRecipientBtn.addEventListener('click', function () {
		var email = $("#recipientEmail").val();
		var key = $("#recipientPublicKey").val();
		saveNewRecipient(email, key);
	});

	encryiptForRecipient.addEventListener('click', function () {
		injectTheScriptForEnctypt();
	});

	recipientUpdateBtn.addEventListener('click', function () {
		var e = document.getElementById("recipientList");
		var recipient = e.options[e.selectedIndex].value;
		var recipientPublicKey = $("#recipientPublicKey").val();
		recipientUpdate(recipient,recipientPublicKey);
	});

	decryptBtn.addEventListener('click', function () {
		injectTheScriptForEnctypt();
	});

	restoreBackupBtn.addEventListener('click', function () {
		var divList = ["updateKeyDiv"];
		hideAll(divList);
		$("#backupRestoreDiv").removeClass("hide");
	});

	restoreFileBtn.addEventListener('click', function () {
		var textType = /text.*/;
		var inputs = document.getElementById("uploadFile");
		const file = inputs.files[0];
		if (file.type.match(textType)) {
			var reader = new FileReader();
			reader.readAsText(file);	
			var content = reader.result;
			//var jsonData = JSON.parse(reader.result);
			var res = reader.result.split("::");
			if(res[0] == "publickey" && res[2] == "privetKey" && res[4] == "recipientList"){
				saveMyKey(res[3],res[1]);
			}
			
		} else {
			fileDisplayArea.innerText = "File not supported!"
		}
	});
	/*generatePublicKeyBtn.addEventListener('click', function () {
		generateKey(1024);
	});
	encryptTextFields.addEventListener('click', function () {
		injectTheScriptForEnctypt();
	});
	copyMyKeysBtn.addEventListener('click', function () {
		copyMyKeys();
	});
	saveMyNewKeysBtn.addEventListener('click', function () {
		saveMyNewKeys();
	});
	addMyNewKeysBtn.addEventListener('click', function () {
		addMyNewKeys();
	});
	addNewRecipientKeyBtn.addEventListener('click', function () {
		$("#recipientDetailsDiv").css({ display: "block" });
		//addNewRecipientKey();
	});
	saveNewRecipientKeyBtn.addEventListener('click', function () {
		var email = $("#recipientEmail").val();
		var key = $("#recipientPublicKey").val();
		saveNewRecipientKey(email, key);
	});
	encryptBtn.addEventListener('click', function () {
		selectRecipient();
	});*/
	// copyPrivetKeyBtn.addEventListener('click', function() {
	// 	copyText('copyPrivetKeyBtn');
	// });
	// copyPublicKeyBtn.addEventListener('click', function() {
	// 	copyText('copyPublicKeyBtn');
	// });

	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			console.log(new Date(), 'message is ', request.inputContent);
			
			if (request.inputType == "text") {
				if (request.inputContent != "") {
					var inputText = request.inputContent;
					var inputId = request.inputId;
					var responseText = '';
					if (inputText.includes('[enc]')) {
						var e = document.getElementById("recipientListForEncrype");
						var recipient = e.options[e.selectedIndex].value;
						console.log(new Date(), 'sending to encrypt');
						var crypt = new JSEncrypt();
						chrome.storage.local.get("recipientList", function (value) {
							var recipients = value.recipientList;
							if(recipients != null){
								var json = recipients;// JSON.parse(recipients);
								for (var key in json) {
									if (json.hasOwnProperty(key)) {
										var email = json[key].email;
										var key = json[key].key;
										if(email == recipient){
											key = key;
											crypt.setPrivateKey(key);
											var responseText = crypt.encrypt(inputText.substring(5));
											responseText = '[dec]' + responseText;
											sendResponse({ responseMessage: responseText, inputId: inputId });
											break;
										}
										
									}
								}
							}
						});
						
						//var key = getRecipient(recipient);
						/*chrome.storage.local.get("privetkey", function (value) {
							console.log('get ' + value.privetkey);
							var key = value.privetkey;
							crypt.setPrivateKey(key);
							var responseText = crypt.encrypt(inputText.substring(5));
							responseText = '[dec]' + responseText;
							sendResponse({ responseMessage: responseText, inputId: inputId });

						}); */
						console.log('res text 1 ', responseText);
					} else if (inputText.includes('[dec]')) {
						var crypt = new JSEncrypt();
						chrome.storage.local.get("privetkey", function (value) {
							var key = value.privetkey;
							crypt.setPrivateKey(key);
							var responseText = crypt.decrypt(inputText.substring(5));
							responseText = '[enc]' + responseText;
							sendResponse({ responseMessage: responseText, inputId: inputId });
						});
						console.log(new Date(), 'sending to decrypt');


						//responseText = decrypt(inputText.substring(5));
						console.log('res text 1 ', responseText);
					}
				} else {
					console.log(new Date(), 'sending response 0');
					sendResponse({ responseMessage: 'empty text' }); // snub them.
				}
			} else if (request.inputType == "file") {
				var inputId = request.inputId;
				file = request.inputContent;
				var crypt = new JSEncrypt();
				chrome.storage.local.get("privetkey", function (value) {
					var key = value.privetkey;
					crypt.setPrivateKey(key);
					responseText = crypt.encrypt(file);
					sendResponse({ responseMessage: responseText, inputId: inputId });
				});
			}
			return true;
		});

});

function saveMyKey(privetKey,publicKey){
	//var privetKey = $("#privetKey").val().trim();
	//var publicKey = $("#publicKey").val().trim();
	if(privetKey == null || privetKey == ''){
		alert("privetKey can not be mepty");
	}else if(publicKey == null || publicKey == ''){
		alert("publicKey can not be mepty");
	}
	chrome.storage.local.set({ publickey: publicKey }, function () {
		console.log('save ' + publicKey); // 1
	});
	chrome.storage.local.set({ privetkey: privetKey }, function () {
		console.log('save ' + privetKey); // 1
	});
}

function manageMyKeys(){
	var divList = ["updateKeyDiv","backupOptionDiv","menageRecipientDiv","recipientDetailsDiv","recipientListDiv","recipientListForEncryptDiv","backupRestoreDiv"];
	hideAll(divList);
	$("#manageKeyOptionDiv").removeClass("hide");
	$("#detailsDiv").removeClass("hide");
}

function updateKey(){
	var divList=["backupRestoreDiv"];
	hideAll(divList);
	$("#updateKeyDiv").removeClass("hide");
}
function backupOption(){
	var divList = ["manageKeyOptionDiv","updateKeyDiv","menageRecipientDiv","recipientDetailsDiv","recipientListDiv","recipientListForEncryptDiv","backupRestoreDiv"];
	hideAll(divList);
	$("#detailsDiv").removeClass("hide");
	$("#backupOptionDiv").removeClass("hide");
}

function backupAllData(){
	chrome.storage.local.get("recipientList", function (value) {
		if (value != null) {
			var recipients = value.recipientList;
			if (recipients != null) {
				var recipientList = JSON.stringify(recipients);
				recipientList = "recipientList::"+recipientList;
				chrome.storage.local.get("privetkey", function (value) {
					var privetKey = value.privetkey;
					recipientList = "::privetKey::"+privetKey+"\r\n"+recipientList;
					chrome.storage.local.get("publickey", function (value) {
						var privetKey = value.publickey;
						recipientList = "publickey::"+privetKey+"\r\n"+recipientList;
						var blob = new Blob([recipientList], {type: "text/plain"});
						var url = URL.createObjectURL(blob);
						chrome.downloads.download({
							url: url 
						});
					});
				});
				
				
			}
		}
	});
	
}

function backupKeys(){
	chrome.storage.local.get("privetkey", function (value) {
		var privetKey = value.privetkey;
		var myKeys = "::privetKey::"+privetKey+"\r\n";
		chrome.storage.local.get("publickey", function (value) {
			var privetKey = value.publickey;
			myKeys = "publickey::"+privetKey+"\r\n"+myKeys;
			var blob = new Blob([myKeys], {type: "text/plain"});
			var url = URL.createObjectURL(blob);
			chrome.downloads.download({
				url: url 
			});
		});
	});
}

function manageRecipient(){
	var divList = ["recipientDetailsDiv","backupOptionDiv","updateKeyDiv","manageKeyOptionDiv","recipientListForEncryptDiv","backupRestoreDiv"];
	hideAll(divList);
	$("#detailsDiv").removeClass("hide");
	$("#menageRecipientDiv").removeClass("hide");
}
function addNewRecipient(){
	var divList = ["updateRecipientDiv","recipientListDiv","recipientListForEncryptDiv","backupRestoreDiv"];
	hideAll(divList);
	$("#recipientDetailsDiv").removeClass("hide");
	$("#recipientEmailDiv").removeClass("hide");
	$("#saveRecipientDiv").removeClass("hide");
}
function updateRecipient(){
	var divList = ["saveRecipientDiv","recipientEmailDiv","recipientListForEncryptDiv","backupRestoreDiv"];
	hideAll(divList);
	$("#recipientDetailsDiv").removeClass("hide");
	$("#recipientListDiv").removeClass("hide");
	$("#updateRecipientDiv").removeClass("hide");
	selectRecipient();
}

function generateKey(keySize) {
	var crypt = new JSEncrypt({ default_key_size: keySize });
	crypt.getKey();
	var publicKey = crypt.getPublicKey();
	chrome.storage.local.set({ publickey: publicKey }, function () {
		console.log('save ' + publicKey); // 1
	});
	var privetKey = crypt.getPrivateKey();
	chrome.storage.local.set({ privetkey: privetKey }, function () {
		console.log('save ' + privetKey); // 1
	});
	//alert(key);
}

function encrypt(input) {
	var crypt = new JSEncrypt();
	chrome.storage.local.get("privetkey", function (value) {
		console.log('get ' + value.privetkey);
		var key = value.privetkey;
		crypt.setPrivateKey(key);
		console.log('key in ' + key);
		var output = crypt.encrypt(input);
		//return output;
		getUrls(request, sender, sendResponse, output);
	});

}

function copyMyKeys() {
	$("#privetKeyDiv").css({ display: "block" });
	$("#publicKeyDiv").css({ display: "block" });
	chrome.storage.local.get("privetkey", function (value) {
		$("#privetKey").val(value.privetkey);
	});
	chrome.storage.local.get("publickey", function (value) {
		$("#publicKey").val(value.publickey);
	});
}


/*function copyText(id) {
	var copyText = document.getElementById(id);
	copyText.select();
	document.execCommand("copy");
}*/
function addMyNewKeys() {
	$("#privetKeyDiv").css({ display: "block" });
	$("#privetKey").prop('readonly', false);
	$("#publicKeyDiv").css({ display: "block" });
	$("#publicKey").prop('readonly', false);
	$("#saveMyNewKeys").css({ display: "block" });

}
function saveMyNewKeys() {
	chrome.storage.local.set({ publickey: $("#publicKey").val() }, function () {
		console.log('save ' + publicKey); // 1
	});

	chrome.storage.local.set({ privetkey: $("#privetKey").val() }, function () {
		console.log('save ' + privetKey); // 1
	});
}

function saveNewRecipient(recipientEmail, recipientKey) {
	var recipients = null;
	chrome.storage.local.get("recipientList", function (value) {
		if (value != null) {
			var recipients = value.recipientList;
			if (recipients != null) {
				var obj =recipients;//JSON.parse(recipients);
				/*Object.assign(obj, [
					{
						"email": recipientEmail,
						"key": recipientKey
					}
				]);*/
				var newRecipient = {
					"email": recipientEmail,
					"key": recipientKey
				};
				obj[Object.keys(obj).length] = newRecipient;
				recipients = obj;//JSON.stringify(obj);
			} else {
				var obj = [{ "email": recipientEmail, "key": recipientKey }];
				//recipients = JSON.stringify(obj);
				recipients = obj;
			}
			chrome.storage.local.set({ "recipientList": recipients }, function () {
				console.log("saved");
			});
		}
	});
}

function selectRecipient() {
	//$("#recipientListDiv").removeClass("hide");
	chrome.storage.local.get("recipientList", function (value) {
		var recipients = value.recipientList;
		if(recipients != null){
			$('#recipientList').empty();
			var json = recipients;// JSON.parse(recipients);
			var newOption1 = $('<option>');
			newOption1.attr('value', null).text("Select Recipient");
			$('#recipientList').append(newOption1);
			for (var key in json) {
				if (json.hasOwnProperty(key)) {
					var newOption = $('<option>');
					newOption.attr('value', json[key].email).text(json[key].email);
					$('#recipientList').append(newOption);
				}
			}
		}
	});


}

function selectRecipientForEncrypt() {
	//$("#recipientListDiv").removeClass("hide");
	chrome.storage.local.get("recipientList", function (value) {
		var recipients = value.recipientList;
		if(recipients != null){
			$('#recipientListForEncrype').empty();
			var json = recipients;// JSON.parse(recipients);
			var newOption1 = $('<option>');
			newOption1.attr('value', null).text("Select Recipient");
			$('#recipientListForEncrype').append(newOption1);
			for (var key in json) {
				if (json.hasOwnProperty(key)) {
					var newOption = $('<option>');
					newOption.attr('value', json[key].email).text(json[key].email);
					$('#recipientListForEncrype').append(newOption);
				}
			}
		}
	});


}

function getRecipient(recipientEmail){
	chrome.storage.local.get("recipientList", function (value) {
		var recipients = value.recipientList;
		if(recipients != null){
			var json = recipients;// JSON.parse(recipients);
			for (var key in json) {
				if (json.hasOwnProperty(key)) {
					var email = json[key].email;
					var key = json[key].key;
					if(email == recipientEmail){
						return key;
					}
					
				}
			}
		}
	});
}

function recipientUpdate(recipientEmail,newKey){
	chrome.storage.local.get("recipientList", function (value) {
		var recipients = value.recipientList;
		if(recipients != null){
			var json = recipients;// JSON.parse(recipients);
			for (var key in json) {
				if (json.hasOwnProperty(key)) {
					var jsonObject = json[key];
					var email = json[key].email;
					if(email == recipientEmail){
						json[key].key = newKey;	
					}
					
				}
			}
			chrome.storage.local.set({ "recipientList": recipients }, function () {
				console.log("saved");
			});
		}
	});
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

function injectTheScriptForEnctypt() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		// query the active tab, which will be only one tab
		//and inject the script in it
		chrome.tabs.executeScript(tabs[0].id, { file: "content_script.js" });
	});

}

function hideAll(divList){
	var x;
	for (x in divList) {
		  	var div = divList[x];
		  	if(!$( "#mydiv" ).hasClass( "foo" )){
				$("#"+div).addClass("hide");
			}
	}
	
}
