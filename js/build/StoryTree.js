/*
* SDBClass, represents a category of social space that can be used 
*	name(String): the name of the category Class
*	types({String}): Lookup Table of the subcategory names
*	isBoolean(bool): is the category expressed as a boolean or a number
*	min(int): minimum number the value can go to (only if not boolean)
*	max(int): minimum number the value can go to (only if not boolean)
*	defaultVal(int or bool): default value
*
*/
var SDBClass = function(name, types, isBoolean, min, max, defaultVal){
	this.name = name;
	this.types = {};
	//Store each type as a key, making lookup effiecient
	for(var i = 0; i < types.length; i++){
		this.types[types[i]] = true;
	}
	this.isBoolean = isBoolean;
	if(!isBoolean) {
		this.min = min;
		this.max = max;
	}
	this.defaultVal = defaultVal; 
};

/*
* SDB stands for "Story Database", contains a set of SDBClasses
* Can be expressed as Predicates or Characteristics
*
*	SDBClasses(Lookup table): used to contain a set of SDBClasses, made a Lookup table for easy lookup
*/
var SDB = function(){
	this.SDBClasses = {};
}

//SDB.addClass(SDBClass cls)
//Adds the SDBClass into the SDB
//	ARGUMENTS:
//		cls(SDBCLass) - the class being added to SDB 
//	RETURN: void
SDB.prototype.addClass = function(cls){
	//SDBClass is added in a Lookup table for easy type lookup
	this.SDBClasses[cls.name] = cls;
}

/*
* Characteristic class, a Characteristic can be attached to either the world or a character
*
*	className(string): Name of the class
*	type(string): Name of the type
*	value(int or bool): value of the characteristic, defaults to defaultVal
*	min(int): min value
*	max(int): max value
*/
var Characteristic = function(cls, type, min, max, isBoolean, defaultVal){
	this.className = cls;
	this.type = type;
	this.value = defaultVal;
	this.isBoolean = isBoolean;

	if(!isBoolean){
		this.min = min;
		this.max = max;
	} 
}

//Characteristic.parseExpression(String operation, int(or bool) value)
//Parses an Expression to change a characteristic
//ARGUMENTS:
//	operation(String) - specifies how the characteristic changes
//	value(int or bool) - Amount of change made
//RETURN void
Characteristic.prototype.parseExpression = function(operation, value){
	switch(operation){
		case "=" : this.setVal(value);
				   break;
		case "+" : this.addVal(value);
				   break;
		case "-" : this.subVal(value);
				   break;
	}
}

//Characteristic.addVal(int delta)
//Subtracts value to an int characteristic
//ARGUMENTS:
//  delta(int) - amount added to value
//RETURN void
Characteristic.prototype.addVal = function(delta){
	if(this.value + delta > this.max) {
		this.value = this.max;
	} else {
		this.value += delta;
	}
}

//Characteristic.subVal(int delta)
//Subtracts value to an int characteristic
//ARGUMENTS:
//  delta(int) - amount subtracted from value
//RETURN void
Characteristic.prototype.subVal = function(delta){
	if(this.value - delta < this.min) {
		this.value = this.min;
	} else {
		this.value -= delta;
	}
}

//Characteristic.setVal(int(or bool) delta)
//Manually sets a characteristic
//ARGUMENTS:
//  val(int or bool) - value to set
//RETURN void
Characteristic.prototype.setVal = function(val){
	this.value = val;
}



/*Character class, a character is an enitity that can have characteristics and a Speak Tree
*
*	name(String) - Unique name of the character
*	characteristics([Characteristics]) - Double Lookup table containing the set of proper characteristics, Lookuping class and type
*	tree(STree) - Actual STree for that character
*	
*/  
var Character = function(name){
	this.name = name;

	this.characteristics = {};
	this.tree = {};
}

//Character.addCharacteristic(String cls, String type, int min, int max, bool isBoolean, int or bool defaultVal)
//Sets up the double Lookup of the characteristic, and also creates a new corresponding Chracteristic
//ARGUMENTS:
//	cls(String) - SDBClass
//	type(String) - Type of that class
//	min(int) - minimum limit on value
//	max(int) - maximum limit on value
//	isBoolean(bool) - is the characteristic a boolean
//	defaultVal(bool or int) - is the starting value of the characteristic
//RETURN void
Character.prototype.addCharacteristic = function(cls, type, min, max, isBoolean, defaultVal){
	if(this.characteristics[cls] == undefined) this.characteristics[cls] = {};
	this.characteristics[cls][type] = new Characteristic(cls, type, min, max, isBoolean, defaultVal);
}

Character.prototype.setCharacteristic = function(characteristic){
	if(this.characteristics[characteristic.className] == undefined) this.characteristics[characteristic.className] = {};
	this.characteristics[characteristic.className][characteristic.type] = characteristic;
}

//Character.parseExpression(cls, type, operation, value)
//Parses an expression on a characteristic, passed on to member
//ARGUMENTS:
//	cls(String) - SDBClass
//	type(String) - Type of that class
//	operation(String) - The way the expression is set
//	value(int or bool) - What value is parsed
Character.prototype.parseExpression = function(cls, type, operation, value){
	if(this.characteristics[cls][type] !== undefined) {
		this.characteristics[cls][type].parseExpression(operation, value);
	}
}

Character.prototype.setStoryTree = function(tree){
	this.tree = tree;
}

/* Precondition class, used to decide if an action can be performed
*	
*	character(string) - name of the character to evaluate
*	cls(string) - the SDBClass to evaluate
*	type(string) - the type to evaluate
*	operation(string) - the comperator to evaluate with
*	value(int or bool) - the the value to compare
*/
var Precondition = function(character, cls, type, operation, value){
	this.characterName = character;
	this.cls = cls;
	this.type = type;
	this.operation = operation;
	this.value = value;
}

/* Expression class, used to change characteristics
*	
*	character(string) - name of the character to evaluate
*	cls(string) - the SDBClass to evaluate
*	type(string) - the type to evaluate
*	operation(string) - the comperator to evaluate with
*	value(int or bool) - the the value to compare
*/
var Expression = function(character, cls, type, operation, value){
	this.characterName = character;
	this.cls = cls;
	this.type = type;
	this.operation = operation;
	this.value = value;
}

/* Action class, an action that can be executed by interacting with a character
*Can only be executed when preconditions are met, and then expressions are evaluated when action is executed 
*	
*	name(string) - name of the action to take, can be anything
*	uid(int) - unique id for every action for ease of access
*	preconditions([Precondition]) - array of preconditions to access action
*	expressions([Expression]) - array of Expressions to evaluate when the action is completed
*	children([int]) - child Action ids
*	parent(int) - uid of the parent action
*/
var Action = function(name, uid){
	this.name = name;
	this.uid = uid;

	this.preconditions = [];
	this.expressions = [];

	this.children = [];
	this.parent = 0;
}

//Adds a precondtion to the action
Action.prototype.addPrecondition = function(character, cls, type, operation, value){
	this.preconditions.push(new Precondition(character, cls, type, operation, value));
}

//Adds an expreesion to the action
Action.prototype.addExpression = function(character, cls, type, operation, value){
	this.expressions.push(new Expression(character, cls, type, operation, value));
}

//Adds a pointer to another action in the form as a reference to its uid
Action.prototype.addChild = function(uid){
	this.children.push(uid);
}

//Sets the pointer to the parent uid
Action.prototype.setParent = function(uid){
	this.parent = uid;
}

//Test to see if the Action is a leaf
Action.prototype.isLeaf = function(){
	return (this.children.length === 0);
}

//Test to see if the Action is a first
Action.prototype.isFirst = function(){
	return (this.parent === 0);
}

/* STree class
*
*	firsts([int]) - array of action uids that are at the top of the tree 
*	actions([int]) - Lookup table of uids mapped to actions
*
*/
var STree = function(){
	this.firsts = [];
	this.actions = {};
}

//add an action to the top of the Speak Tree
STree.prototype.addFirst = function(uid){
	this.firsts.push(uid);
}

//map an action to a uid
STree.prototype.mapAction = function(name, uid){
	this.actions[uid] = new Action(name, uid);
}

var StoryTree = function(){
	this.SDB = new SDB();
	this.characters = [];

	this.loadingSDB = false;
	this.loadingCharacters = false;
	this.loadingTree = false;
};

// StoryTree.setSDB(String path)
// Set up the SDB of the StoryTree
// ARGUMENTS:
//	path(String) - the file path to the local json file representing the SDB
// RETURN void
StoryTree.prototype.setSDB = function(path){
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

//StoryTree.setChracters(String path)
//Set up the characters of the StoryTree
//ARGUMENTS:
//	path(String) - the file path to the local json file representing the characters and the characteristics
//RETURN void
StoryTree.prototype.setCharacters = function(path){
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

//StoryTree.setTrees(String path)
//Set up the the actual Trees of the StoryTree
//ARGUMENTS:
//	path(String) - the file path to the local folder that holds all of the characters' Trees, these files have to be the same as the name of the character
//RETURN void
StoryTree.prototype.setTrees = function(path){

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
		var newPath = path + char.name + ".json";

		var request = new XMLHttpRequest();
		request.open('GET', newPath, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		    var data = JSON.parse(request.responseText);

		    //Code once data has been parsed

		    //Create Speak tree and set it to the character
		    var sTree = new STree();
		    char.setStoryTree(sTree);

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

//StoryTree.getOptions(int numOfOptions)
//Return a number of options in a specific characters StoryTree
//ARGUMENTS:
//	character(String) - character name
//	numOfOptions(int) - number of options for that character
//RETURN [int] uids - an array of the action uids available to execute
StoryTree.prototype.getOptions = function(character, numOfOptions){

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

	//Private function that traverses the non-binary StoryTree
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

	//loop through each top action, traversing through their corresponding trees
	//keep track of which actions we've added and how many were added
	var uids = [];
	var counter = numOfOptions;
	for(var j = 0; j < tree.firsts.length; j++){

		

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

//StoryTree.getActionName(String character, int uid)
//Given a character and a uid for an action, return the name of that action
//ARGUMENTS:
//	character(String) - the name of the character with the action you want
//	uid(int) - the action's uid
//return String -the name of the corresponding action
StoryTree.prototype.getActionName = function(character, uid){

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

//StoryTree.isLoaded()
//Just a simple function to tell if it's been loaded
//RETURN bool - have the JSONs been loaded
StoryTree.prototype.isLoaded = function(){
	return !(this.loadingSDB || this.loadingTree || this.loadingCharacters);
}

//StoryTree.executeAction()
//Executes a given action for a given character
//ARGUMENTS:
//	character(String) - Name of the character
//	uid(int) - uid of the action to be executed
//RETURN void
StoryTree.prototype.executeAction = function(character, uid){
	var that = this;

	//check to see if we're still loading JSON
	if(this.loadingSDB || this.loadingCharacters || this.loadingTree){
		var l = function(){that.getActionName(character, uid)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Get action tree for character
	var tree;
	for(var i = 0; i < this.characters.length; i++){
		if(this.characters[i].name === character) tree = this.characters[i].tree;
	}

	//If the tree is undefined, that means that there's no character with that name
	//Error checking
	if(tree == undefined){
		alert("executeAction() Error: There's no character with the name " + character);
		return;
	}

	//Private function, recursively executes an action and executes all parents
	//ARGUMENTS:
	//	uid(int) - uid of the action to execute
	function execute(uid){

		//loop through all expressions of the action
		var actionObj = tree.actions[uid];
		for(var i = 0; i < actionObj.expressions.length; i++){
			var exp = actionObj.expressions[i];

			//Get the correct character for that expression
			var char;
			for(var k = 0; k < that.characters.length; k++){
				if(that.characters[k].name === exp.characterName) {
					char = that.characters[k];
					break;
				}
			}

			//Check if the characteristic exists for that character, 
			//If not, we just use the default value for that character
			if(char.characteristics[exp.cls] == undefined){
				//Get sdbClass values for that characteristic
				var sdbClass = that.SDB.SDBClasses[exp.cls];
				if(sdbClass == undefined){
					alert("Error: There's no class called " + exp.cls + ". Look in " + exp.characterName + "'s Speak Tree.");
					return;
				}

				characteristic = new Characteristic(exp.cls, exp.type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);
				//Quickly load that characteristic into the character
				char.setCharacteristic(characteristic);

			}

			//parse the action for that character
			char.parseExpression(exp.cls, exp.type, exp.operation, exp.value);

		}

		//if the action is a first, then finish the stack
		//if not, recursively call execute on parent
		if(actionObj.isFirst()){
			return;
		} else {
			execute(actionObj.parent);
		}
	}

	//If the uid is undefined, that means that there's no corresponding action
	//Error checking
	if(tree.actions[uid] == undefined){
		alert("executeAction() Error: There's no uid with the number " + uid);
		return;
	}

	execute(uid);
}

//StoryTree.getCharacters()
//Get the names of all available characters
//	return([string]) - list of all characters that are available in the StoryTree
StoryTree.prototype.getCharacters = function(){
	var charList = [];
	for(var i = 0; i < this.characters.length; i++){
		charList.push(this.characters[i].name);
	}
	return charList;
}

StoryTree.prototype.getCharacteristics = function(character){
	for(var i = 0; i < this.characters.length; i++){
		if(this.characters[i].name === character) return character.characteristics;
	}

	//If no character is found by the end of the loop, then that character doesn't exist
	//Error checking
	alert("getCharacteristics() Error: the character " + character + " doesn't exist");
}