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
*	class(String) - used to group actions together
*/
var Action = function(name, uid){
	this.name = name;
	this.uid = uid;

	this.preconditions = [];
	this.expressions = [];

	this.children = [];
	this.parent = 0;

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
Action.prototype.setParent = function(uid){
	this.parent = uid;
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

//Sets the class of an action, given a class and a uid
STree.prototype.setClass = function(uid, cls){

	var that = this;

	function setChildClass(uid){

		var actionObj = that.actions[uid];

		for(var i = 0; i < actionObj.children.length; i++){
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