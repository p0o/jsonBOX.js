// jsonBOX jQuery Plugin - Developed by Pooria Attarzadeh  ||  http://pooria.co
// I developed this plugin for a specific project but now I'm adding more 
// features so it can be useful for other devs too. 
// Sorry for the mess with style codes. I'm planning to move the view codes to 
// a css file soon.

$(function() {
	$.fn.jsonbox = function(data , options) {
		var obj,settings;
		// plugin settings
		settings = this.extend(
		  {
		  	  filter: null,
		  	  target: null,
		  	  sort:true,
		  	  popupTheme: {
		  	  	'position':'absolute',
		  	  	'width':'40%',
		  	  	'top':'25%',
		  	  	'left':'30%',
		  	  	'height':'150px',
		  	  	'background':'#fff',
		  	  	'border':'2px solid',
		  	  	'border-radius':'5px'
		  	  }
		  },options);

		var _elm = [];
		var filterArray,fieldName;
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

		// put filtered object into an array
		$.each(obj , function(key,val) {
			_elm.push(val[fieldName]);
			console.log('key:%s  val:%s',key,val[fieldName]);
		});
		

		var box;
		// put catched elements into a selectbox to edit
		box = this.html(document.createElement('select')).find('select').addClass('jsonbox');
		$.each(_elm ,function(key,val) {
			if (typeof(val) !== 'string')
				val = key; 
			box.append(document.createElement('option')).find('option:last-child').val(key).html(val);
		});

		//add some nesessory style
		this.css('width',this.find('.jsonbox').width());

		// create add and edit buttons
		var btnStyle = {
			'display':'inline-block',
			'width':'auto',
			'text-align':'center',
			'padding':'5px',
			'border-bottom-right-radius':'4px',
			'border-bottom-left-radius':'4px',
			'background':'#eee',
			'font-size':'11px'
		};
		// positioning buttons below the select box (a little ugly but you won't need to change it!)
		this.append(document.createElement('div'));
		this.find('div').css({'display':'block','text-align':'right'}).addClass('jsonbox-buttons');
		this.find('.jsonbox-buttons').append(document.createElement('a'));
		this.find('.jsonbox-buttons').find('a:last-child').css(btnStyle).prop('href','#').html('Add').on('click',function(e) {
			e.preventDefault();
			// hook for add click
		 	var popup = $(this).parent().append(document.createElement('div')).find('div:last-child').css(settings.popupTheme);
		 	// create add form 
		 	popup.append(document.createElement('input')).find('input').prop('placeholder','New Item').css({'width':'80%','margin':'10% 10% 0 10%','text-align':'center'});
		 	popup.append(document.createElement('button')).find('button:last-child').text('Add').css({'display':'block','margin':'5px auto'}).on('click',function(e) {
		 		e.preventDefault();
		 		var item = popup.find('input').val();
		 		obj[obj.length] = new Object;
		 		obj[obj.length-1][fieldName] = item;
		 		obj.sort(compare);
		 		updateListBox($(this).parent().parent().parent(),obj,fieldName);
		 		popup.fadeOut(250,function(){ popup.remove();});
		 		
		 	});
		 	// close window if user clicked anywehere else
		 	popup.find('input').focus().
		 	focusout(function() {
		 		popup.fadeOut(250,function(){ popup.remove();});
		 	});
		 	

		 });
		this.find('.jsonbox-buttons').append(document.createElement('a'));
		this.find('.jsonbox-buttons > a:last-child').css(btnStyle).prop('href','#').html('Delete').on('click',function(e) {
			e.preventDefault();
		 	// hook for delete click
		 	var placeholderObj = [];
		 	var itemIndex = $(this).parent().parent().find('select').val();
		 	delete obj[itemIndex];
		 	obj = $.grep(obj,function(n) { return(n);});
		 	obj.sort(compare);

		 	// fill the object in proper location of main object
		 	// first create a free placeholder to save the correct path
		 	//data[filterArray[0]][fieldName] = obj;
		 	// now extend two objects
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
				if (typeof(val) !== 'string')
					val = key; 
				box.append(document.createElement('option')).find('option:last-child').val(key).html(val);
			});

			// update target
			$(settings.target).text(JSON.stringify(obj));
		}

		return this;
	};

}(jQuery));
