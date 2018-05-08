
// IMPORTANT! remember to use this global switch before publishing!!!
var MODE = 'LIVE';
//var MODE = 'DEV';

var api_url;
var web_url;
var selectedDomain;

//const baetTokenKey = 'baet-jwt';
var baetToken;


if (MODE=='LIVE') {
	api_url = 'https://api.baet.no';
	web_url = 'https://baet.no';
	selectedDomain = 'baet.no';
}
else {
	// DEV mode by default
	api_url = 'http://localhost:4042';
	web_url = 'http://localhost:4042';
	selectedDomain = 'baet.no';
}


function initPopup() {
	
	document.getElementById('make-link').value = chrome.i18n.getMessage('shorten');

    document.getElementById('img-mainlogo').src = 'images/mainlogo_baet.png';
    document.getElementById('img-mainlogo').alt = 'BAET.NO';
	
	//urlsSelect();
	chrome.windows.getCurrent(function(w) {
		wid = w.id;
		chrome.tabs.getSelected(wid, function(t) {
			if (t.url.substr(0, 7) == 'http://' || t.url.substr(0, 8) == 'https://') {
				//-document.getElementById('param_long_link').value = t.url;
				document.getElementById('param_long_link').innerText = t.url;
			}
		});
	});

	document.getElementById('param_long_link').addEventListener('keyup', function(event) {
		if (event.keyCode != 13) {
			document.getElementById('result_makeDizLink').style.display = 'none';
			document.getElementById('div_makeDizLink').style.display = 'block';
			clearError();
		}
	}, false);
	
	delete init;

	
	toastr.options = {
		  "closeButton": true,
		  "debug": false,
		  "positionClass": "toast-bottom-right",
		  "onclick": null,
		  "showDuration": "300",
		  "hideDuration": "1000",
		  "timeOut": "2000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		};
};


function makeDizLink() {
	
	if (MODE!='LIVE') console.log("makeDizLink>> ");
	event.preventDefault();
	
	clearError();
	
	if (MODE!='LIVE') console.log("makeDizLink>> "+ " | api_url: "+api_url );
	
	document.getElementById('result_makeDizLink').style.display = 'none';
	document.getElementById('div_makeDizLink').style.display = 'block';
	//-document.getElementById('short_link').value = '';

	//-var long_link = document.getElementById('param_long_link').value;
	var long_link = document.getElementById('param_long_link').innerText;
	
	if (MODE!='LIVE') console.log("makeDizLink>> "+ "long_link: "+long_link + " | api_url: "+api_url );

	if (long_link != '') {
		if (isValidUrl(long_link) == true) {
			document.getElementById('loading').style.display = 'block';
			
			if (selectedDomain==undefined) selectedDomain='baet.no';
			var data = '{"long_link": "'+long_link+'"' + ',"domain":"'+selectedDomain+'"' + '}';
			var xhr = new XMLHttpRequest();
			xhr.open('POST', api_url+'/links', true);
			xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + baetToken);
			xhr.onreadystatechange = function() {
				document.getElementById('loading').value = xhr.readyState;
				if (xhr.readyState == 4) {
					document.getElementById('loading').value = xhr.readyState;
					document.getElementById('loading').style.display = 'none';
					document.getElementById('loading').value = 0;
					if (xhr.getAllResponseHeaders() != '') {
						var response = JSON.parse(xhr.responseText);
                        if (MODE!='LIVE') console.log(JSON.stringify(response));
						if (response.errors == undefined) {
							document.getElementById('short_link').innerText = web_url+'/'+response['short_link'];
							document.getElementById('test_short_link').href = web_url+'/'+response['short_link'];
							document.getElementById('copy_short_link').value = web_url+'/'+response['short_link'];
							document.getElementById('result_makeDizLink').style.display = 'block';
							document.getElementById('div_makeDizLink').style.display = 'none';
						} else {
							showError('general_error', response.message); //JSON.stringify(response) );
						}
					} else {
						showError('network_error', '');
					}
				}
			};
			xhr.send(data);
		} else {
			showError('url_not_valid', '');
		}
	}
};

function isValidUrl(url) {
	
	if (url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://') {
		return true;
	} else {
		return false;
	}
};

function urlsSelect() {
	chrome.windows.getAll({'populate': true}, function(windows) {
		windows.forEach(function(w) {
			w.tabs.forEach(function(t) {
				if (isValidUrl(t.url) == true) {
					document.getElementById('urls').innerHTML += '<option>'+String(t.url)+'</option>';
				}
			});
		});
	});
};

function showError(type, message) {
	document.getElementById('loading').style.display = 'none';
	document.getElementById('loading').value = 0;
	document.getElementById('result_makeDizLink').style.display = 'none';
	document.getElementById('result_makeDizLink').innerText = '';
	document.getElementById('error').innerText = chrome.i18n.getMessage(type);
	if (message != '') {
		document.getElementById('error').innerText += ' ('+String(message)+')';
	}
	//-document.getElementById('error').innerText = '<i class="fa fa-warning fa-2x fa-fw"></i> ' + document.getElementById('error').innerText;
	document.getElementById('error').style.backgroundImage = 'url(images/'+type+'.png)';
	document.getElementById('error').style.display = 'block';
};

function clearError() {
	document.getElementById('error').style.display = 'none';
	document.getElementById('error').innerText = '';
	//document.getElementById('error_alert').style.display = 'none';
	//document.getElementById('error_alert').innerText = '';
};

// --- COPY to Clipboard! ---
function copyLinkToClipboard() {
	
	event.preventDefault();
	var textToCopy = document.getElementById('short_link').innerText;
	if (MODE!='LIVE') console.log("textToCopy>> " + textToCopy);
	
    var copyFrom = $('<textarea/>');
    copyFrom.text(textToCopy);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy', false);
    copyFrom.remove();
    toastr.info("<em>copied #baet!</em><br> <strong>"+textToCopy+"</strong>");
}

function openLink(url) {
	//chrome.tabs.create({'url': url});
	switch (window.localStorage.getItem('link_target')) {
		case null:
		case undefined:
		case 'new_tab':
			chrome.tabs.create({'url': url});
			break;
		case 'active_tab':
			chrome.windows.getCurrent(function(w) {
				wid = w.id;
				chrome.tabs.getSelected(wid, function(t) {
					tid = t.id;
					chrome.tabs.update(tid, {'url': url});
				});
			});
			break;
		case 'new_window':
			chrome.windows.create({'url': url});
			break;
	}
	
	window.close();
	
};


//Shorthand for document.querySelector.
function select(selector) {
	return document.querySelector(selector);
};

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'BAET-2018-chrome-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
    });
    return uuid;
}
function loadVerifyJwtToken() {
    chrome.storage.sync.get(['baet-jwt'], function(result) {
        baetToken = result['baet-jwt'];

        if (MODE!='LIVE') {
            console.log("local storage >> " + JSON.stringify(result) );
        }

        if (baetToken != undefined) {
            if (MODE!='LIVE') {
                console.log("found it!!! >> " + baetToken );
            }
        }
        else {
            // create a new user
            var userId = generateUUID();

            var user = {};
            user['userid'] = userId;
            user['password'] = userId;
            user['extra'] = {};
            user['extra']['client'] = 'chrome-extension';
            user['extra']['name'] = chrome.runtime.getManifest().name;
            user['extra']['version'] = chrome.runtime.getManifest().version;

            if (selectedDomain==undefined) selectedDomain='baet.no';
            //var data = '{' + '"userid":"'+dizlinkCookieID+'"' + ',"client":"chrome-extension"' + ',"domain":"'+selectedDomain+'"' + '}';
            var data = {};
            data['userid'] = user['userid'];
            data['password'] = user['password'];
            data['extra'] = user['extra'];
            var xhr = new XMLHttpRequest();
            xhr.open('POST', api_url+'/users', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function() {
                document.getElementById('loading').value = xhr.readyState;
                if (xhr.readyState == 4) {
                    document.getElementById('loading').value = xhr.readyState;
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('loading').value = 0;
                    if (xhr.getAllResponseHeaders() != '') {
                        var response = JSON.parse(xhr.responseText);
                        if (response['errors'] == undefined) {
                            var data = {};
                            data['userid'] = user['userid'];
                            data['password'] = user['password'];
                            data['strategy'] = "local";
                            var xhr2 = new XMLHttpRequest();
                            xhr2.open('POST', api_url+'/authentication', true);
                            xhr2.setRequestHeader('Content-Type', 'application/json');
                            xhr2.onreadystatechange = function() {
                                document.getElementById('loading').value = xhr2.readyState;
                                if (xhr2.readyState == 4) {

                                    var response2 = JSON.parse(xhr2.responseText);
                                    if (response2['errors'] == undefined) {
                                        baetToken = response2['accessToken'];

                                        chrome.storage.sync.set({'baet-jwt': baetToken}, function() {
                                            if (MODE!='LIVE') {
                                                console.log("stored! baetToken >> " + baetToken );
                                            }
                                        });

                                        document.getElementById('result_makeDizLink').style.display = 'none';
                                        document.getElementById('div_makeDizLink').style.display = 'block';
                                    } else {
                                        showError('general_error', response2.message);
                                    }
                                }
                            };
                            xhr2.send(JSON.stringify(data));
                        } else {
                            showError('general_error', response.message);
                        }
                    } else {
                        showError('network_error', '');
                    }
                }
            };
            xhr.send(JSON.stringify(data));
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {

	initPopup();
    loadVerifyJwtToken();

	document.getElementById('div_makeDizLink').addEventListener('submit', makeDizLink);

	document.getElementById('result_makeDizLink').addEventListener('submit', copyLinkToClipboard);
	
});
