/* StoryTree class, the top class with all client functions
*
* 	SDB(SDB) - The SDB of the StoryTree
* 	characters(CharacterDB) - The database of all characters
* 	loadingSDB(bool) - true if SDB is loading
*	loadingCharacters(bool) - true if Characters are loading
*	loadingCharacteristics(bool) - true if any characteristics are loading
*	loadingActions(bool) - true if any actions are loading
*	badFormatting(bool) - if this is true, this aborts all loading functions
*	conversationType(float) - specifies how salient we want NPCs to be, 0.5(balanced) by default
*/
var StoryTree = function(){
//These are the members of StoryTree
	this.SDB = new SDB();
	this.characterDB = new CharacterDB();

	this.loadingSDB = false;
	this.loadingCharacters = false;
	this.loadingCharacteristics = false;
	this.loadingActions = false;
	this.loadingPreconditions = false;
	this.loadingExpressions = false;

	this.badFormatting = false;

	this.conversationType = 0.5;
};

// StoryTree.setSDB(String path)
// Set up the SDB of the StoryTree
// ARGUMENTS:
//	info(string or {}) - the file path to the local json file representing some number of SDB value literals
// RETURN void
StoryTree.prototype.setSDB = function(info){
	//Check for bad formatting first
	if(this.badFormatting) return;

	//For scoping with anonymous functions
	var that = this;

	//Signal that we're loading SDB values
	this.loadingSDB = true;

	//This anonymous function will actually set the SDB once it has been parsed
	function setMySDB(jsonData){
		//If the JSON data isn't in an array, put it in one
		if(Object.prototype.toString.call( jsonData ) !== '[object Array]'){
			jsonData = [jsonData];
		}

		//iterate through SDBClasses
		for(var i = 0; i < jsonData.length; i++){
			var sdbClass = jsonData[i];

			//Check the formatting of the JSON object to make sure that the typing is correct, simply abort if bad formatting
			that.badFormatting = that.SDB.checkSDB(sdbClass.class, sdbClass.types, sdbClass.isBoolean, sdbClass.min, sdbClass.max, sdbClass.defaultVal);
			if(that.badFormatting) return;

			//If the class already exists, simply add types to the class
			if(that.SDB.getClass(sdbClass.class) != undefined){
				that.SDB.getClass(sdbClass.class).addTypes(sdbClass.types);
			}
			//Else just add the class
			else {
				that.SDB.addClass(new SDBClass(sdbClass.class, sdbClass.types, sdbClass.isBoolean, sdbClass.min, sdbClass.max, sdbClass.defaultVal));
			}
		}

		//Now we're done loading ;)
		that.loadingSDB = false;
	}

	//Now check for formatting of info
	if(typeof info === "string"){
		//If it's a string, we can assume JSON
		var request = new XMLHttpRequest();
		request.open('GET', info, true);
		//Listener for parsing the JSON info
		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
				// Success!
		    var data = JSON.parse(this.responseText);
				setMySDB(data);
			}
		};
		//Listener for error in parsing
		request.onerror = function() {
		  console.log("Unable to parse SDB classes from this path: " + info);
		  that.loadingSDB = false;
		};
		request.send();
	}
	//Else, we can assume literal, and just start parsing it as per usual
	else {
		setMySDB(info)
	}
};

//StoryTree.setChracters(info)
//Set up the characters of the StoryTree
//ARGUMENTS:
//	info([{}] or String) - the file path to the local json file representing the characters or an object literal representing the characters
//RETURN void
StoryTree.prototype.setCharacters = function(info){
	//Check for bad formatting first
	if(this.badFormatting) return;

	//For scoping when loading JSON
	var that = this;

	//Signal that we're loading Character values
	this.loadingCharacters = true;

	//This anonymous function will actually set the characters once they have been parsed
	function setMyCharacters(jsonData){
		//If the JSON data isn't in an array, put it in one
		if(Object.prototype.toString.call( jsonData ) !== '[object Array]'){
			jsonData = [jsonData];
		}

		//First check the list of characters
		that.badFormatting = that.characterDB.checkCharacters(jsonData);
		if(that.badFormatting) return;

		//Now add the characters to the DB
		for(var i = 0; i < jsonData.length; i++){
			//check if the character exists already
			if(that.characterDB.getCharacter(jsonData[i]) != undefined){
				console.log("setCharacter() warning: attempted to add a character that already exists.");
			}
			//Else add the character to the DB
			else{
				that.characterDB.addCharacter(jsonData[i]);
				//Also, set up an stree object
				that.characterDB.getCharacter(jsonData[i]).setStoryTree(new STree());
			}
		}

		//Now we're done loading ;)
		that.loadingCharacters = false;
	}

	//Now check for formatting of info
	if(typeof info === "string"){
		//If it's a string, we can assume JSON
		var request = new XMLHttpRequest();
		request.open('GET', info, true);
		//Listener for parsing the JSON info
		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
				// Success!
		    var data = JSON.parse(this.responseText);
				setMyCharacters(data);
			}
		};
		//Listener for error in parsing
		request.onerror = function() {
		  console.log("Unable to parse Characters from this path: " + info);
		  that.loadingCharacters = false;
		};
		request.send();
	}
	//Else, we can assume literal, and just start parsing it as per usual
	else {
		setMyCharacters(info)
	}
};

//StoryTree.setChracteristics(info)
//Set up the characters of the StoryTree
//ARGUMENTS:
//	info([{}] or String) - the file path to the local json file representing the characteristics or an object literal representing the characteristics
//RETURN void
StoryTree.prototype.setCharacteristics = function(info){
	//Check for bad formatting first
	if(this.badFormatting) return;

	//For scoping when loading JSON
	var that = this;

	//First check to see if SDB and characters have been loaded
	//We're loading JSON asynchronously, so it is a bit wonky with the timing
	if(this.SDB.isEmpty() || this.characterDB.isEmpty()){
		var setT = function(){that.setCharacteristics(info);};
		//reload function every 100 milliseconds
		window.setTimeout(setT, 100);
		return;
	}

	//Signal that we're loading Character values
	this.loadingCharacteristics = true;

	//This anonymous function will actually set the characters once they have been parsed
	function setMyCharacteristics(jsonData){
		//If the JSON data isn't in an array, put it in one
		if(Object.prototype.toString.call( jsonData ) !== '[object Array]'){
			jsonData = [jsonData];
		}

		//Loop through list of characteristics
		for(var i = 0; i < jsonData.length; i++){
			var characteristic = jsonData[i];

			//now check formatting of characteristic
			that.badFormatting = that.characterDB.checkCharacteristic(characteristic.name,
																		characteristic.class,
																		characteristic.type,
																		characteristic.value);
			if(that.badFormatting) return;

			//Check if the class and type exist
			that.badFormatting = !(that.SDB.doesContain(characteristic.class, characteristic.type));
			if(that.badFormatting){
				alert("setCharacteristics() Error: the class and type combo of \n "
						+ "class: " + characteristic.class + "\n"
						+ "type: " + characteristic.type + "\n"
						+ "doesn't exist in the SDB.");
				return;
			}

			//Check if the character exists
			if(that.characterDB.getCharacter(characteristic.name) == undefined){
				alert("setCharacteristics() error: There's no character named " + characteristic.name);
				return
			}
			var character = that.characterDB.getCharacter(characteristic.name);

			//
			//Now actually set the characteristic
			//

			//Get the correct sdbClass
			var sdbClass = that.SDB.getClass(characteristic.class);

			//Add the characteristic to the correct character
			character.addCharacteristic(characteristic.class, characteristic.type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);

			//Manually set the value of that characteristic
			character.parseExpression(characteristic.class, characteristic.type, "=", characteristic.value);
		}

		//Now we're done loading ;)
		that.loadingCharacteristics = false;
	}

	//Now check for formatting of info
	if(typeof info === "string"){
		//If it's a string, we can assume JSON
		var request = new XMLHttpRequest();
		request.open('GET', info, true);
		//Listener for parsing the JSON info
		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
				// Success!
		    var data = JSON.parse(this.responseText);
				setMyCharacteristics(data);
			}
		};
		//Listener for error in parsing
		request.onerror = function() {
		  console.log("Unable to parse Characteristics from this path: " + info);
		  that.loadingCharacteristics = false;
		};
		request.send();
	}
	//Else, we can assume literal, and just start parsing it as per usual
	else {
		setMyCharacteristics(info)
	}
};

//StoryTree.setActions(character, info)
//Set up the the actual actions of the StoryTree
//ARGUMENTS:
//	character(string) - the name of the character we're setting the actions to
//	info(String or {}) - the file path to the local json file representing the actionss or an object literal representing the actions
//RETURN void
StoryTree.prototype.setActions = function(character, info){
	//Check for bad formatting first
	if(this.badFormatting) return;

	//For scoping when loading JSON
	var that = this;

	//First check to see if characters have been loaded
	//We're loading JSON asynchronously, so it is a bit wonky with the timing
	if(this.characterDB.isEmpty()){
		var setT = function(){that.setActions(character, info);};
		//reload function every 100 milliseconds
		window.setTimeout(setT, 100);
		return;
	}

	//Signal that we're loading Action values
	this.loadingActions = true;

	//This anonymous function will actually set the characters once they have been parsed
	function setMyActions(jsonData){
		//If the JSON data isn't in an array, put it in one
		if(Object.prototype.toString.call( jsonData ) !== '[object Array]'){
			jsonData = [jsonData];
		}

		//First retrieve the character we need, abort if it doesn't exist
		var char = that.characterDB.getCharacter(character);
		if(char == undefined){
			alert("setActions() error: the character " + character + " does not exist.");
			return;
		}

		var tree = char.tree;

		//Now loop through each action
		for(var i = 0; i < jsonData.length; i++){
			var action = jsonData[i];

			//Check the formatting of the action before anything else
			that.badFormatting = Action.prototype.checkAction(action.name, action.uid, action.first, action.class, action.preconditions, action.expressions);
			if(that.badFormatting) return;

			//If the action is labeled as a first, set it to be a first
			if(action.first){
				tree.addFirst(action.uid);
			}

			//Give the Speak Tree a Lookup reference to that action
			var uid = action.uid;
			tree.mapAction(action.name, uid);

			//Now get that action object that the Speak Tree created
			var actionObj = tree.actions[uid];

			//Loop through each precondition and set it to the action object
			if(action.preconditions !== undefined) {
				for(var d = 0; d < action.preconditions.length; d++){
					var pre = action.preconditions[d];
					actionObj.addPrecondition(pre.character, pre.class, pre.type, pre.operation, pre.value);
				}
			}

			//Loop through each expression and set it to the action object
			if(action.expressions !== undefined) {
				for(var e = 0; e < action.expressions.length; e++){
					var exp = action.expressions[e];
					actionObj.addExpression(exp.character, exp.class, exp.type, exp.operation, exp.value);
				}
			}

			//Loop through each child uid and set it to the action object
			if(action.leadsTo !== undefined) {
				for(var f = 0; f < action.leadsTo.length; f++){
					var child = action.leadsTo[f];
					actionObj.addChild(child);
				}
			}

			//Finally, set that action's class
			actionObj.setClass(action.class);

		}

		//Now check the tree for loops
		if(tree.checkActionTree()){
			that.badFormatting = true;
			return;
		}


		//Now we're done loading actions ;)
		that.loadingActions = false;
	}

	//Now check for formatting of info
	if(typeof info === "string"){
		//If it's a string, we can assume JSON
		var request = new XMLHttpRequest();
		request.open('GET', info, true);
		//Listener for parsing the JSON info
		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
				// Success!
		    var data = JSON.parse(this.responseText);
				setMyActions(data);
			}
		};
		//Listener for error in parsing
		request.onerror = function() {
		  console.log("Unable to parse Actions from this path: " + info);
		  that.loadingActions = false;
		};

		request.send();
	}
	//Else, we can assume literal, and just start parsing it as per usual
	else {
		setMyActions(info)
	}
};

//StoryTree.setPreconditions(character, id, info)
//Sets up preconditons, given a character and an action id
//ARGUMENTS:
//	character(string) - the name of the character we're setting this up for
//	id(int) - the unique id of the action we're adding preconditions to
//	info({} or path) - the file path to the local json file representing the preconditions or an object literal representing the preconditions
//RETURN void
StoryTree.prototype.setPreconditions = function(character, id, info){
	//Check for bad formatting first
	if(this.badFormatting) return;

	//For scoping when loading JSON
	var that = this;

	//First check to see if character's tree has been loaded
	//We're loading JSON asynchronously, so it is a bit wonky with the timing
	if(this.characterDB.getCharacter(character).tree.isEmpty()){
		var setT = function(){that.setPreconditions(character, id, info);};
		//reload function every 100 milliseconds
		window.setTimeout(setT, 100);
		return;
	}

	//Mark that we're loading preconditions
	this.loadingPreconditions = true;

	//The actual function that loads preconditions
	//ARGUMENTS:
	//	data({}) - the object representing the precondition
	function setMyPreconditions(data){
		//If the JSON data isn't in an array, put it in one
		if(Object.prototype.toString.call( data ) !== '[object Array]'){
			data = [data];
		}

		//First retrieve the character we need, abort if it doesn't exist
		var char = that.characterDB.getCharacter(character);
		if(char == undefined){
			alert("setPreconditions() error: the character " + character + " does not exist.");
			return;
		}

		//Next get the action we need for that character
		var action = char.tree.actions[id];
		if(action == undefined){
			alert("setPreconditions() error: the action with the uid " + id + "for the character " + character + "does not exist.");
			return;
		}

		//Now loop through each precondition
		for(var i = 0; i < data.length; i++){
			var pre = data[i];

			//Check the formatting of the precondition before anything else
			var preString = Precondition.prototype.checkPrecondition(pre.character, pre.class, pre.type, pre.operation, pre.value);
			if(preString !== ""){
				alert(preString);
				that.badFormatting = true;
				return;
			}

			//Now we can finally assign the precondition to the action
			action.addPrecondition(pre.character, pre.class, pre.type, pre.operation, pre.value);

		}

		//Now we're done loading preconditions ;)
		that.loadingPreconditions = false;

	}

	//Now check for formatting of info
	if(typeof info === "string"){
		//If it's a string, we can assume JSON
		var request = new XMLHttpRequest();
		request.open('GET', info, true);
		//Listener for parsing the JSON info
		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
				// Success!
		    var data = JSON.parse(this.responseText);
				setMyPreconditions(data);
			}
		};
		//Listener for error in parsing
		request.onerror = function() {
		  console.log("Unable to parse Preconditions from this path: " + info);
		  that.loadingPreconditions = false;
		};

		request.send();
	}
	//Else, we can assume literal, and just start parsing it as per usual
	else {
		setMyPreconditions(info)
	}
};

//StoryTree.setExpressions(character, id, info)
//Sets up expressions, given a character and an action id
//ARGUMENTS:
//	character(string) - the name of the character we're setting this up for
//	id(int) - the unique id of the action we're adding expressions to
//	info({} or path) - the file path to the local json file representing the expressions or an object literal representing the expressions
//RETURN void
StoryTree.prototype.setExpressions = function(character, id, info){
		//Check for bad formatting first
	if(this.badFormatting) return;

	//For scoping when loading JSON
	var that = this;

	//First check to see if character's tree has been loaded
	//We're loading JSON asynchronously, so it is a bit wonky with the timing
	if(this.characterDB.getCharacter(character).tree.isEmpty()){
		var setT = function(){that.setExpressions(character, id, info);};
		//reload function every 100 milliseconds
		window.setTimeout(setT, 100);
		return;
	}

	//Mark that we're loading expressions
	this.loadingExpressions = true;

	//The actual function that loads expressions
	//ARGUMENTS:
	//	data({}) - the object representing the expressions
	function setMyExpressions(data){
		//If the JSON data isn't in an array, put it in one
		if(Object.prototype.toString.call( data ) !== '[object Array]'){
			data = [data];
		}

		//First retrieve the character we need, abort if it doesn't exist
		var char = that.characterDB.getCharacter(character);
		if(char == undefined){
			alert("setExpressions() error: the character " + character + " does not exist.");
			return;
		}

		//Next get the action we need for that character
		var action = char.tree.actions[id];
		if(action == undefined){
			alert("setExpressions() error: the action with the uid " + id + "for the character " + character + "does not exist.");
			return;
		}

		//Now loop through each precondition
		for(var i = 0; i < data.length; i++){
			var exp = data[i];

			//Check the formatting of the expression before anything else
			var expString = Expression.prototype.checkExpression(exp.character, exp.class, exp.type, exp.operation, exp.value);
			if(expString !== ""){
				alert(expString);
				that.badFormatting = true;
				return;
			}

			//Now we can finally assign the expression to the action
			action.addExpression(exp.character, exp.class, exp.type, exp.operation, exp.value);

		}

		//Now we're done loading expressions ;)
		that.loadingExpressions = false;

	}

	//Now check for formatting of info
	if(typeof info === "string"){
		//If it's a string, we can assume JSON
		var request = new XMLHttpRequest();
		request.open('GET', info, true);
		//Listener for parsing the JSON info
		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
				// Success!
		    var data = JSON.parse(this.responseText);
				setMyExpressions(data);
			}
		};
		//Listener for error in parsing
		request.onerror = function() {
		  console.log("Unable to parse Expressions from this path: " + info);
		  that.loadingExpressions = false;
		};

		request.send();
	}
	//Else, we can assume literal, and just start parsing it as per usual
	else {
		setMyExpressions(info)
	}
};

//StoryTree.set(thing, arg1, arg2, arg3, arg4)
//Sets a storytree thing, based on the string of thing
//ARGUMENTS:
//	thing(string) - "SDB", "character", "characteristic", "action", "precondition", or "expression"
//	arg1(?) - depends on child function being called
//	arg2(?) - depends on child function being called
//	arg3(?) - depends on child function being called
//RETURN void
StoryTree.prototype.set = function(thing, arg1, arg2, arg3){
	//First check format of thing
	if(typeof thing !== "string"){
		alert("set() error: argument 1 is not of type string.");
		return;
	}

	//lowercase thing
	thing = thing.toLowerCase();

	//If an 's' is at the end of the thing, concatenate it off. (function can take plural or singular things)
	if(thing.slice(-1) === "s") thing = thing.substring(0, thing.length - 1);

	//Now call the appropriate, already existing function
	switch(thing){
		case "sdb":
			this.setSDB(arg1);
			break;
		case "character":
			this.setCharacters(arg1);
			break;
		case "characteristic":
			this.setCharacteristics(arg1);
			break;
		case "action":
			this.setActions(arg1, arg2);
			break;
		case "precondition":
			this.setPreconditions(arg1, arg2, arg3);
			break;
		case "expression":
			this.setExpressions(arg1, arg2, arg3);
			break;
		default:
			alert("set() error: argument one is not a recognized type of addable information.");
			break;
	}
};

//StoryTree.remove(cls, type)
//Removes a value from the SDB
//As a result, will also remove all characteristics, preconditions, and expressions involving the value
//ARGUMENTS:
//	cls(string) - the class of the value to be removed
//	type(string or undefined) - the type, or lack thereof, that expresses the SDB value. If undefined, remove the class entirely.
//RETURN void
StoryTree.prototype.removeSDB = function(cls, type){
	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.removeSDB(cls, type)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//First check if the user specifies a specific type, if not, then we assume to remove all values of that class
	var all = false;
	if(type == undefined){
		all = true;
	}

	//Next, check the formatting of the arguments
	if(typeof cls !== "string"){
		alert("StoryTree.removeSDB() Error: Your class value of " + cls + "is not of type string.");
		return;
	}
	if(typeof type !== "string" && type != undefined){
		alert("StoryTree.removeSDB() Error: Your type value of " + type + "is not of type string.");
		return;
	}

	//Last of all, check if the SDB value exists
	if(!this.SDB.doesContain(cls, type)){
		if(type == undefined){
			console.log("StoryTree.removeSDB() Warning: The class " + cls + " and type " + type + " isn't a valid SDB value.");
		} else {
			Console.log("StoryTree.removeSDB() Warning: The class " + cls + " isn't a valid SDB value.");
		}
		return;
	}

	//Now we can actually do the deleting
	//that #spaghettilyfe
	if(all){
		//First, delete the entry in the SDB
		delete this.SDB.SDBClasses[cls];

		//Iterate through all characters
		for(var name in this.characterDB.characters){
			var character = this.characterDB.characters[name];

			//Now find the associated characteristic and delete it, can delete undefined characteristics
			delete character.characteristics[cls];

			//Now loop through each action to get to the preconditions and expressions
			for(var uid in character.tree.actions){
				var action = character.tree.actions[uid];

				//Loop through the preconditions
				for(var i = 0; i < action.preconditions.length; i++){
					var pre = action.preconditions[i];

					if(pre.cls === cls){
						action.preconditions.splice(i, 1);
					}
				}

				//Loop through the expressions
				for(var j = 0; j < action.expressions.length; j++){
					var exp = action.expressions[j];

					if(exp.cls === cls){
						action.expressions.splice(j, 1);
					}
				}
			}

		}
	} else {
		//First, delete the entry in the SDB
		var SDBClass = this.SDB.SDBClasses[cls];
		delete SDBClass[type]; 

		//Iterate through all characters
		for(var name in this.characterDB.characters){
			var character = this.characterDB.characters[name];

			//Now find the associated characteristic and delete it, can delete undefined characteristics
			delete character.characteristics[cls][type];

			//Now loop through each action to get to the preconditions and expressions
			for(var uid in character.tree.actions){
				var action = character.tree.actions[uid];

				//Loop through the preconditions
				for(var i = 0; i < action.preconditions.length; i++){
					var pre = action.preconditions[i];

					if(pre.cls === cls && pre.type === type){
						action.preconditions.splice(i, 1);
					}
				}

				//Loop through the expressions
				for(var j = 0; j < action.expressions.length; j++){
					var exp = action.expressions[j];

					if(exp.cls === cls && exp.type === type){
						action.expressions.splice(j, 1);
					}
				}
			}

		}

	}	
};

//StoryTree.removeCharacter(name)
//Remove the specified character from the storyTree instance
//ARGUMENTS:
//	name(String) - character name
//RETURN void
StoryTree.prototype.removeCharacter = function(name){
	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.removeCharacter(name)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Next, check the formatting of the argument
	if(typeof name !== "string"){
		alert("StoryTree.removeCharacter() Error: The argument " + name + "is not of type string.");
		return;
	}

	//Last of all, check if the character exists
	if(this.characterDB.getCharacter(name) == undefined){
		console.log("StoryTree.removeCharacter() Warning: The character " + name + " doesn't exist.");
		return;
	}

	//Now for the actual deleting
	delete this.characterDB.characters[name];
}

//StoryTree.removeCharacteristic(name, cls, type)
//Remove a specified characteristic
//ARGUMENTS:
//	name(string) - the name of the character
//	cls(string or undefined) - the class of the characteristic, if undefined, remove all characteristics
//	type(string or undefined) - the type of the characteristic, if undefined, remove all characteristics of a certain class
//RETURN void
StoryTree.prototype.removeCharacteristic = function(name, cls, type){
	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.removeCharacteristic(name, cls, type)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Next, check the formatting of the arguments
	if(typeof name !== "string"){
		alert("StoryTree.removeCharacteristic() Error: The argument " + name + "is not of type string.");
		return;
	}
	if(typeof cls !== "string" && cls != undefined){
		alert("StoryTree.removeCharacteristic() Error: The argument " + cls + "is not of type string.");
		return;
	}
	if(typeof type !== "string" && type != undefined){
		alert("StoryTree.removeCharacteristic() Error: The argument " + type + "is not of type string.");
		return;
	}

	//Check if the character exists
	if(this.characterDB.getCharacter(name) == undefined){
		console.log("StoryTree.removeCharacteristic() Warning: The character " + name + " doesn't exist.");
		return;
	}
	//Check if there's are any characteristics of that class
	if(this.characterDB.getCharacter(name).characteristics[cls] == undefined && cls != undefined){
		console.log("StoryTree.removeCharacteristic() Warning: There is no characteristic value with the class " + cls + " for the character " + name + ".");
		return;
	}
	//Check if there's a characteristic of that cls and type
	if(this.characterDB.getCharacter(name).characteristics[cls][type] == undefined && cls != undefined && type != undefined){
		console.log("StoryTree.removeCharacteristic() Warning: There is no characteristic value with the class " + cls + " and the type " + type + " for the character " + name + ".");
		return;
	}

	//Now we move on to actually deleting the stuff
	//State 1: cls is defined, type is defined
	if(cls != undefined && type != undefined){
		delete this.characterDB.getCharacter(name).characteristics[cls][type];
		return;
	}
	//State 2: cls is defined
	if(cls != undefined){
		delete this.characterDB.getCharacter(name).characteristics[cls];
		return;
	}
	//State 3: the name of the character is defined
	for(var myCls in this.characterDB.getCharacter(name).characteristics){
		delete this.characterDB.getCharacter(name).characteristics[myCls];
	}
};

//StoryTree.removeAction(name, uid)
//Remove a specified action from a character, or remove all actions
//ARGUMENTS:
//	name(string) - the name of the character
//	uid(int or undefined) - the uid of the action you want to remove, if undefined, remove all actions
//RETURN void
StoryTree.prototype.removeAction = function(name, uid){
	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.removeAction(name, uid)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Next, check the formatting of the arguments
	if(typeof name !== "string"){
		alert("StoryTree.removeAction() Error: The argument " + name + "is not of type string.");
		return;
	}
	if(typeof uid !== "number" && uid != undefined){
		alert("StoryTree.removeAction() Error: The argument " + uid + "is not of type int.");
		return;
	}

	//Check if the character exists
	if(this.characterDB.getCharacter(name) == undefined){
		console.log("StoryTree.removeAction() Warning: The character " + name + " doesn't exist.");
		return;
	}
	//Check if there's an action with the uid
	if(this.characterDB.getCharacter(name).tree.actions[uid] == undefined && uid != undefined){
		console.log("StoryTree.removeAction() Warning: There is no action with the uid " + uid + " for the character " + name + ".");
		return;
	}

	//Now we actually delete the things
	//State 1: uid is defined
	if(uid != undefined){
		delete this.characterDB.getCharacter(name).tree.actions[uid];
		return;
	}
	//State 2: uid is not defined
	for(var myUID in this.characterDB.getCharacter(name).tree.actions){
		delete this.characterDB.getCharacter(name).tree.actions[myUID];
	}
};

//StoryTree.removePrecondition(name, uid, cls, type)
//Remove a specified precondition from a character, or remove some variation
//ARGUMENTS:
//	name(string or undefined) - the name of the character, if undefined, remove preconditions for all characters, specified by other states
//	uid(int or undefined) - the uid of the action you want to remove, if undefined, remove all preconditions for that character, unless class is specified, then remove all of the specified class
//	cls(string or undefined) - the class of the precondition you want to remove, if undefined, remove all preconditions of the specified uid
//	type(string or undefined) - the type of the precondition you want to remove, if undefined, remove all preconditions of the specified class
//RETURN void
StoryTree.prototype.removePrecondition = function(name, uid, cls, type){
	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.removePrecondition(name, uid, cls, type)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Next, check the formatting of the arguments
	if(typeof name !== "string" && name != undefined){
		alert("StoryTree.removePrecondition() Error: The argument " + name + "is not of type string.");
		return;
	}
	if(typeof name !== "number" && uid != undefined){
		alert("StoryTree.removePrecondition() Error: The argument " + uid + "is not of type uid.");
		return;
	}
	if(typeof cls !== "string" && cls != undefined){
		alert("StoryTree.removePrecondition() Error: The argument " + cls + "is not of type string.");
		return;
	}
	if(typeof type !== "string" && type != undefined){
		alert("StoryTree.removePrecondition() Error: The argument " + type + "is not of type string.");
		return;
	}

	//Check if the character exists
	if(this.characterDB.getCharacter(name) == undefined && name != undefined){
		console.log("StoryTree.removePrecondition() Warning: The character " + name + " doesn't exist.");
		return;
	}
	//Check if the action exists
	if(this.characterDB.getCharacter(name).tree.actions[uid] == undefined && uid != undefined){
		console.log("StoryTree.removePrecondition() Warning: The uid " + uid + " does not exist for the character " + name);
		return;
	}

	//If all undefined, throw an error
	if(name == undefined && uid == undefined && cls == undefined && type == undefined){
		alert("StoryTree.removePrecondition() Error: No arguments given.");
		return;
	}


	//Valid states
	//1: name
	if(name != undefined && uid == undefined && cls == undefined && type == undefined){
		//Delete all preconditions for each action for a character
		for(var myUID in this.characterDB.getCharacter(name).tree.actions){
			var action = this.characterDB.getCharacter(name).tree.actions[myUID];
			action.preconditions = [];
		}
		return;
	}
	//2: name, uid
	if(name != undefined && uid != undefined && cls == undefined && type == undefined){
		//Delete all preconditions for specified action
		this.characterDB.getCharacter(name).tree.actions[uid].preconditions = [];
		return;
	}
	//3: name, cls
	if(name != undefined && uid == undefined && cls != undefined && type == undefined){
		//Delete all preconditions of a character with a specified class, in each action
		for(var myUID in this.characterDB.getCharacter(name).tree.actions){
			var action = this.characterDB.getCharacter(name).tree.actions[myUID];

			//Loop through preconditions
			for(var i = action.preconditions.length; i > 0; i--){
				var pre = action.preconditions[i-1];

				if(pre.cls === cls){
					actions.preconditions.splice(i-1, 1);
				}
			}
		}
	}
	//4: name, cls, type
	if(name != undefined && uid == undefined && cls != undefined && type != undefined){
		//Delete all preconditions of a character with a specified class, in each action
		for(var myUID in this.characterDB.getCharacter(name).tree.actions){
			var action = this.characterDB.getCharacter(name).tree.actions[myUID];

			//Loop through preconditions
			for(var i = action.preconditions.length; i > 0; i--){
				var pre = action.preconditions[i-1];

				if(pre.cls === cls && pre.type === type){
					actions.preconditions.splice(i-1, 1);
				}
			}
		}
		return;
	}
	//5: name, uid, cls
	if(name != undefined && uid != undefined && cls != undefined && type == undefined){
		//Delete all preconditions of a character, for a specific action and class
		var pres = this.characterDB.getCharacter(name).tree.actions[uid].preconditions;
		for(var i = pres.length; i > 0; i--){
			var pre = action.preconditions[i-1];

			if(pre.cls === cls){
				pres.splice(i-1, 1);
			}
		}
		return;
	}
	//6: name, uid, cls, type
	if(name != undefined && uid != undefined && cls != undefined && type != undefined){
		//Delete all preconditions of a character, for a specific action and class
		var pres = this.characterDB.getCharacter(name).tree.actions[uid].preconditions;
		for(var i = pres.length; i > 0; i--){
			var pre = action.preconditions[i-1];

			if(pre.cls === cls && pre.type === type){
				pres.splice(i-1, 1);
			}
		}
		return;
	}
	//7: cls
	if(name == undefined && uid == undefined && cls != undefined && type == undefined){
		//For every character, delete every precondition with this class
		for(var name in this.characterDB.characters){
			var char = this.characterDB[name];

			for(var myUID in char.tree.actions){
				var action = char.tree.actions[myUID];

				for(var i = action.preconditions.length; i > 0; i--){
					var pre = action.preconditions[i-1];

					if(pre.cls === cls){
						action.preconditions.splice(i-1, 1);
					}
				}
			}
		}
		return;
	}
	//8: cls, type
	if(name == undefined && uid == undefined && cls != undefined && type != undefined){
		//For every character, delete every precondition with this class and type
		for(var name in this.characterDB.characters){
			var char = this.characterDB[name];

			for(var myUID in char.tree.actions){
				var action = char.tree.actions[myUID];

				for(var i = action.preconditions.length; i > 0; i--){
					var pre = action.preconditions[i-1];

					if(pre.cls === cls && pre.type === type){
						action.preconditions.splice(i-1, 1);
					}
				}
			}
		}
		return;
	}

	//If we've gotten to this point, we're not calling a valid combo of paramters

	alert("StoryTree.removePrecondition() Error: The parameter combo of " + (name != undefined ? "name, " : "") + (uid != undefined ? "uid, " : "") 
		  + (cls != undefined ? "class, " : "") + (type != undefined ? "type " : "") + "is not a valid combination of parameters.");  
}

//StoryTree.removeExpression(name, uid, cls, type)
//Remove a specified expression from a character, or remove some variation
//ARGUMENTS:
//	name(string or undefined) - the name of the character, if undefined, remove expressions for all characters, specified by other states
//	uid(int or undefined) - the uid of the action you want to remove, if undefined, remove all expressions for that character, unless class is specified, then remove all of the specified class
//	cls(string or undefined) - the class of the expression you want to remove, if undefined, remove all expressions
//	type(string or undefined) - the type of the expression you want to remove, if undefined, remove all of the specified class
//RETURN void
StoryTree.prototype.removeExpression = function(name, uid, cls, type){
	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.removeExpression(name, uid, cls, type)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Next, check the formatting of the arguments
	if(typeof name !== "string" && name != undefined){
		alert("StoryTree.removeExpression() Error: The argument " + name + "is not of type string.");
		return;
	}
	if(typeof name !== "number" && uid != undefined){
		alert("StoryTree.removeExpression() Error: The argument " + uid + "is not of type uid.");
		return;
	}
	if(typeof cls !== "string" && cls != undefined){
		alert("StoryTree.removeExpression() Error: The argument " + cls + "is not of type string.");
		return;
	}
	if(typeof type !== "string" && type != undefined){
		alert("StoryTree.removeExpression() Error: The argument " + type + "is not of type string.");
		return;
	}

	//Check if the character exists
	if(this.characterDB.getCharacter(name) == undefined && name != undefined){
		console.log("StoryTree.removeExpression() Warning: The character " + name + " doesn't exist.");
		return;
	}
	//Check if the action exists
	if(this.characterDB.getCharacter(name).tree.actions[uid] == undefined && uid != undefined){
		console.log("StoryTree.removeExpressionn() Warning: The uid " + uid + " does not exist for the character " + name);
		return;
	}

	//If all undefined, throw an error
	if(name == undefined && uid == undefined && cls == undefined && type == undefined){
		alert("StoryTree.removeExpression() Error: No arguments given.");
		return;
	}


	//Valid states
	//1: name
	if(name != undefined && uid == undefined && cls == undefined && type == undefined){
		//Delete all expressions for each action for a character
		for(var myUID in this.characterDB.getCharacter(name).tree.actions){
			var action = this.characterDB.getCharacter(name).tree.actions[myUID];
			action.expressions = [];
		}
		return;
	}
	//2: name, uid
	if(name != undefined && uid != undefined && cls == undefined && type == undefined){
		//Delete all expressions for specified action
		this.characterDB.getCharacter(name).tree.actions[uid].expressions = [];
		return;
	}
	//3: name, cls
	if(name != undefined && uid == undefined && cls != undefined && type == undefined){
		//Delete all expressions of a character with a specified class, in each action
		for(var myUID in this.characterDB.getCharacter(name).tree.actions){
			var action = this.characterDB.getCharacter(name).tree.actions[myUID];

			//Loop through expressions
			for(var i = action.expressions.length; i > 0; i--){
				var pre = action.expressions[i-1];

				if(pre.cls === cls){
					actions.expressions.splice(i-1, 1);
				}
			}
		}
	}
	//4: name, cls, type
	if(name != undefined && uid == undefined && cls != undefined && type != undefined){
		//Delete all expressions of a character with a specified class, in each action
		for(var myUID in this.characterDB.getCharacter(name).tree.actions){
			var action = this.characterDB.getCharacter(name).tree.actions[myUID];

			//Loop through expressions
			for(var i = action.expressions.length; i > 0; i--){
				var pre = action.expressions[i-1];

				if(pre.cls === cls && pre.type === type){
					actions.expressions.splice(i-1, 1);
				}
			}
		}
		return;
	}
	//5: name, uid, cls
	if(name != undefined && uid != undefined && cls != undefined && type == undefined){
		//Delete all expressions of a character, for a specific action and class
		var pres = this.characterDB.getCharacter(name).tree.actions[uid].expressions;
		for(var i = pres.length; i > 0; i--){
			var pre = action.expressions[i-1];

			if(pre.cls === cls){
				pres.splice(i-1, 1);
			}
		}
		return;
	}
	//6: name, uid, cls, type
	if(name != undefined && uid != undefined && cls != undefined && type != undefined){
		//Delete all expressions of a character, for a specific action and class
		var pres = this.characterDB.getCharacter(name).tree.actions[uid].expressions;
		for(var i = pres.length; i > 0; i--){
			var pre = action.expressions[i-1];

			if(pre.cls === cls && pre.type === type){
				pres.splice(i-1, 1);
			}
		}
		return;
	}
	//7: cls
	if(name == undefined && uid == undefined && cls != undefined && type == undefined){
		//For every character, delete every precondition with this class
		for(var name in this.characterDB.characters){
			var char = this.characterDB[name];

			for(var myUID in char.tree.actions){
				var action = char.tree.actions[myUID];

				for(var i = action.expressions.length; i > 0; i--){
					var pre = action.expressions[i-1];

					if(pre.cls === cls){
						action.expressions.splice(i-1, 1);
					}
				}
			}
		}
		return;
	}
	//8: cls, type
	if(name == undefined && uid == undefined && cls != undefined && type != undefined){
		//For every character, delete every precondition with this class and type
		for(var name in this.characterDB.characters){
			var char = this.characterDB[name];

			for(var myUID in char.tree.actions){
				var action = char.tree.actions[myUID];

				for(var i = action.expressions.length; i > 0; i--){
					var pre = action.expressions[i-1];

					if(pre.cls === cls && pre.type === type){
						action.expressions.splice(i-1, 1);
					}
				}
			}
		}
		return;
	}

	//If we've gotten to this point, we're not calling a valid combo of paramters

	alert("StoryTree.removePrecondition() Error: The parameter combo of " + (name != undefined ? "name, " : "") + (uid != undefined ? "uid, " : "") 
		  + (cls != undefined ? "class, " : "") + (type != undefined ? "type " : "") + "is not a valid combination of parameters.");  
}

//StoryTree.remove(thing, arg1, arg2, arg3, arg4)
//Removes a storytree thing, based on the string of thing
//ARGUMENTS:
//	thing(string) - "SDB", "character", "characteristic", "action", "precondition", or "expression"
//	arg1(?) - depends on child function being called
//	arg2(?) - depends on child function being called
//	arg3(?) - depends on child function being called
//RETURN void
StoryTree.prototype.remove = function(thing, arg1, arg2, arg3, arg4){
	//First check format of thing
	if(typeof thing !== "string"){
		alert("remove() error: the argument" + thing + " is not of type string.");
		return;
	}

	//lowercase thing
	thing = thing.toLowerCase();

	//If an 's' is at the end of the thing, concatenate it off. (function can take plural or singular things)
	if(thing.slice(-1) === "s") thing = thing.substring(0, thing.length - 1);

	//Now call the appropriate, already existing function
	switch(thing){
		case "sdb":
			this.removeSDB(arg1, arg2);
			break;
		case "character":
			this.removeCharacter(arg1);
			break;
		case "characteristic":
			this.removeCharacteristic(arg1, arg2, arg3);
			break;
		case "action":
			this.removeAction(arg1, arg2);
			break;
		case "precondition":
			this.removePrecondition(arg1, arg2, arg3, arg4);
			break;
		case "expression":
			this.removeExpressions(arg1, arg2, arg3, arg4);
			break;
		default:
			alert("remove() error: the argument" + thing + " is not a recognized type of removable information.");
			break;
	}
};

//StoryTree.getOptions(int numOfOptions)
//Return a number of options in a specific characters StoryTree
//ARGUMENTS:
//	character(String) - character name
//	numOfOptions(int) - number of options for that character
//RETURN [[int]] uids - an array of the paths of the action uids available to execute
StoryTree.prototype.getOptions = function(character, numOfOptions){

	var that = this;

	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.getOptions(character, numOfOptions)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Get the character's corresponding speak tree
	var myCharacter = that.characterDB.getCharacter(character);
	var tree = myCharacter.tree;

	//If there's no tree, that means there's no character with that name
	//Error checking
	if(tree == undefined){
		alert("getOptions() Error: There's no character with the name " + character);
		return;
	}

	//Private function that evaluates a precondition
	//Used to see if an action can be traversed to
	//ARGUMENTS:
	//	precondition(Precondition) - the precondition to be evaluated
	//RETURN bool - is the precondition true
	function evaluatePrecondition(precondition){
		//find the character for that characteristic
		var char = that.characterDB.getCharacter(precondition.characterName);
		var characteristics = char.characteristics;

		//Get the characteristic
		var characteristic = char.characteristics[precondition.cls];
		//If the characteristic doesn't exist for that character, we just use the default value for that character
		if(characteristic == undefined){
			//Get sdbClass values for that characteristic
			var sdbClass = that.SDB.SDBClasses[precondition.cls];
			if(sdbClass == undefined){
				alert("Error: There's no class called " + precondition.cls + ". Look in " + precondition.characterName + "'s Story Tree.");
				return;
			}

			characteristic = new Characteristic(precondition.cls, precondition.type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);
			//Quickly load that characteristic into the character
			char.setCharacteristic(characteristic);

		} else {
			characteristic = characteristic[precondition.type];
			if(characteristic == undefined){
				//Get sdbClass values for that characteristic
				var sdbClass = that.SDB.SDBClasses[precondition.cls];
				var sdbval = sdbClass.types[precondition.type];
				if(sdbval == undefined){
					alert("Error: There's no type called " + precondition.type + ". Look in " + precondition.characterName + "'s Story Tree.");
					return;
				}

				characteristic = new Characteristic(precondition.cls, precondition.type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);
				//Quickly load that characteristic into the character
				char.setCharacteristic(characteristic);
			}
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

	//Private function that evaluates an expression and sets up its Memory value
	//ARGUMENTS:
	//	expression(Expression) - the expression to be evaluates
	//	memory(Memory) - what we're setting up
	//RETURN void
	function evaluateExpression(expression, memory){
		//find the character for that characteristic
		var char = that.characterDB.getCharacter(expression.characterName);
		var characteristics = char.characteristics;

		//Get the characteristic
		var characteristic = char.characteristics[expression.cls];
		//If the characteristic doesn't exist for that character, we just use the default value for that character
		if(characteristic == undefined){
			//Get sdbClass values for that characteristic
			var sdbClass = that.SDB.SDBClasses[expression.cls];
			if(sdbClass == undefined){
				alert("Error: There's no class called " + expression.cls + ". Look in " + expression.characterName + "'s Speak Tree.");
				return;
			}

			characteristic = new Characteristic(expression.cls, expression.type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);
			//Quickly load that characteristic into the character
			char.setCharacteristic(characteristic);

		} else {
			characteristic = characteristic[expression.type];
			if(characteristic == undefined){
				//Get sdbClass values for that characteristic
				var sdbClass = that.SDB.SDBClasses[expression.cls];
				var sdbval = sdbClass.types[expression.type];
				if(sdbval == undefined){
					alert("Error: There's no type called " + expression.type + ". Look in " + expression.characterName + "'s Story Tree.");
					return;
				}

				characteristic = new Characteristic(expression.cls, expression.type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);
				//Quickly load that characteristic into the character
				char.setCharacteristic(characteristic);
			}
		}

		//Okay, now we can assume that we have the correct characteristic, and now we can evaluate it
		memory.encodeVecValue(expression, characteristic);
	}

	//Private function that traverses the non-binary StoryTree
	//Recursively goes through the tree and finds each available action
	//ARGUMENTS:
	//	uidPath([int]) - the uid array of the actions that have been traversed
	//	uid(int) - the next uid to traverse to
	//	memory(Memory) - the memory vector that we're setting up
	//return void
	function traverse(uidPath, uid, memory, cls){
		counter++;
		if(counter > 5000){
			console.log(uid);
		}

		//Get action object
		var actionObj = tree.actions[uid];

		//evaluate each precondition for the action object
		var trig = false;
		for(var j = 0; j < actionObj.preconditions.length; j++){
			var pre = actionObj.preconditions[j];

			//check to see if we get a false value
			if(!evaluatePrecondition(pre)){
				trig = true;
				break;
			}
		}

		//If something doesn't pass, we return
		if(trig) return;

		//Now we can loop through each expression and evaluate them
		for(var k = 0; k < actionObj.expressions.length; k++){
			var exp = actionObj.expressions[k];

			//Evaluate the expression and write to the hypothetical memory
			evaluateExpression(exp, memory);
		}

		//We can assume now that we've succesfully passed the preconditions
		//This means we can add the action to the uid list
		uidPath.push(uid);

		//Now we have to see if there's a class for this action
		//If so, we add it to the list
		var myClass = "";
		if(actionObj.cls != undefined && cls === ""){
			myClass = actionObj.cls;
		} else {
			myClass = cls;
		}

		//If the action is a leaf, push the uidPath on the available paths
		// and then push a new distance to conversation types on dists
		if(actionObj.isLeaf()){
			uids.push(uidPath);

			var combineMem = Memory.prototype.combine(myCharacter.memBank.totalMemVec, memory, myCharacter.memBank.timeStep);
			var normMem = combineMem.normalize();
			//Get the dot product
			var dotproduct = normMem.dot(normalComposedMemory);
			var dotproduct = Math.round(dotproduct * 1000) / 1000
			//Get the dist to the conversation type
			var dist = Math.abs(that.conversationType - dotproduct);

			dists.push(dist);

			classes.push(myClass);

			return;
		}

		//Now we run the traversal algorithm for each child action
		for(var i = 0; i < actionObj.children.length; i++){
			var actionUID = actionObj.children[i];
			var action = tree.actions[actionUID];

			traverse(uidPath.slice(), actionUID, memory.copy(), myClass);
		}
	}

	//loop through each top action, traversing through their corresponding trees
	//keep track of which actions we've added and how many were added
	//We also have to create hypothetical memory vectors for each uidPath we want
	//We also want to track our similarity to the conversation types we want
	//We also need to track which classes our actionPaths contain
	var uids = [];
	var dists = [];
	var classes = [];
	var normalComposedMemory = myCharacter.memBank.totalMemVec.normalize();
	var counter = 0;
	for(var a = 0; a < tree.firsts.length; a++){
		var actionUID = tree.firsts[a];

		traverse([], actionUID, new Memory(), "");
	}

	//
	//Now that we have our list of doable action paths, we need to sort them by salience,
	//         and then eliminate any that have the same class that are lower priority than another
	//

	var sortedDists = dists.slice();
	sortedDists.sort(function(a, b){
		return a - b;
	});
	var sortedIndeces = [];
	var identicalGroups = {};
	var lastGroup = -1;
	for(var b = 0; b < sortedDists.length; b++){
		var index = dists.indexOf(sortedDists[b]);

		//Apparently this happens a lot?
		if(index === -1){
			continue;
		}

		if(dists.indexOf(-(dists[b])) !== -1){
			if(lastGroup !== -dists[b]){
				identicalGroups[dists[b]] = [];
				lastGroup = -dists[b];
			}
			identicalGroups[dists[b]].push(index)
		}

		dists[b] = -(dists[b]);
		sortedIndeces.push(index);
	}


	//Now, we have to return the correct uidPaths in order, make sure to skip over repeat classes
	var count = numOfOptions;
	var d = 0;
	var sorted = [];
	var myClasses = [];
	while(count !== 0 && d !== uids.length){

		//Get our key value for a group that we want to randomize
		//If it's part of a group, choose a random d
		var key = -(dists[ sortedIndeces[d] ]);
		if(identicalGroups[key] !== undefined && identicalGroups[key].length > 1){
				d = identicalGroups[key][Math.floor(Math.random()*identicalGroups[key].length)];
		}

		//If we haven't visited the class of the first path, add that path to sorted
		//Add the class to our tracked classes
		//decrement the count
		if(myClasses.indexOf(classes[ sortedIndeces[d] ]) === -1 || classes[ sortedIndeces[d] ] === "" ){
			if(uids[sortedIndeces[d]] == undefined){
				d++;
				continue;
			}
			myClasses.push(classes[ sortedIndeces[d] ]);
			sorted.push(uids[ sortedIndeces[d] ]);

			count--;
		}

		//Increment the next position on the sorted indeces
		d++;
	}


	//return the list of uids for doable actions
	return sorted;

}

//StoryTree.getActionName(String character, int uid)
//Given a character and a uid for an action, return the name of that action
//ARGUMENTS:
//	character(String) - the name of the character with the action you want
//	uid(int) - the action's uid
//return String -the name of the corresponding action
StoryTree.prototype.getActionName = function(character, uid){

	var that = this;

	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.getActionName(character, uid)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//find the right character and their tree
	var tree = that.characterDB.getCharacter(character).tree;

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

//StoryTree.isLoaded()
//Just a simple function to tell if it's been loaded
//RETURN bool - have the JSONs been loaded
StoryTree.prototype.isLoaded = function(){
	return !(this.loadingSDB || this.loadingActions || this.loadingCharacters || this.loadingCharacteristics || this.loadingPreconditions || this.loadingExpressions);
}

//StoryTree.executeAction()
//Executes a given action for a given character
//ARGUMENTS:
//	character(String) - Name of the character
//	uidPath([int]) - uids of the action path to be executed
//RETURN void
StoryTree.prototype.executeAction = function(character, uidPath){
	var that = this;

	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.getActionName(character, uid)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Get action tree for character
	var tree = that.characterDB.getCharacter(character).tree;

	//If the tree is undefined, that means that there's no character with that name
	//Error checking
	if(tree == undefined){
		alert("executeAction() Error: There's no character with the name " + character);
		return;
	}

	//Create a memory object to be added to the character's memBank
	var memory = new Memory();
	//set the actionPath in the memory
	memory.encodeActions(uidPath);

	//Loop through each action in the uidList and execute that action
	for(var i = 0; i < uidPath.length; i++){

		//get the object of the action
		var uid = uidPath[i];
		var actionObj = tree.actions[uid];

		//If the uid is undefined, that means that there's no corresponding action
		//Error checking
		if(tree.actions[uid] == undefined){
			alert("executeAction() Error: There's no uid with the number " + uid);
			return;
		}

		//Now loop through all expressions of the action
		for(var j = 0; j < actionObj.expressions.length; j++){
			var exp = actionObj.expressions[j];
			//console.log(actionObj);

			//Get the correct character for that expression
			var char = that.characterDB.getCharacter(exp.characterName);

			//Check if the characteristic exists for that character,
			//If not, we just use the default value for that character
			var characteristic = char.characteristics[exp.cls];
			if(characteristic == undefined){
				//Get sdbClass values for that characteristic
				var sdbClass = that.SDB.SDBClasses[exp.cls];
				if(sdbClass == undefined){
					alert("Error: There's no class called " + exp.cls + ". Look in " + exp.characterName + "'s Action Tree.");
					return;
				}

				characteristic = new Characteristic(exp.cls, exp.type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);
				//Quickly load that characteristic into the character
				char.setCharacteristic(characteristic);

			}
			//Now we have to check if the type exists too
			else {
				if(characteristic[exp.type] == undefined){
					//Get sdbType values for that characteristic
					var cls = that.SDB.SDBClasses[exp.cls];
					var sdbType = cls.types[exp.type];
					if(sdbType == undefined){
						alert("Error: There's no sdb type called " + exp.type + " for the class " + exp.cls + ". Look in " + exp.characterName + "'s Action Tree.");
						return;
					}

					characteristic = new Characteristic(exp.cls, exp.type, cls.min, cls.max, cls.isBoolean, cls.defaultVal);
					//Quickly load that characteristic into the character
					char.setCharacteristic(characteristic);
				}
				//Now we can finally assume that the characteristic is in the system
				else {
					characteristic = characteristic[exp.type];
				}
			}

			//Now we want to encode the expression into the character's memory, before we execute the change
			memory.encodeVecValue(exp, characteristic);

			//parse the action for that character
			char.parseExpression(exp.cls, exp.type, exp.operation, exp.value);
		}
	}

	//After all of that, we want to add the memory to the memBank
	that.characterDB.getCharacter(character).memBank.addMemory(memory);
}

//StoryTree.getCharacters()
//Get the names of all available characters
//	return([string]) - list of all characters that are available in the StoryTree
StoryTree.prototype.getCharacters = function(){

	//check to see if we're still loading JSON
	var that = this;
	if(!this.isLoaded()){
		var l = function(){that.getCharacters();};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	return this.characterDB.getListOfCharacters();
}

//StoryTree.getCharacteristics()
//ARGUMENTS:
//	character(string) - the name of the character whose characteristics we want
//RETURN [ {cls(string), type(string), value(string)} ] (a list of basic javascript objects with relevant info)
StoryTree.prototype.getCharacteristics = function(character){

	//check to see if we're still loading JSON
	var that = this;
	if(!this.isLoaded()){
		var l = function(){that.getCharacteristics(character);};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//First error check to see if the character exists
	if(!this.characterDB.getCharacter(character)){
		alert("getCharacteristics() Error: The character does not exist.");
	}

	//Get our proper characteristic objects (to be converted to basic objects)
	var characteristics = this.characterDB.getCharacter(character).characteristics;

	//Build up the list of objects
	var chars = [];
	for(var key in characteristics){
		var characteristicCls = characteristics[key];
		for(var tKey in characteristicCls){
			var characteristic = characteristicCls[tKey];

			chars.push({
				class: characteristic.className,
				type: characteristic.type,
				value: characteristic.value
			});
		}
	}

	//Return that list
	return chars;
};

//StoryTree.getAllPaths(name)
//This is more of a utility function for dialogue than a user facing one,
//But this can still tell users a lot about how many actions could be taken
//This function will retrieve a double list of all available action paths in a
//tree for a given character
//ARGUMENTS:
//  name(string) - the name of the character
//RETURN [[int]]
StoryTree.prototype.getAllPaths = function(name){
  var that = this;

	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.getAllPaths(name)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Grab the correct character and tree
	var character = this.characterDB.getCharacter(name);
	var tree = character.tree;

	//This variable is the set of all sets of uids, will be returned
	var doubleActionList = [];

  //function for recursing through the tree
  function traverse(uid, actionList){
		//push uid onto the list
		actionList.push(uid);

		//Get the action Object
		var action = tree.actions[uid];

		//If the action is a leaf, attach current action list to doubleActionList,
		//Then return
		if(action.isLeaf()){
			doubleActionList.push(actionList);
			return;
		}

		//Loop through the action's children
		for(var i = 0; i < action.children.length; i++){
			var nextUID = action.children[i];

			//Call traverse on the next child
			traverse(nextUID, actionList.slice());
		}
  }

	//Call traversal for all first uids
	for(var i = 0; i < tree.firsts.length; i++){
		var first = tree.firsts[i];
		traverse(first, []);
	}

	return doubleActionList;

};
