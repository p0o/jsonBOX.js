$(function() {
	$.fn.jsonbox = function(data , options) {
		var obj,settings,box;
		// settings
		settings = this.extend(
		  {
		  	  filter: null,
		  	  target: null,
		  	  sort:true
		  },options);

		var _elm = [];
		var filterArray,fieldName;

		//add class to holder
		this.addClass('jsonbox-holder');

		// crawling throw the object to get the filtered object
		obj = data;
		if (settings.filter !== null) {
			filterArray = settings.filter.split('->');
			for (var _index=0;_index < filterArray.length-1;_index++)
				obj = obj[filterArray[_index]];
			// name of the json field needed to be in listbox
			fieldName = filterArray[filterArray.length-1];
		} 
		console.log(fieldName);
		
		// sort if needed
		if(settings.sort)
			obj.sort(compare);

		// create the select box
		box = this.html(document.createElement('select')).find('select').addClass('jsonbox');

		// Iterate through object to fill listbox
		$.each(obj ,function(key,val) {
			if (typeof(val[fieldName]) === 'object')
				val = key; 
			box.append(document.createElement('option')).find('option:last-child').val(key).html(val[fieldName]);
		});

		// create add and edit buttons
		this.append(document.createElement('div')).find('div').addClass('jsonbox-buttons-holder');

		this.find('.jsonbox-buttons-holder').append(document.createElement('a'));
		this.find('.jsonbox-buttons-holder').find('a:last-child').addClass('jsonbox-button').html('Add')
		.on('click',function(e) {
			// hook for add click
			e.preventDefault();

		 	var popup = $(this).parent().append(document.createElement('div'))
		 		.find('div:last-child').addClass('jsonbox-popup');
		 	// create add form 
		 	popup.append(document.createElement('input')).find('input')
		 		.prop('placeholder','New Item').css({'width':'80%','margin':'10% 10% 0 10%','text-align':'center'});
		 	popup.append(document.createElement('button')).find('button:last-child')
		 	.text('Save new item').css({'display':'block','margin':'5px auto'})
		 	.on('click',function(e) {
		 		// hook for Save new Item button ( when saving a new item in popup)
		 		e.preventDefault();
		 		var item = popup.find('input').val();
		 		obj[obj.length] = new Object;
		 		obj[obj.length-1][fieldName] = item;
		 		obj.sort(compare);
		 		// update the targeted element with edited json
		 		updateListBox($(this).parent().parent().parent(),obj,fieldName);
		 		// Destroy the popup element
		 		popup.fadeOut(250,function(){ popup.remove();});
		 		
		 	});
		 	// close window if user clicked anywehere else
		 	popup.find('input').focus().
		 	focusout(function() {
		 		popup.fadeOut(250,function(){ popup.remove();});
		 	});
		 	

		 });
		this.find('.jsonbox-buttons-holder').append(document.createElement('a'));
		this.find('.jsonbox-buttons-holder > a:last-child').addClass('jsonbox-button').html('Delete')
		.on('click',function(e) {
			// hook for delete click
			e.preventDefault();
		 	var itemIndex = $(this).parent().parent().find('select').val();
		 	delete obj[itemIndex];
		 	obj.sort(compare);

		 	// update the targeted element with edited json
		 	updateListBox($(this).parent().parent(),obj,fieldName);


		 });

		// function  to help javascript sort function works based on filtered fieldname
		var compare = function(a,b) {
			if (a[fieldName] < b[fieldName])
				return -1;
			else if (a[fieldName] > b[fieldName])
				return 1;
			return 0;
		}

		var updateListBox = function(_this,obj,field) {
			//update the select box with new data
			var _box,_elm=[];
			console.log(obj);
			_box = _this.find('.jsonbox').html('');

			for (var val in obj)
				_elm.push(obj[val][field]);
			

			$.each(_elm ,function(key,val) {
				if (typeof(val) === 'object')
					val = key; 
				_box.append(document.createElement('option')).find('option:last-child').val(key).html(val);
			});

			// update target
			$(settings.target).text(JSON.stringify(data));
		}

		return this;
	};

}(jQuery));

