var SpeakTree = function(){
	this.SDB = new SDB();
	this.characters = [];

	this.loadingSDB = false;
	this.loadingCharacters = false;
	this.loadingTree = false;
};

// SpeakTree.setSDB(String path)
// Set up the SDB of the SpeakTree
// ARGUMENTS:
//	path(String) - the file path to the local json file representing the SDB
// RETURN void
SpeakTree.prototype.setSDB = function(path){
	var that = this;
	var request = new XMLHttpRequest();
	request.open('GET', path, true);

	this.loadingSDB = true;

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
	  that.loadingSDB = false;
	};

	request.onerror = function() {
	  alert("Unable to parse SDB from this path: " + path);
	  that.loadingSDB = false;
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

	this.loadingCharacters = true;

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
	    	for(var k = 0; k < that.characters.length; k++){
	    		if(characteristics[j].name === that.characters[k].name){

	    			//Check if that sdbClass and type exists
	    			var sdbClass = that.SDB.SDBClasses[characteristics[j].class];
	    			if(sdbClass.types[characteristics[j].type]){

	    				//Now add the characteristic to the correct character
	    				that.characters[k].addCharacteristic(characteristics[j].class, characteristics[j].type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);

	    				//Manually set the value of that characteristic
	    				that.characters[k].parseExpression(characteristics[j].class, characteristics[j].type, "=", characteristics[j].value);
	    			}
	    		}
	    	}


	    }

	  }
	  that.loadingCharacters = false;
	};

	request.onerror = function() {
	  alert("Unable to parse characters from this path: " + path);
	  that.loadingCharacters = false;
	};

	request.send();
};

//SpeakTree.setTrees(String path)
//Set up the the actual Trees of the SpeakTree
//ARGUMENTS:
//	path(String) - the file path to the local folder that holds all of the characters' Trees, these files have to be the same as the name of the character
//RETURN void
SpeakTree.prototype.setTrees = function(path){

	var that = this;

	this.loadingTree = true;

	//First check to see if characters have been loaded
	//We're loading JSON asynchronously, so it is a bit wonky with the timing
	if(this.characters.length === 0){
		var setT = function(){that.setTrees(path);}; 
		//reload function every 100 milliseconds
		window.setTimeout(setT, 100);
		return;
	}

	//First, get a reference to all characters that aren't called "World" or "Player"
	var characters = [];
	for(var a = 0; a < this.characters.length; a++){
		if(this.characters[a].name !== "World" && this.characters[a].name !== "Player") characters.push(this.characters[a]);
	}

	//Loop through each character, adding their corresponding speak tree to the path name
	for(var b = 0; b < characters.length; b++){
		var char = characters[b];
		var newPath = path + "/" + char.name + ".json";

		var request = new XMLHttpRequest();
		request.open('GET', newPath, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		    var data = JSON.parse(request.responseText);

		    //Code once data has been parsed

		    //Create Speak tree and set it to the character
		    var sTree = new STree();
		    char.setSpeakTree(sTree);

		    //Loop through each action
		    for(var c = 0; c < data.length; c++){
		    	var action = data[c];

		    	//If the action is labeled as a first, set it to be a first
		    	if(action.first){
		    		sTree.addFirst(action.uid);
		    	}

		    	//Give the Speak Tree a Lookup reference to that action
		    	var uid = action.uid;
		    	sTree.mapAction(action.name, uid);

		    	//Now get that action object that the Speak Tree created
		    	var actionObj = sTree.actions[uid];

		    	//Loop through each precondition and set it to the action object
		    	for(var d = 0; d < action.preconditions.length; d++){
		    		var pre = action.preconditions[d];
		    		actionObj.addPrecondition(pre.character, pre.class, pre.type, pre.operation, pre.value);
		    	}

		    	//Loop through each expression and set it to the action object
		    	if(action.expressions !== undefined) {
		    		for(var e = 0; e < action.expressions.length; e++){
		    			var exp = action.expressions[e];
		    			actionObj.addExpression(exp.name, exp.class, exp.type, exp.operation, exp.value);
		    		}
		    	}

		    	//Loop through each child uid and set it to the action object
		    	if(action.leadsTo !== undefined) {
			    	for(var f = 0; f < action.leadsTo.length; f++){
			    		var child = action.leadsTo[f];
			    		actionObj.addChild(child);
			    	}
			    }

		    	//Set the action's parent
		    	actionObj.setParent(action.parent);
		    	
		    }

		  }
		  that.loadingTree = false;
		};

		request.onerror = function() {
		  alert("Unable to parse character Speak Tree from this path: " + newPath);
		  that.loadingTree = false;
		};

		request.send();
	}
};

//SpeakTree.getOptions(int numOfOptions)
//Return a number of options in a specific characters SpeakTree
//ARGUMENTS:
//	character(String) - character name
//	numOfOptions(int) - number of options for that character
//RETURN [int] uids - an array of the action uids available to execute
SpeakTree.prototype.getOptions = function(character, numOfOptions){

	var that = this;

	//check to see if we're still loading JSON
	if(this.loadingSDB || this.loadingCharacters || this.loadingTree){
		var l = function(){that.getOptions(character, numOfOptions)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Get the character's corresponding speak tree
	var tree;
	for(var i = 0; i < this.characters.length; i++){
		if(character === this.characters[i].name){
			tree = this.characters[i].tree;
		}
	}

	//If there's no tree, that means there's no character with that name
	//Error checking
	if(tree == undefined){
		alert("getOptions() Error: There's no character with the name " + character);
		return;
	}

	//loop through each top action, traversing through their corresponding trees
	//keep track of which actions we've added and how many were added
	var uids = [];
	var counter = numOfOptions;
	for(var j = 0; j < tree.firsts.length; j++){

		//Private function that evaluates a precondition
		//Used to see if an action can be traversed to
		//ARGUMENTS:
		//	precondition(Precondition) - the precondition to be evaluated
		//RETURN bool - is the precondition true
		function evaluatePrecondition(precondition){			
			//find the character for that characteristic
			var characteristics;
			var char;
			for(var i = 0; i < that.characters.length; i++){
				if(precondition.characterName === that.characters[i].name){
					characteristics = that.characters[i].characteristics;
					char = that.characters[i];
				}
			}

			//Get the characteristic
			var characteristic = char.characteristics[precondition.cls][precondition.type];
			//If the characteristic doesn't exist for that character, we just use the default value for that character
			if(characteristic == undefined){
				//Get sdbClass values for that characteristic
				var sdbClass = that.SDB.SDBClasses[precondition.cls];
				if(sdbClass == undefined){
					alert("Error: There's no class called " + precondition.cls + ". Look in " + precondition.characterName + "'s Speak Tree.");
					return;
				}

				characteristic = new Characteristic(precondition.cls, precondition.type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);
				//Quickly load that characteristic into the character
				char.setCharacteristic(characteristic);

			}

			//Depending on the operator, see if the precondition passes evaluation
			var returnVal;
			switch(precondition.operation){
				case ">": returnVal = (characteristic.value > precondition.value);
						  break;
				case "<": returnVal = (characteristic.value < precondition.value);
						  break;
				case "==": returnVal = (characteristic.value === precondition.value);
						   break;
			}

			//Return the correct value
			return returnVal;
		}

		//Private function that traverses the non-binary speakTree
		//Recursively goes through the tree and finds each available action
		//ARGUMENTS:
		//	uid(int) - the uid of the action to be traversed
		//return void
		function traverse(uid){

			//Before anything, see if the counter for max returns is at 0
			//If so, we immediately bypass the tree traversal
			if(counter === 0){
				return;
			}

			// get the action object and loop through each of its children
			var action = tree.actions[uid];
			for(var i = 0; i < action.children.length; i++){
				var actionUID = action.children[i];
				var actionObj = tree.actions[actionUID];

				//evaluate each precondition for the child object
				var trig = false;
				for(var j = 0; j < actionObj.preconditions.length; j++){
					var pre = actionObj.preconditions[j];

					//check to see if we get a false value
					if(!evaluatePrecondition(pre)){
						trig = true;
						break;
					}
				}
				//If we do get a false value, move on in the loop
				if(trig) continue;

				//We can assume now that we've succesfully passed the preconditions
				//If it's a leaf, we push it onto the return list and decrement the counter for max returns
				//If not a leaf, we keep traversing
				if(actionObj.isLeaf()){
					uids.push(actionUID);
					counter--;
				} else {
					traverse(actionUID);
				}

				
			}
		}

		var actionObj = tree.actions[tree.firsts[j]];

		//evaluate each precondition for the child object
		var trig = false;
		for(var k = 0; k < actionObj.preconditions.length; k++){
			var pre = actionObj.preconditions[k];

			//check to see if we get a false value
			if(!evaluatePrecondition(pre)){
				trig = true;
				break;
			}
		}
		//If we do get a false value, move on in the loop
		if(trig) {
			continue;
		}

		//We can assume now that we've succesfully passed the preconditions
		//If it's a leaf, we push it onto the return list and decrement the counter for max returns
		//If not a leaf, we keep traversing
		if(actionObj.isLeaf()){
			uids.push(tree.firsts[j]);
			counter--;
		} else {
			traverse(tree.firsts[j]);
		}

	}

	//return the list of uids for doable actions
	return uids;

}

//SpeakTree.getActionName(String character, int uid)
//Given a character and a uid for an action, return the name of that action
//ARGUMENTS:
//	character(String) - the name of the character with the action you want
//	uid(int) - the action's uid
//return String -the name of the corresponding action
SpeakTree.prototype.getActionName = function(character, uid){

	var that = this;

	//check to see if we're still loading JSON
	if(this.loadingSDB || this.loadingCharacters || this.loadingTree){
		var l = function(){that.getActionName(character, uid)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//find the right character and their tree
	var tree;
	for(var i = 0; i < this.characters.length; i++){
		if(character === this.characters[i].name) tree = this.characters[i].tree;
	}

	//If the tree is undefined, that means that there's no character with that name
	//Error checking
	if(tree == undefined){
		alert("getActionName() Error: There's no character with the name " + character);
		return;
	}

	//get the name from the lookup
	var actionName = tree.actions[uid].name;
	//If the action isn't able to be found, that means there's no action with that uid
	//Error checking
	if(actionName == undefined){
		alert("getActionName() Error: There's no uid with the number " + uid);
		return;
	}

	//return the correct name
	return actionName;
}

//SpeakTree.isLoaded()
//Just a simple function to tell if it's been loaded
//return bool - have the JSONs been loaded
SpeakTree.prototype.isLoaded = function(){
	return !(this.loadingSDB || this.loadingTree || this.loadingCharacters);
}