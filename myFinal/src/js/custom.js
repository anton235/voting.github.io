// Offset for Site Navigation
var customJS = (function () {
    function scrollToContact () {
		$("#contact-btn").on("click", function () {
			$("html, body").animate({ 
				scrollTop: $('#contact-section').offset().top 
			}, 1000);
		});
    }
    function init () { // now we'll need to initialize our functions
    	scrollToContact();
    }
    
    return { // and return it
        init: init
    };
})(); // attention, module needs to be a self-invoking function-expression, don't forget the (); in the end
$(document).ready(function () { // then we just call our module.init when everything is ready
    customJS.init();
});