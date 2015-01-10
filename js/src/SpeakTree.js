var SpeakTree = new function(){
	this.SDB = new SDB();
	this.characters = [];
}

SpeakTree.prototype.setSDB = function(path){
	var that = this;
	var request = new XMLHttpRequest();
	request.open('GET', path, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var data = JSON.parse(request.responseText);

	    //Code once data has been parsed
	    for(var i = 0; i < data.length; i++){
	    	var sdbClass = data[i];
	    	that.SDB.addClass(new SDBClass(sdbClass.class, sdbClass.types, sdbClass.isBoolean, sdbClass.min, sdbClass.max, sdbClass.defaultVal));
	    }

	  }
	};

	request.onerror = function() {
	  alert("Unable to parse SDB from this path: " + path);
	};

	request.send();
};

SpeakTree.prototype.setCharacters = function(path){
	var that = this;
	var request = new XMLHttpRequest();
	request.open('GET', path, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var data = JSON.parse(request.responseText);

	    var chars = data.characters;
	    for(var i = 0; i < chars.length; i++){
	    	that.characters.push(new Character(chars[i]));
	    }
	    that.characters.push(new Character("World"));
	    that.characters.push(new Character("Player"));

	    var characteristics = data.characteristics;
	    for(var j = 0; j < characteristics.length; j++){
	    	for(var k = 0; k < that.characters; k++){
	    		if(characteristics[j].name === that.characters[k].name){
	    			var sdbClass = that.SDB[characteristics[j].class];
	    			if(sdbClass[characteristics[j].type]){

	    				that.characters[k].addCharacteristic(characteristics[j].class, characteristics[j].type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);

	    				that.characters[k].parseExpression(characteristics[j].class, characteristics[j].type, "=", characteristics[j].value);
	    			}
	    		}
	    	}


	    }

	    //Code once data has been parsed
	    for(var i = 0; i < data.length; i++){
	    	var characters = data[i];
	    	that.SDB.addClass(new SDBClass(sdbClass.class, sdbClass.types, sdbClass.isBoolean, sdbClass.min, sdbClass.max, sdbClass.defaultVal));
	    }

	  }
	};

	request.onerror = function() {
	  alert("Unable to parse characters from this path: " + path);
	};

	request.send();
};