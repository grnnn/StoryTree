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
//	expressions([{}]) - List of Expression objects to be evaluated
//RETURN bool - is the action bad
Action.prototype.checkAction = function(name, uid, first, cls, preconditions, expressions){

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

}