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

