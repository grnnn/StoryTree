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

/*Memory class, contains a plethora of info pertaining to an action path taken by a player
*
* memoryVec(map<string, float>) - maps a distinct class:type string to the amount of change done in that expression(0-1)
* actionPath(string) - set of actions taken in string notation (separated by :)
*/
var Memory = function(){
	this.memVec = {};
	this.actionPath = "";
}

//Memory.copy()
//Copies a memory instance and returns a new one
//ARGUMENTS void
//RETURN Memory
Memory.prototype.copy = function(){
	//The new memory object
	var newMem = new Memory();

	//copy the action path
	newMem.encodeActions(this.actionPath);

	//Now for each key-value of memory, create that new pair in newMem
	for(var key in this.memVec){
		newMem.memVec[key] = this.memVec[key];
	}

	//return the new memory
	return newMem;
}

//Memory.encodeVecValue(expression, characteristic)
//Sets the vector change value for a memory given an expression and its corresponding characteristic
//ARGUMENTS:
//	expression(Expression) - the expression that changes the world state
//	characteristic(Characteristic) - the thing that contains the world state value
//RETURN void
Memory.prototype.encodeVecValue = function(expression, characteristic){

	//Get the correct key for the vector value
	var key = expression.characterName + ":" + expression.cls + ":" + expression.type;

	//Create the float value that we're assigning in the vector,
	//see if we've already calculated some change for it
	var val = 0;
	if(this.memVec[key] != undefined){
		val = this.memVec[key];
	}

	//If the characteristic is a boolean, calculate the percent change
	if(characteristic.isBoolean){
		//There's no change if the 2 values are equal, simply return
		if(expression.value === characteristic.value){
			return;
		//Else there's 100% change
		} else {
			val += 1;
		}

	} else {
		//Depending on the operator, get the amount of change happening
		var oldval = characteristic.value;
		var changeVal = Math.abs(expression.value);
		var actualChange = 0;
		switch(expression.operation){
			case "+":
				if(oldval + changeVal > characteristic.max){
					actualChange = characteristic.max - changeVal;
				} else {
					actualChange = changeVal;
				}
				break;
			case "-":
				if(oldval - changeVal < characteristic.min){
					actualChange = characteristic.max - changeVal;
				} else {
					actualChange = changeVal;
				}
				break;
			case "=":
				actualChange = Math.abs(oldval - changeVal);
				break;
		}

		//Now calculate the percentage of the change
		var percentChange = actualChange/(characteristic.max-characteristic.min);

		//Finally, add to the existing val
		val += percentChange;
	}

	//Now we can finally encode the vector value
	this.memVec[key] = val;
}

//memory.normalize()
//Returns a normalized Memory object
//ARGUMENTS: void
//RETURN Memory
Memory.prototype.normalize = function(){
	//Create the thing we're returning
	var newMem = new Memory();
	//Set the action Path in the new memory
	newMem.encodeActions(this.actionPath);

	//Now loop through the existing keys in memvec to get the length of the vector
	var length = 0;
	for(var key in this.memVec){
		length += this.memVec[key] * this.memVec[key];
	}
	length = Math.sqrt(length);

	//Now loop through those keys again to do the normalizing
	for(var key in this.memVec){
		var normVal = this.memVec[key]/length;

		newMem.memVec[key] = normVal;
	}

	//Now we return the normalized memory vector
	return newMem;
};

//memory.dot(memory)
//Will take the dot product of 2 memory vectors, normalizes them, returns a similarity between 0 and 1
//ARGUMENTS:
//	memory(Memory) - another memory that we're dotting with this one
//return float
Memory.prototype.dot = function(memory){

	//We want to iterate through the memory with the smallest length, for efficiency's sake
	//find which vector that is
	var shorter;
	var longer;
	if(Object.keys(this.memVec).length > Object.keys(memory.memVec).length){
		shorter = this;
		longer = memory;
	} else {
		shorter = memory;
		longer = this;
	}

	//Start the dot product
	var dotProduct = 0;

	//Now iterate through the shorter vector
	for(var key in shorter.memVec){
		//Get the key of the shorter vec (we can assume it exists)
		var sKey = shorter.memVec[key];
		//Get the key of the longer vec (check if it's defined), assume it's 0 otherwise
		var lKey = 0;
		if(longer.memVec[key] != undefined){
			lKey = longer.memVec[key];
		}

		dotProduct += sKey * lKey;
	}

	//Now return the dotProduct
	return dotProduct;
}

//Memory.encodeActions(actions)
//Sets a set of actions into the actionPath string
//ARGUMENTS:
//	actions([int] or string) - set of actions to be encoded
//RETURN void
Memory.prototype.encodeActions = function(actions){

	if(Object.prototype.toString.call( actions ) === '[object Array]'){
		var actionString = "[" + actions[0] + ":";
		for(var i = 1; i < actions.length; i++){
			actionString += actions[i];
		}
		actionString += "]";

		this.actionPath = actionString;
		return;
	}

	if(typeof actions === "string"){
		this.actionPath = actions;
		return;
	}

	alert("Memory.encodeActions() error: the argument was not an array or a string.");
}

/*MemoryBank class, contains a list of Memories that is used as a heuristic for a getOptions search
*
* memories([Memory]) - a list of memories that is used to compare against possible outcomes
* timeStep(int) - Records now many times the player has interacted with this character
* normalizedMemVec(Memory) - a Memory composed of all previous memories, with a appropriate weighting
*/
var MemoryBank = function(){
	this.memories = [];
	this.timeStep = 0;

	this.totalMemVec = new Memory();
}

//MemoryBank.addMemory(memory)
//Adds a memory to the memory bank, assuming that it's been constructed correctly first
//ARGUMENTS:
//	memory(Memory) - the memory to be added
//RETURN void
MemoryBank.prototype.addMemory = function(memory){
	this.memories.push(memory);
	this.timeStep++;
	this.refreshVec();
}

//MemoryBank.refreshVec()
//To be called every time a decision is made, this will encode the most recent memory into the totalMemVec
//ARGUMENTS void
//RETURN void
MemoryBank.prototype.refreshVec = function(){
	//Get our most recent memory
	var memory = this.memories[this.timeStep-1];

	//Loop through that memory's memVec
	for(var key in memory.memVec){
		var val = memory.memVec[key];

		//If we have a value at that key already, get it before overwriting it
		var newVal = 0;
		if(this.totalMemVec.memVec[key] != undefined){
			newVal = this.totalMemVec.memVec[key];
		}

		//Get the correct weight for this timestep
		var weight = 0.1 * (this.timeStep-1);

		//Add the value and weight to the new value
		newVal += val + weight;

		//Now we can set the new vector value
		this.totalMemVec.memVec[key] = newVal;
	}
};

/*Character class, a character is an enitity that can have characteristics and a Speak Tree
*
*	name(String) - Unique name of the character
*	characteristics([Characteristics]) - Double Lookup table containing the set of proper characteristics, Lookuping class and type
*	tree(STree) - Actual STree for that character
*
*/
var Character = function(name){
	this.name = name;

	this.memBank = new MemoryBank();

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

//Character.setStoryTree(tree)
//Set the character's story tree
//ARGUMENTS:
//	tree(STree) - The story Tree
Character.prototype.setStoryTree = function(tree){
	this.tree = tree;
}

/*CharacterDB Class, contains a lookup table of all characters for easy lookup
*
*	characters([Character]) - The lookup table of all characters
*
*/
var CharacterDB = function(){
	this.characters = {};
}

//CharacterDB.addCharacter(name)
//Add a character to the database
//ARGUMENTS:
//	name(string) - The name of the new character
CharacterDB.prototype.addCharacter = function(name){
	this.characters[name] = new Character(name);
}

//CharacterDB.getCharacter(name)
//Return the proper character in the database
//ARGUMENTS:
//	name(string) - The name of the character you want to find
CharacterDB.prototype.getCharacter = function(name){
	return this.characters[name];
}

//CharacterDB.isEmpty()
//Is the database empty?
//	ARGUMENTS:
//	RETURN bool
CharacterDB.prototype.isEmpty = function(){
	var counter = 0;
	for(var char in this.characters){
		counter++;
	}
	return (counter === 0);
}

//CharacterDB.getListOfCharacters()
//Retrieve the list of all loaded characters
//	Return [string]
CharacterDB.prototype.getListOfCharacters = function(){
	var chars = [];
	for(var charac in this.characters){
		chars.push(charac);
	}
	return chars;
}

//CharacterDB.checkCharacters(chars)
//Check the JSON formatting of the list of characters
//ARGUMENTS:
//	chars([string]) - array of all characters to be added
//RETURN bool - is the JSON data bad
CharacterDB.prototype.checkCharacters = function(chars){
	//Track if the formatting is bad somewhere
	//Also track error messages
	var isBad = false;
	var errorString = "";

	//First check the characters to see if they are in an array
	if(Object.prototype.toString.call( chars ) !== '[object Array]'){
		isBad  = true;
		errorString += "Your characters are not in an array. \n"
	} else {
		for(var i = 0; i < chars.length; i++){
			if(typeof chars[i] !== "string"){
				isBad = true;
				errorString += "Your character at position " + i + " is not a string. \n";
			}
		}
	}

	//If the characters are bad somehow, we alert a giant error message
	if(isBad){


		//Build up our characters in a string, since the dafault string for an array is [Object Array]
		var charArray = "[" + chars[0];
		for(var j = 0; j < chars.length; j++){
			charArray += (", " + chars[j]);
		}
		charArray += "]";

		//Alert the user of all of the bad formatting
		alert("***Error: Improper Character format.*** \n \n "
			+ "You're receiving this because you improperly formatted your list of characters in your character file. \n"
			+ "Your characters: \n"
			+ charArray + " \n\n"
			+ "Other error info: \n" + errorString);
	}

	return isBad;
}

//Check the JSON formatting of a characteristic
//ARGUMENTS:
//	name(string) - name of the character
//	cls(string) - name of the class
//	type(string) - type of that class
//	val(int or bool) - value of the class
CharacterDB.prototype.checkCharacteristic = function(name, cls, type, val){
	//Track if the formatting is bad somewhere
	//Also track error messages
	var isBad = false;
	var errorString = "";

	//Check if the name is a string, if it is, check if it's in the database
	if(typeof name !== "string"){
		isBad = true;
		errorString += "Your character name is not a string. \n";
	} else if(this.characters[name] == undefined){
		isBad = true;
		errorString += "You didn't define the character " + name + " in your character file before using them in a characteristic. \n"
	}

	//Check to see if the class is a string too
	if(typeof cls !== "string"){
		isBad = true;
		errorString += "Your class is not a string. \n";
	}

	//Check to see if the type is a string
	if(typeof type !== "string"){
		isBad = true;
		errorString += "Your type is not a string. \n";
	}

	//Check to see if the value is a bool or int
	if(typeof val !== "boolean" && typeof val !== "number"){
		isBad = true;
		errorString += "Your value is not a boolean or an int. \n";
	}

	if(isBad){
		//Alert the user of all of the bad formatting
		alert("***Error: Improper Characteristic format.*** \n \n "
			+ "You're receiving this because you improperly formatted one of your Characteristic objects in your Character JSON file. \n"
			+ "The bad Characteristic: \n"
			+ " -- name: " + name + " \n"
			+ " -- class: " + cls + " \n"
			+ " -- type: " + type + " \n"
			+ " -- value: " + val + " \n\n"
			+ "Other error info: \n" + errorString);
	}

	return isBad;
}