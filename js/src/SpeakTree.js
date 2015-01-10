var SpeakTree = new function(){
	this.SDB = new SDB();
	this.characters = [];
}

// SpeakTree.setSDB(String path)
// Set up the SDB of the SpeakTree
// ARGUMENTS:
//	path(String) - the file path to the local json file representing the SDB
// RETURN void
SpeakTree.prototype.setSDB = function(path){
	var that = this;
	var request = new XMLHttpRequest();
	request.open('GET', path, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var data = JSON.parse(request.responseText);

	    //Add each SDBClass into the SDB
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

//SpeakTree.setChracters(String path)
//Set up the characters of the SpeakTree
//ARGUMENTS:
//	path(String) - the file path to the local json file representing the characters and the characteristics
//RETURN void
SpeakTree.prototype.setCharacters = function(path){
	var that = this;
	var request = new XMLHttpRequest();
	request.open('GET', path, true);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var data = JSON.parse(request.responseText);

	    //Push new character objects into the game, as well as characters for World and Player
	    var chars = data.characters;
	    for(var i = 0; i < chars.length; i++){
	    	that.characters.push(new Character(chars[i]));
	    }
	    that.characters.push(new Character("World"));
	    that.characters.push(new Character("Player"));

	    //Loop through each characteristic
	    var characteristics = data.characteristics;
	    for(var j = 0; j < characteristics.length; j++){
	    	//Find the correct corresponding character for that characteristic
	    	for(var k = 0; k < that.characters; k++){
	    		if(characteristics[j].name === that.characters[k].name){

	    			//Check if that sdbClass and type exists
	    			var sdbClass = that.SDB[characteristics[j].class];
	    			if(sdbClass[characteristics[j].type]){

	    				//Now add the characteristic to the correct character
	    				that.characters[k].addCharacteristic(characteristics[j].class, characteristics[j].type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);

	    				//Manually set the value of that characteristic
	    				that.characters[k].parseExpression(characteristics[j].class, characteristics[j].type, "=", characteristics[j].value);
	    			}
	    		}
	    	}


	    }

	  }
	};

	request.onerror = function() {
	  alert("Unable to parse characters from this path: " + path);
	};

	request.send();
};

//SpeakTree.setTrees(String path)
//Set up the the actual Trees of the SpeakTree
//ARGUMENTS:
//	path(String) - the file path to the local folder that holds all of the characters' Trees, these files have to be the same as the name of the character
//RETURN void
SpeakTree.prototype.setTrees = function(path){

	//First, get a reference to all characters that aren't called "World" or "Player"
	var characters = [];
	for(var a = 0; a < this.characters.length; a++){
		if(this.characters[a].name !== "World" && this.characters[a].name !== "Player") characters.push(this.characters[a]);
	}

	var that = this;

	//Loop through each character, adding their corresponding speak tree to the path name
	for(var b = 0; b < characters.length; b++){
		var newPath = path + "/" + characters[b].name + ".json";
	
		var request = new XMLHttpRequest();
		request.open('GET', newPath, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		    var data = JSON.parse(request.responseText);

		    //Code once data has been parsed

		    //Create Speak tree and set it to the character
		    var sTree = new STree();
		    characters[b].setSpeakTree(sTree);

		    //Loop through each action
		    for(var c = 0; c < data.length; c++){
		    	var action = data[c];

		    	//If the action is labeled as a first, set it to be a first
		    	if(action.first){
		    		sTree.addFirst(action.uid);
		    	}

		    	//Give the Speak Tree a hash reference to that action
		    	var uid = action.uid;
		    	sTree.mapAction(action.name, uid);

		    	//Now get that action object that the Speak Tree created
		    	var actionObj = STree[uid];

		    	//Loop through each precondition and set it to the action object
		    	for(var d = 0; d < action.preconditions.length; d++){
		    		var pre = action.preconditions[d];
		    		actionObj.addPrecondition(pre.name, pre.class, pre.type. pre.operation, pre.value);
		    	}

		    	//Loop through each expression and set it to the action object
		    	for(var e = 0; e < action.expressions.length; e++){
		    		var exp = action.expressions[e];
		    		actionObj.addExpression(exp.name, exp.class, exp.type. exp.operation, exp.value);
		    	}

		    	//Loop through each child uid and set it to the action object
		    	for(var f = 0; f < action.leadsTo.length; f++){
		    		var child = action.leadsTo[f];
		    		actionObj.addChild(child);
		    	}
		    	
		    }

		  }
		};

		request.onerror = function() {
		  alert("Unable to parse character Speak Tree from this path: " + newPath);
		};

		request.send();
	}
};