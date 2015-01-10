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
*	characteristics([Characteristics]) - Double Hash table containing the set of proper characteristics, hashing class and type
*	tree(STree) - Actual STree for that character
*	
*/  
var Character = function(name){
	this.name = name;

	this.characteristics = {};
	this.tree = {};
}

//Character.addCharacteristic(String cls, String type, int min, int max, bool isBoolean, int or bool defaultVal)
//Sets up the double hash of the characteristic, and also creates a new corresponding Chracteristic
//ARGUMENTS:
//	cls(String) - SDBClass
//	type(String) - Type of that class
//	min(int) - minimum limit on value
//	max(int) - maximum limit on value
//	isBoolean(bool) - is the characteristic a boolean
//	defaultVal(bool or int) - is the starting value of the characteristic
//RETURN void
Character.prototype.addCharacteristic = function(cls, type, min, max, isBoolean, defaultVal){
	this.characteristics[cls] = {};
	this.characteristics[cls][type] = new Characteristic(cls, type, min, max, isBoolean, defaultVal);
}

//Character.parseExpression(cls, type, operation, value)
//Parses an expression on a characteristic, passed on to member
//ARGUMENTS:
//	cls(String) - SDBClass
//	type(String) - Type of that class
//	operation(String) - The way the expression is set
//	value(int or bool) - What value is parsed
Character.prototype.parseExpression = function(cls, type, operation, value){
	if(value !== undefined) this.characteristics[cls][type].parseExpression(operation, value);
}

Character.prototype.setSpeakTree = function(tree){
	this.tree = tree;
}