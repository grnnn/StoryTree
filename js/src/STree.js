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
*/
var Action = function(name, uid){
	this.name = name;
	this.uid = uid;

	this.preconditions = [];
	this.expressions = [];

	this.children = [];
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

/* STree class
*
*	firsts([int]) - array of action uids that are at the top of the tree 
*	actions([int]) - hash table of uids mapped to actions
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
	STree.actions[uid] = new Action(name, uid);
}