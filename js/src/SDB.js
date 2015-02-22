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