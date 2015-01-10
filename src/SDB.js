/*
* SDBClass, represents a category of social space that can be used 
*	name(String): the name of the category Class
*	types({String}): Hash Table of the subcategory names
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
*	SDBClasses(hash table): used to contain a set of SDBClasses, made a hash table for easy lookup
*/
var SDB = function(){
	this.SDBClasses = {};
}

//SDB.addClass(SDBClass cls)
//	ARGUMENTS:
//		cls(SDBCLass) - the class being added to SDB 
//	RETURN: void
SDB.prototype.addClass = function(cls){
	//SDBClass is added in a hash table for easy type lookup
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

Characteristic.prototype.addVal = function(delta){
	if(this.value + delta > this.max) {
		this.value = this.max;
	} else {
		this.value += delta;
	}
}

Characteristic.prototype.subVal = function(delta){
	if(this.value - delta < this.min) {
		this.value = this.min;
	} else {
		this.value -= delta;
	}
}

Characteristic.prototype.setVal = function(val){
	this.value = val;
}