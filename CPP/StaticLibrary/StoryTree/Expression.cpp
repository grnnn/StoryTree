#include "stdafx.h"
#include "Expression.h"

#include <iostream>

namespace ST{

	Expression::Expression()
	{
	}

	Expression::Expression(std::string character, std::string cls, std::string type, std::string operation, int value){
		//Implicit isBoolean
		this->isBoolean = false;

		this->charater = character;
		this->cls = cls;
		this->type = type;

		if (operation != "+" && operation != "-" && operation != "="){
			std::cout << "Expression constructor error: Your operation value of '" << operation << "' needs to be "
					  << "either '+', '-', or '='." << std::endl;
			exit(-1);
		}
		this->operation = operation;

		this->intValue = value;
	}

	Expression::Expression(std::string character, std::string cls, std::string type, bool value){
		//Implicit isBoolean
		this->isBoolean = true;
		this->operation = "=";

		this->charater = character;
		this->cls = cls;
		this->type = type;

		this->boolValue = value;
	}

	Expression::~Expression()
	{
	}

	bool Expression::boolean(){
		return (this->isBoolean);
	}

	std::string Expression::getVecKey(){
		std::string key = this->charater + ":" + this->cls + ":" + this->type;
		return key;
	}

	bool Expression::getBoolValue(){
		return (this->boolValue);
	}

	int Expression::getIntValue(){
		return (this->intValue);
	}

	bool Expression::boolean() const{
		return (this->isBoolean);
	}

	std::string Expression::getVecKey() const{
		std::string key = this->charater + ":" + this->cls + ":" + this->type;
		return key;
	}

	bool Expression::getBoolValue() const{
		return (this->boolValue);
	}

	int Expression::getIntValue() const{
		return (this->intValue);
	}

	std::string Expression::getOperation(){
		return (this->operation);
	}

	std::string Expression::getOperation() const{
		return (this->operation);
	}
}