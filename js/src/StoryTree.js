/* StoryTree class, the top class with all client functions
*
* 	SDB(SDB) - The SDB of the StoryTree
* 	characters(CharacterDB) - The database of all characters
* 	loadingSDB(bool) - true if SDB is loading
*		loadingCharacters(bool) - true if Characters are loading
*		loadingTree(bool) - true if Trees are loading
*		badFormatting(bool) - if this is true, this aborts all loading functions
*		conversationType(float) - specifies how salient we want NPCs to be, 0.5(balanced) by default
*/
var StoryTree = function(){
	this.SDB = new SDB();
	this.characterDB = new CharacterDB();

	this.loadingSDB = false;
	this.loadingCharacters = false;
	this.loadingCharacteristics = false;
	this.loadingActions = false;

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
			for(var d = 0; d < action.preconditions.length; d++){
				var pre = action.preconditions[d];
				actionObj.addPrecondition(pre.character, pre.class, pre.type, pre.operation, pre.value);
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
	//TODO implement function
};

//StoryTree.setExpressions(character, id, info)
//Sets up expressions, given a character and an action id
//ARGUMENTS:
//	character(string) - the name of the character we're setting this up for
//	id(int) - the unique id of the action we're adding expressions to
//	info({} or path) - the file path to the local json file representing the expressions or an object literal representing the expressions
//RETURN void
StoryTree.prototype.setExpressions = function(character, id, info){
	//TODO implement function
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
			this.setCharacter(arg1);
			break;
		case "characteristic":
			this.setCharacteristics(arg1);
			break;
		case "action":
			//this.setActions(arg1, arg2);
			break;
		case "precondition":
			//this.setPreconditions(arg1, arg2, arg3);
			break;
		case "expression":
			//this.setExpressions(arg1, arg2, arg3);
			break;
		defualt:
			alert("set() error: argument one is not a recognized type of addable information.");
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
	var tree = that.characterDB.getCharacter(character).tree;

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

	//Private function that traverses the non-binary StoryTree
	//Recursively goes through the tree and finds each available action
	//ARGUMENTS:
	//	uid(int) - the uid of the action to be traversed
	//return void
	function traverse(uid){

		//console.log(uid);

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

		//We can assume now that we've succesfully passed the preconditions
		//This means we can add the action to the uid list
		uidList.push(uid);

		//If the action is a leaf, simply return
		if(actionObj.isLeaf()){
			uids.push(uidList);
			uidList = [];
			return;
		}

		//Now we run the traversal algorithm for each child action
		for(var i = 0; i < actionObj.children.length; i++){
			var actionUID = actionObj.children[i];
			var action = tree.actions[actionUID];

			traverse(actionUID);
		}
	}

	//loop through each top action, traversing through their corresponding trees
	//keep track of which actions we've added and how many were added
	var uids = [];
	var uidList = [];
	for(var a = 0; a < tree.firsts.length; a++){
		var actionUID = tree.firsts[a];

		traverse(actionUID);
	}

	//
	//Now that we have our list of doable action paths, we need to sort them by salience,
	//         and then eliminate any that have the same class that are lower priority than another
	//
	var sortedUIDs = [];
	for(var b = 0; b < uids.length; b++){
		var uidPath = uids[b];
	}

	//return the list of uids for doable actions
	return uids;

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
	return !(this.loadingSDB || this.loadingActions || this.loadingCharacters || this.loadingCharacteristics);
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
	for(var i = 0; i < characteristics.length; i++){
		var characteristic = characteristics[i];

		chars.push({
			class: characteristic.className,
			type: characteristic.type,
			value: characteristic.value
		})
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
			traverse(nextUID, actionList);
		}
  }

	//Call traversal for all first uids
	for(var i = 0; i < tree.firsts.length; i++){
		var first = tree.firsts[i];
		traverse(first, []);
	}

	return doubleActionList;

};
