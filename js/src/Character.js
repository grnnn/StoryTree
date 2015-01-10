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



/*
*
*
*/