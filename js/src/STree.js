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

	//Check if the preconditions are in an array, they can be undefined
	var preconditionErrors = "";
	if(Object.prototype.toString.call( preconditions ) !== '[object Array]'){
		if(preconditions !== undefined){
			isBad = true;
			errorString += "The preconditions of your action are not in an array. \n";
		}
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
		console.log("Warning: the uid " + uid + " has already been added");
	}
	this.actions[uid] = new Action(name, uid);
}

STree.prototype.isEmpty = function(){
	var counter = 0;
	for (var key in this.actions){
		return false;
	}
	return true;
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
					//goneBad(currentActionList);
					moreDetail(uid, child, currentActionList);
					return true;
				}
			}

			//Otherwise, continue the traversal
			var isBad = traverse(child, currentActionList.slice());
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

	function moreDetail(uid, child, currentActionList){
		var actionString = "[" + currentActionList[0];
		for(var k = 1; k < currentActionList.length; k++){
			actionString += ", " + currentActionList[k];
		}
		actionString += "]";
		alert("The uid " + uid + " leads to the child uid of " + child + " which is already in the action Stack " + actionString);
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