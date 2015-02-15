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
	if(this.characters[name] == undefined) alert("CharacterDB.getCharacter() Error: There's no character with the name " + name);
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

//CharacterDB.checkCharacters(chars, characteristics)
//Check the JSON formatting of the list of characters, as well as their characteristics
//ARGUMENTS:
//	chars([string]) - array of all characters to be added
//	characteristics([Characteristics]) - array of characteristics to be added
//RETURN bool - is the JSON data bad
CharacterDB.prototype.checkCharacters = function(chars, characteristics){

}