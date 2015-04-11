/* StoryTree class, the top class with all client functions
*
* 	SDB(SDB) - The SDB of the StoryTree
* 	characters(CharacterDB) - The database of all characters
* 	loadingSDB(bool) - true if SDB is loading
*	loadingCharacters(bool) - true if Characters are loading
*	loadingTree(bool) - true if Trees are loading
*	badFormatting(bool) - if this is true, this aborts all loading functions
*/
var StoryTree = function(){
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
	
	//SDB.isEmpty()
	//Finds out if the SDB has any SDB classes in in
	//	ARGUMENTS:
	//	RETURN bool
	SDB.prototype.isEmpty = function(){
		var counter = 0;
		for(var cls in this.SDBClasses){
			counter++;
		}
		return (counter === 0);
	}
	
	//SDB.checkSDB(sdbClass.class, sdbClass.types, sdbClass.isBoolean, sdbClass.min, sdbClass.max, sdbClass.defaultVal)
	//Check the formatting a single SDBClass set of fields.
	//Also alert a informational message if the formatting is bad
	//	ARGUMENTS:
	//		class (string) - the name of the sdbClass
	//		types ([string]) - the name of each type in the sdbClass
	//		isBoolean (bool) - is the sdbClass value of type boolean
	//		min (int) - minimum integer value of the sdbClass
	//		max (int) - maximum integer value of the sdbClass
	//		defaultVal (int or bool) - default value of the sdbClass
	//	RETURN bool
	SDB.prototype.checkSDB = function(cls, types, isBoolean, min, max, defaultVal){
		//Track if the formatting is bad somewhere
		//Also track error messages
		var isBad = false;
		var errorString = "";
	
		//Also, since types are an array we have to build into a string, 
		//we need to track spefically how we want to error track types
		var typesBad = false;
	
		//Check if the class is not a string,
		//Else, check if the class name is unique
		if(typeof cls !== "string"){
			isBad = true;
			errorString += "Your class value is not a string. \n";
		} else {
			for(var clskey in this.SDBClasses){
				var sdbcls = this.SDBClasses[clskey];
	
				if(sdbcls.name === cls){
					isBad = true;
					errorString += "You've already created an SDB class with this name. \n"
				}
			}
		}
	
		// Check if the types are in an array,
		// else, check if each of the array elements are strings
		if(Object.prototype.toString.call( types ) !== '[object Array]'){
			isBad  = true;
			typesBad = true;
			errorString += "Your types are not in an array. \n"
		} else {
			for(var i = 0; i < types.length; i++){
				if(typeof types[i] !== "string"){
					isBad = true;
					errorString += "Your type at position " + i + " is not a string. \n";
				}
			}
		}
	
		//Check if isBoolean is a boolean...
		if(typeof isBoolean !== "boolean"){
			isBad = true;
			errorString += "Your isBoolean value is not a boolean. \n";
		}
	
		//If isBoolean, simply check if the defaultVal is also a boolean
		if(isBoolean){
			if(typeof defaultVal !== "boolean"){
				isBad = true;
				errorString += "Your defaultVal is not of type boolean, even though the class is of type boolean. \n"
			}
		//Else, we need to see if defaultVal, min, and max are numbers
		//We also need to check if the default is out of the range, as well as see if min < max
		} else {
			if(typeof defaultVal !== "number"){
				isBad = true;
				errorString += "Your defaultVal is not of type int, even though the class is of type int. \n"
			}
	
			if(typeof min !== "number"){
				isBad = true;
				errorString += "Your min is not a number. \n"
			}
	
			if(typeof max !== "number"){
				isBad = true;
				errorString += "Your max is not a number. \n"
			}
	
			if(min > defaultVal){
				isBad = true;
				errorString += "Your min is greater than your defaultVal. \n"
			}
	
			if(max < defaultVal){
				isBad = true;
				errorString += "Your max is greater than your defaultVal. \n"
			}
	
			if(min > max){
				isBad = true;
				errorString += "Your min is greater than your max. \n"
			}
		}
	
		//if something is wrong with the formatting, we print a giant error alert for the user
		if(isBad){ 
	
			// Since printing an array of stings will return [Object Array], I want to build up the type array as a string representation
			// If it's not an array, just rely on the simple default toString
			var typeArray = "";
			if( !typesBad ){
				typeArray = "[" + types[0];
				for(var j = 1; j < types.length; j++){
					typeArray += (", " + types[j]);
				}
				typeArray += "]";
			} else {
				typeArray = types;
			}
			
			//Alert the user of all of the bad formatting
			alert("***Error: Improper SDB format.*** \n \n "
				+ "You're receiving this because you improperly formatted one of your SDB Class objects in your SDB JSON file. \n"
				+ "The bad SDB Class: \n" 
				+ " -- class: " + cls + " \n"
				+ " -- types: " + typeArray + " \n"
				+ " -- isBoolean: " + isBoolean + " \n"
				+ " -- min: " + min + " \n"
				+ " -- max: " + max + " \n"
				+ " -- defaultVal: " + defaultVal + " \n\n"
				+ "Other error info: \n" + errorString);
		}
	
		//return whether or not the formatting went bad
		return isBad;
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
	
	//Check the formatting of the precondition fields, return error message of what could be wrong
	//ARGUMENTS:
	//	character(string) - the name of the character this applies to
	//	cls(string) - the name of the class this evaluates
	//	type(string) - the name of the type
	//	operation(string) - can be ">", "<", and "=="
	//	value(bool or int) - the value to be evaluated
	//RETURN string - the error string
	Precondition.prototype.checkPrecondition = function(character, cls, type, operation, value){
		//Track if the formatting is bad somewhere
		//Also track error messages
		var isBad = false;
		var errorString = "";
	
		//Check to see if the character is a string
		if(typeof character !== "string"){
			isBad = true;
			errorString += "The character of your precondition is not a string. \n";
		}
	
		//Check to see if the class is a string
		if(typeof cls !== "string"){
			isBad = true;
			errorString += "The class of your precondition is not a string. \n";
		}
	
		//Check to see if the type is a string
		if(typeof type !== "string"){
			isBad = true;
			errorString += "The type of your precondition is not a string. \n";
		}
	
		//Check to see if the operation makes sense
		if(operation !== ">" && operation !== "<" && operation !== "=="){
			isBad = true;
			errorString += "The operation of your precondition is not one of these three strings: '==', '<', '>'. \n";
		}
	
		//check if the value is an int or bool
		if(typeof value !== "boolean" && typeof value !== "number"){
			isBad = true;
			errorString += "The value of your precondition is not a boolean or an int. \n";
		}
	
		//We want to build our error message up if the precondition object has gone bad
		if(isBad){
			errorString = "***Error: Improper Precondition format.*** \n \n "
				+ "You're receiving this because you improperly formatted one of your Precondition objects. \n"
				+ "The bad Precondition: \n" 
				+ " -- character: " + character + " \n"
				+ " -- class: " + cls + " \n"
				+ " -- type: " + type + " \n"
				+ " -- operation: " + operation + " \n"
				+ " -- value: " + value + " \n\n"
				+ "Other error info: \n" + errorString;
		}
	
		//Return that string to be reported in the overall action check function
		return errorString;
	
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
	
	//Check the formatting of the expression fields, return error message of what could be wrong
	//ARGUMENTS:
	//	character(string) - the name of the character this applies to
	//	cls(string) - the name of the class this evaluates
	//	type(string) - the name of the type
	//	operation(string) - can be "+", "-", and "="
	//	value(bool or int) - the value to be evaluated
	//RETURN string - the error string
	Expression.prototype.checkExpression = function(character, cls, type, operation, value){
		//Track if the formatting is bad somewhere
		//Also track error messages
		var isBad = false;
		var errorString = "";
	
		//Check to see if the character is a string
		if(typeof character !== "string"){
			isBad = true;
			errorString += "The character of your expression is not a string. \n";
		}
	
		//Check to see if the class is a string
		if(typeof cls !== "string"){
			isBad = true;
			errorString += "The class of your expression is not a string. \n";
		}
	
		//Check to see if the type is a string
		if(typeof type !== "string"){
			isBad = true;
			errorString += "The type of your expression is not a string. \n";
		}
	
		//Check to see if the operation makes sense
		if(operation !== "+" && operation !== "-" && operation !== "="){
			isBad = true;
			errorString += "The operation of your expression is not one of these three strings: '=', '+', '-'. \n";
		}
	
		//check if the value is an int or bool
		if(typeof value !== "boolean" && typeof value !== "number"){
			isBad = true;
			errorString += "The value of your expression is not a boolean or an int. \n";
		}
	
		//We want to build our error message up if the expression object has gone bad
		if(isBad){
			errorString = "***Error: Improper Expression format.*** \n \n "
				+ "You're receiving this because you improperly formatted one of your Expression objects. \n"
				+ "The bad Expression: \n" 
				+ " -- character: " + character + " \n"
				+ " -- class: " + cls + " \n"
				+ " -- type: " + type + " \n"
				+ " -- operation: " + operation + " \n"
				+ " -- value: " + value + " \n\n"
				+ "Other error info: \n" + errorString;
		}
	
		//Return that string to be reported in the overall action check function
		return errorString;
	
	}
	
	/* Action class, an action that can be executed by interacting with a character
	*Can only be executed when preconditions are met, and then expressions are evaluated when action is executed 
	*	
	*	name(string) - name of the action to take, can be anything
	*	uid(int) - unique id for every action for ease of access
	*	preconditions([Precondition]) - array of preconditions to access action
	*	expressions([Expression]) - array of Expressions to evaluate when the action is completed
	*	children([int]) - child Action ids
	*	parents([int]) - uids of the parent actions
	*	class(String) - used to group actions together
	*/
	var Action = function(name, uid){
		this.name = name;
		this.uid = uid;
	
		this.preconditions = [];
		this.expressions = [];
	
		this.children = [];
		this.parents = [];
	
		this.cls = ""; 
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
	Action.prototype.addParent = function(uid){
		this.parents.push(uid);
	}
	
	//Sets the class of the action
	Action.prototype.setClass = function(cls){
		this.cls = cls;
	}
	
	//Test to see if the Action is a leaf
	Action.prototype.isLeaf = function(){
		return (this.children.length === 0);
	}
	
	//Test to see if the Action is a first
	Action.prototype.isFirst = function(){
		return (this.parents.length === 0);
	}
	
	//Check the formatting and usage of the action being made
	//ARGUMENTS:
	//	name(string or undefined) - the name of the action
	//	uid(int) - the unique id of the action 
	//	first(bool or undefined) - is the action the first?
	//	cls(string or undefined) - the category of the action
	//	preconditions([{}]) - List of Precondition objects to be evaluated
	//	expressions([{}] or undefined) - List of Expression objects to be evaluated
	//RETURN bool - is the action bad
	Action.prototype.checkAction = function(name, uid, first, cls, preconditions, expressions){
		//Track if the formatting is bad somewhere
		//Also track error messages
		var isBad = false;
		var errorString = "";
	
		//Check to see if the name of the action is a string or is not defined
		if(typeof name !== "string" && name !== undefined){
			isBad = true;
			errorString += "The name of your action is not a string. \n";
		}
	
		//Check to see if the uid is a number
		if(typeof uid !== "number"){
			isBad = true;
			errorString += "The uid of your action is not an int. \n";
		}
	
		//Check if first is a boolean of undefined (first is assumed false if not defined)
		if(typeof first !== "boolean" && first !== undefined){
			isBad = true;
			errorString += "The first of your action is not a boolean. \n";
		}
	
		//Check if the class of your object is a string or undefined
		if(typeof cls !== "string" && cls !== undefined){
			isBad = true;
			errorString += "The class of your action is not defined. \n";
		}
	
		//Check if the preconditions are in an array
		var preconditionErrors = "";
		if(Object.prototype.toString.call( preconditions ) !== '[object Array]'){
			isBad = true;
			errorString += "The preconditions of your action are not in an array. \n"
		} else {
			//If it is an array, then error check all preconditions of the action, record the string
			for(var i = 0; i < preconditions.length; i++){
				var precondition = preconditions[i];
				preconditionErrors += Precondition.prototype.checkPrecondition(precondition.character, precondition.class, precondition.type, precondition.operation, precondition.value);
			}
		}
	
		//If a precondition is bad, then make sure we mark it as bad
		if(preconditionErrors !== "") isBad = true;
	
		//Check if the expressions are in an array, they can be undefined too
		var expressionErrors = "";
		if(Object.prototype.toString.call( expressions ) !== '[object Array]'){
			if(expressions !== undefined){
				isBad = true;
				errorString += "The expressions of your action are not in an array. \n"
			}
		} else {
			//If it is an array, then error check all expressions of the action, record the string
			for(var i = 0; i < expressions.length; i++){
				var expression = expressions[i];
				expressionErrors += Expression.prototype.checkExpression(expression.character, expression.class, expression.type, expression.operation, expression.value);
			}
		}
	
		//If an expression is bad, make sure we mark it as bad
		if(expressionErrors !== "") isBad = true;
	
		//If the action has gone bad somehow, we want to alert the user and build up the error string
		if(isBad){
			var errorStarter = "***Error: Improper Action format.*** \n \n "
				+ "You're receiving this because you improperly formatted one of your Action objects. \n"
				+ "The bad Action: \n"
				+ " -- uid: " + uid + " \n";
	
				//Since these values can be undefined, we shouldn't list them unless they are defined
				if(name !== undefined){
					errorStarter += " -- name: " + name + " \n";
				}
	
				//Since these values can be undefined, we shouldn't list them unless they are defined
				if(first !== undefined){
					errorStarter += " -- first: " + first + " \n";
				}
	
				//Since these values can be undefined, we shouldn't list them unless they are defined
				if(cls !== undefined){
					errorStarter += " -- class: " + cls + " \n";
				}
	
				//Add the last bit of error info
				errorStarter += "Other error info: \n" + errorString;
	
				//If we have bad preconditions, we want to add that too
				if(preconditionErrors !== ""){
					errorStarter += "You also have at least 1 bad precondition: \n";
					errorStarter += preconditionErrors;
				}
	
				//If we have bad expressions, we want to add those as well
				if(expressionErrors !== ""){
					errorStarter += "You also have at least 1 bad expression: \n";
					errorStarter += expressionErrors;
				}
	
			alert(errorStarter);
		}
	
		//Return whether or not it's a bad action
		return isBad;
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
	
	//map an action to a uid, check if that uid has been defined
	STree.prototype.mapAction = function(name, uid){
		if(this.actions[uid] !== undefined){
			alert("Error: the uid " + uid + " has already been added");
		}
		this.actions[uid] = new Action(name, uid);
	}
	
	//Sets the class of an action, given a class and a uid
	STree.prototype.setClasses = function(uid, cls){
	
		var that = this;
	
		function setChildClass(uid){
	
			var actionObj = that.actions[uid];
	
			for(var i = 0; i < actionObj.children.length; i++){
				var childUID = actionObj.children[i];
	
				var child = that.actions[actionObj.children[i]];
	
				child.setClass(cls);
	
				if(child.isLeaf()){
					continue;
				} else {
					setChildClass(child.uid);
				}
			}
		}
	
		setChildClass(uid);
	}
	
	//Because action trees are created one action at a time, there are a thing that we should try to catch after it's built
	//We need to check if there are any infinite loops in the tree
	//ARGUMENTS: void
	//RETURN bool - true if the tree has an infinite loop
	STree.prototype.checkActionTree = function(){
	
		//Dereference the action tree object for use in the traveral functions
		var that = this;
	
		//This function recursively traverses through the action tree
		//If it runs into a repeated action in its traversal list, it prints an error message for the author
		function traverse(uid, currentActionList){
			//Push the uid onto the list
			currentActionList.push(uid);
	
			//Set an auto isBad to false
			var isBad = false;
	
			//Loop through the action's children 
			var actionObj = that.actions[uid];
			for(var i = 0; i < actionObj.children.length; i++){
				var child = actionObj.children[i];
	
				//Check if child uid is in currentActionList
				for(var j = 0; j < currentActionList.length; j++){
					//If the child is equal to one of the entries in the list, run the error message
					//We also start returning the isBad bool up the traversal
					if(child === currentActionList[j]){
						goneBad(currentActionList);
						return true;					
					}
				}
	
				//Otherwise, continue the traversal
				var isBad = traverse(child, currentActionList);
			}
			//If we've gone bad somewhere, we start returning true up the tree
			return isBad;
		}
	
		//Alert an error for the author if a bad list is loaded
		function goneBad(currentActionList){
			//Build the action list string
			var actionString = "[" + currentActionList[0];
			for(var k = 1; k < currentActionList.length; k++){
				actionString += ", " + currentActionList[k];
			}
			actionString += "]";
			//Alert the user
			alert("***Error in Action Tree*** \n"
				+ "There is an infinite loop of actions in one of your action trees. \n"
				+ "The actions with these uids lead back to themselves: \n"
				+ actionString);
		}
	
		//Create a more global isBad variable
		var isBad = false;
	
		//Start a traversal through each first uid in the tree
		for(var i = 0; i < this.firsts.length; i++){
			var first = this.firsts[i];
	
			//Start the traversal, and feed the function an empty list
			//If we've gone bad somewhere, we can let the parent function know
			var isBad = traverse(first, []);
		}
	
		//Return if we've gone bad
		return isBad;
	}



	//These are the members of StoryTree 
	this.SDB = new SDB();
	this.characterDB = new CharacterDB();

	this.loadingSDB = false;
	this.loadingCharacters = false;
	this.loadingTree = false;

	this.badFormatting = false;
	
	// StoryTree.setSDB(String path)
	// Set up the SDB of the StoryTree
	// ARGUMENTS:
	//	path(String) - the file path to the local json file representing the SDB
	// RETURN void
	StoryTree.prototype.setSDB = function(path){
	
		//Check for bad formatting first
		if(this.badFormatting) return;
	
		//Start the XMLHttpRequest for the JSON file
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
	
		    	//Check the formatting of the JSON object to make sure that the typing is correct, simply abort if bad formatting
		    	that.badFormatting = that.SDB.checkSDB(sdbClass.class, sdbClass.types, sdbClass.isBoolean, sdbClass.min, sdbClass.max, sdbClass.defaultVal);
		    	if(that.badFormatting) return;
	
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
	
		//Check for bad formatting first
		if(this.badFormatting) return;
	
		var that = this;
	
		//First check to see if SDB has been loaded
		//We're loading JSON asynchronously, so it is a bit wonky with the timing
		if(this.SDB.isEmpty()){
			var setT = function(){that.setCharacters(path);}; 
			//reload function every 100 milliseconds
			window.setTimeout(setT, 100);
			return;
		}
	
		//Start an XMLHttpRequest to load in a JSON
		var request = new XMLHttpRequest();
		request.open('GET', path, true);
	
		this.loadingCharacters = true;
	
		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    // Success!
		    var data = JSON.parse(request.responseText);
	
		    that.badFormatting = that.characterDB.checkCharacters(data.characters);
		    if(that.badFormatting) return;
	
		    //Push new character objects into the game
		    var chars = data.characters;
		    for(var i = 0; i < chars.length; i++){
		    	that.characterDB.addCharacter(chars[i]);
		    }
		    that.characterDB.addCharacter("World");
		    that.characterDB.addCharacter("Player");
	
		    //Loop through each characteristic
		    var characteristics = data.characteristics;
		    for(var j = 0; j < characteristics.length; j++){
	
		    	//Check the formatting of the characteristic
		    	that.badFormatting = that.characterDB.checkCharacteristic(characteristics[j].name,
		    															  characteristics[j].class,
		    															  characteristics[j].type,
		    															  characteristics[j].value)
	
		    	//Find the correct corresponding character for that characteristic
		    	var character = that.characterDB.getCharacter(characteristics[j].name);
		    	//Check if that sdbClass and type exists
				var sdbClass = that.SDB.SDBClasses[characteristics[j].class	];
				if(sdbClass.types[characteristics[j].type]){
					//Now add the characteristic to the correct character
					character.addCharacteristic(characteristics[j].class, characteristics[j].type, sdbClass.min, sdbClass.max, sdbClass.isBoolean, sdbClass.defaultVal);
	
					//Manually set the value of that characteristic
					character.parseExpression(characteristics[j].class, characteristics[j].type, "=", characteristics[j].value);
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
	
		//Check for bad formatting first
		if(this.badFormatting) return;
	
		var that = this;
	
		this.loadingTree = true;
	
		//First check to see if characters have been loaded
		//We're loading JSON asynchronously, so it is a bit wonky with the timing
		if(this.characterDB.isEmpty()){
			var setT = function(){that.setTrees(path);}; 
			//reload function every 100 milliseconds
			window.setTimeout(setT, 100);
			return;
		}
	
		//Do a check for bad formatting in the path
		if(path.substr(path.length - 1) !== "/"){
			alert("StoryTree.setTrees() error: pathname to folder needs to end with a /");
			return;
		}
	
		//First, get a reference to all characters
		var characters = this.characterDB.getListOfCharacters();
	
	
		//Loop through each character, adding their corresponding speak tree to the path name
		for(var b = 0; b < characters.length; b++){
			var myChar = that.characterDB.getCharacter(characters[b]);
			var newPath = path + myChar.name + ".json";
	
			var request = new XMLHttpRequest();
			request.c = myChar.name;
			request.p = newPath;
			request.open('GET', request.p, true);
	
			request.onload = function() {
			  if (this.status >= 200 && this.status < 400) {
			    // Success!
			    var data = JSON.parse(this.responseText);
	
			    //Code once data has been parsed
	
			    //get proper character
			    var char = that.characterDB.getCharacter(this.c);
	
			    //Create Speak tree and set it to the character
			    var sTree = new STree();
			    char.setStoryTree(sTree);
	
			    //Loop through each action
			    for(var c = 0; c < data.length; c++){
	
			    	var action = data[c];
	
			    	//Check the formatting of the action before anything else
			    	that.badFormatting = Action.prototype.checkAction(action.name, action.uid, action.first, action.class, action.preconditions, action.expressions);
		    		if(that.badFormatting) return;
	
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
	
			    }
	
			    //Now check the sTree for any loops
			    that.badFormatting = sTree.checkActionTree();
		    	if(that.badFormatting) return;
	
			    //Go through each action again to set the classes
			    for(var d = 0; d < data.length; d++){
			    	var action = data[d];
	
			    	//Set the action's class if it exists
			    	if(action.class !== undefined){
			    		sTree.setClasses(action.uid, action.class);
			    	}
			    }
	
			    
	
			  }
			  that.loadingTree = false;
			};
	
			request.onerror = function() {
			  console.log("Unable to parse character Speak Tree from this path: " + newPath);
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
	//RETURN [[int]] uids - an array of the paths of the action uids available to execute
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
	
				//Now check if the class has been added to the list in the past
				//If so, disregard this whole branch in our traversal
				for(var k = 0; k < classes.length; k++){
					if(classes[k] === actionObj.cls) continue;
				}
	
				//We can assume now that we've succesfully passed the preconditions
				//This means we can add the action to the uid list
				uidList.push(actionUID);
	
				//If it's a leaf, we push it onto the return list and decrement the counter for max returns
				//If not a leaf, we keep traversing
				if(actionObj.isLeaf()){
					uids.push(uidList);
					uidList = [];
					if(actionObj.cls !== ""){
						classes.push(actionObj.cls);
					}
					counter--;
				} else {
					traverse(actionUID);
				}
	
				
			}
		}
	
		//loop through each top action, traversing through their corresponding trees
		//keep track of which actions we've added and how many were added
		var uids = [];
		var uidList = [];
		var counter = numOfOptions;
		var classes = [];
		for(var j = 0; j < tree.firsts.length; j++){
	
			
			var actionUID = tree.firsts[j];
			var actionObj = tree.actions[actionUID];
	
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
				uids.push([actionUID]);
				if(actionObj.cls !== ""){
					classes.push(actionObj.cls);
				}
				counter--;
			} else {
				uidList.push(actionUID);
				traverse(actionUID);
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
		return !(this.loadingSDB || this.loadingTree || this.loadingCharacters);
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
		if(this.loadingSDB || this.loadingCharacters || this.loadingTree){
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
		}
	}
	
	//StoryTree.getCharacters()
	//Get the names of all available characters
	//	return([string]) - list of all characters that are available in the StoryTree
	StoryTree.prototype.getCharacters = function(){
	
		//check to see if we're still loading JSON
		var that = this;
		if(this.loadingSDB || this.loadingCharacters || this.loadingTree){
			var l = function(){that.getCharacters();};
			console.log("Wait 500 ms for the JSONs to load....");
			window.setTimeout(l, 500);
			return;
		}
	
		return this.characterDB.getListOfCharacters();
	}
	
	//StoryTree.setCharacteristic()
	//Sets a characteristic for a character
	//ARGUMENTS:
	//	name(string) - name of character
	//	cls(string) - class of characteristic
	//	type(string) - type of characteristic
	//	value(int or bool) - value of characteristic
	//RETURN void
	StoryTree.prototype.setCharacteristic = function(name, cls, type, value){
	
		//check to see if we're still loading JSON
		var that = this;
		if(this.loadingSDB || this.loadingCharacters || this.loadingTree){
			var l = function(){that.setCharacteristic(name, cls, type, value);};
			console.log("Wait 500 ms for the JSONs to load....");
			window.setTimeout(l, 500);
			return;
		}
	
		//First error check all fields
		var isBad = false;
		var errorString = "";
	
		//Check name type
		if(typeof name !== "string"){
			isBad = true;
			errorString += "Your character name is not a string. \n";
		}
	
		//Check if cls is a string
		if(typeof cls !== "string"){
			isBad = true;
			errorString += "Your class name is not a string. \n";
		}
	
		//Check if type is a string
		if(typeof type !== "string"){
			isBad = true;
			errorString += "Your type name is not a string. \n";
		}
	
		//Check if value is an int or bool
		if(typeof value !== "number" && typeof value !== "boolean"){
			isBad = true;
			errorString += "Your value is not an int or boolean. \n"
		}
	
		//Print out the error message if anything has gone bad
		if(isBad){
			alert("setCharacteristic() Error: \n"
				+ " -- name: " + name + "\n"
				+ " -- class: " + cls + "\n"
				+ " -- type: " + type + "\n"
				+ " -- value: " + value + "\n"
				+ "Other error info: \n " + errorString);
			return;
		}
	
		//Find out if the SDBClass is defined
		var sdbcls = this.SDB.SDBClasses[cls];
		if(sdbcls){
			//Now find out if the type exists for that class
			if(sdbcls[type]){
	
				//Last, but not least, check if the character exists
				if(this.characterDB.getCharacter[name]){
					//Great, now we can finally set the characteristic
	
					//Get the character
					var character = this.characterDB.getCharacter(name);
	
					//Now add the characteristic to the correct character
					character.addCharacteristic(cls, type, sdbcls.min, sdbcls.max, sdbcls.isBoolean, sdbcls.defaultVal);
	
					//Manually set the value of that characteristic
					character.parseExpression(cls, type, "=", value);
	
	
				} else {
					alert("setCharacteristic() Error: The character does not exist.");
				}
			} else {
				alert("setCharacteristic() Error: The type for the SDB Class does not exist.");
			}
		} else {
			alert("setCharacteristic() Error: The SDB Class does not exist.");
		}
	}
	
	
	//StoryTree.getCharacteristics()
	//ARGUMENTS:
	//	character(string) - the name of the character whose characteristics we want
	//RETURN [ {cls(string), type(string), value(string)} ] (a list of basic javascript objects with relevant info)
	StoryTree.prototype.getCharacteristics = function(character){
	
		//check to see if we're still loading JSON
		var that = this;
		if(this.loadingSDB || this.loadingCharacters || this.loadingTree){
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
	}
};