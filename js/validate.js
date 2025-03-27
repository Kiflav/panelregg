(function($) {

/** Client-side validation */
function setFieldCss(element, valid) {

    if(valid) {
        $(element).removeClass('t-error');
		if($( '#terms' ).hasClass( 't-error' )){
			$( '#uniform-terms' ).addClass('t-error');	
	 	} else {
	 	$( '#uniform-terms' ).removeClass('t-error');	
	 	}
    } else {
        $(element).addClass('t-error');		 
		 if($( '#terms' ).hasClass( 't-error' )){
			$( '#uniform-terms' ).addClass('t-error');	
	 	} else {
	 	$( '#uniform-terms' ).removeClass('t-error');	
	 	}
    }
}


function validateField(element, message) {
    // Show the checkmark
    setFieldCss(element, true);
}

function invalidateField(element, message, messageField) {
    var errorMessage = $('<li id="validate-' + $(element).attr('id') + '">' + message + '</li>');
    
    // Show the icon
    setFieldCss(element, false);
    
    // Add message to form errors
    if(messageField) {
        messageField.replaceWith(errorMessage);
    } else {
        $('#form-errors').append(errorMessage);
    }
}

function toggleMessages() {
    if($('#form-errors').children().length <= 0) {
        $('#form-errors').hide();
    } else {
        $('#form-errors').show();
        $('.validation-error').hide();
    }
}



function checkField(element) {
    // Remove old error messages
    var messageBox = $("#form-errors #validate-" + $(element).attr('id'));
    if(messageBox.length <= 0) {
         messageBox = null;
    }
    if($(element).hasClass('notempty')
		&& ($(element).val().length <= 0
        	|| $(element).val() == $(element).attr('placeholder'))) // IE9: Also invalid if equals placeholder
    {
    	// Check the presence of user input
        invalidateField(element, $(element).data('validate-empty'), messageBox);
        return false;
    }
    
    if($(element).hasClass('firstname') && ($(element).val().indexOf('@') > 0))
    {	
    	 const regex1 = /^[A-Za-zÀ-ȕ0-9+_.-]+@[A-Za-zÀ-ȕ0-9.-]+$/;
      	 if (!regex1.test($(element).val().toLowerCase())) {
      	     invalidateField(element, $(element).data('validate-nofirstname'), messageBox);
			 return false;
      	 }
	} else if($(element).hasClass('firstname') && ($(element).val().indexOf('@') <= 0)) {
	    const regex2 = /^[A-Za-zÀ-ȕ0-9+. ]+$/; 
	    if (!regex2.test($(element).val().toLowerCase())) {
      	     invalidateField(element, $(element).data('validate-nofirstname'), messageBox);
			 return false;
      	 }
	}
	
    if($(element).hasClass('password')
		&& $(element).val().length < 6) 
	{
        // Check minimum password length
        invalidateField(element, $(element).data('validate-tooshort'), messageBox);
        return false;
    }
    if($(element).hasClass('email')
		&& !/(.+)@(.+)\.(.+)/.test($(element).val()))
	{
		invalidateField(element, $(element).data('validate-noaddr'), messageBox);
		return false;
	}
    if($(element).hasClass('validate-gender'))	{
    		var genderchecked = false;
    		$(element).find("input").each(function() {
    			if($(this).is(":checked")){
    				genderchecked=true
    			}
    		});
    		if(genderchecked == false){
    			invalidateField(element, $(element).data('validate-empty'), messageBox);
        		return false;
    		}
    }
    if($(element).hasClass('checked'))	{	
    	if(!$(element).is(":checked")){
        invalidateField(element, $(element).data('validate-unchecked'), messageBox);
        return false;
    	}
    }
   
   
    // Succesfully validated
    validateField(element);
    if(messageBox != null) {
        messageBox.remove();
    }
    return true;
}

function checkForm(form) {
    var valid = true;
    $(form).find('.validate').each(function() {
        if(!checkField(this)) {
            valid = false;
        }
    });
    
    return valid;
}

$(function() {
    toggleMessages();

    $('#registrationForm .validate').change(function(event) {
        checkField(this);
        toggleMessages();
    });
    
    $('#registrationForm').submit(function() {
        var valid = checkForm(this);
        toggleMessages();
        return valid;
    });
});

})(jQuery);