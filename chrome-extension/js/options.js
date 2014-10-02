
var DizLinkPopupOptions = new (function() {
//function initOptions() {
	
	this.initPopupOptions = function() {
		document.getElementById('headline').innerText = chrome.i18n.getMessage('headline');
		document.getElementById('options').innerText = chrome.i18n.getMessage('options');
		document.getElementById('open_links_in').innerText = chrome.i18n.getMessage('open_links_in');
		
		var link_target = window.localStorage.getItem('link_target');
		if (link_target == undefined || link_target == null) {
			link_target = 'new_tab';				
		}

		var link_target_options = [
			{'id': 'new_tab', 'text': chrome.i18n.getMessage('new_tab')},
			{'id': 'active_tab', 'text': chrome.i18n.getMessage('active_tab')},
			{'id': 'new_window', 'text': chrome.i18n.getMessage('new_window')}
		];

		for (var i = 0; i < link_target_options.length; i++) {
			document.getElementById('link_target').innerHTML += '<option id="'+link_target_options[i].id+'"'+(link_target == link_target_options[i].id ? ' selected="selected"' : '')+'>'+link_target_options[i].text+'</option>';
		}
		
		delete init;
	};
//	}
})();

document.addEventListener("DOMContentLoaded", function () {
	DizLinkPopupOptions.initPopupOptions();
	});