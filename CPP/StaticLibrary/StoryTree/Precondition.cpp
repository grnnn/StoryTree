//Precondition.cpp
#include "stdafx.h"
#include "Precondition.h"

#include <iostream>

namespace ST{

	Precondition::Precondition(std::string character, std::string cls, std::string type, std::string operation, int value){
		this->character = character;
		this->cls = cls;
		this->type = type;
		this->operation = operation;

		if (operation != ">" && operation != "<" && operation != "=="){
			std::cout << "Precondition() Error: Your operation of '" << operation << "' has to be '>', '<', or '=='." << std::endl;
			exit(-1);
		}

		this->isBoolean = false;

		this->intValue = value;
	}
	
	Precondition::Precondition(std::string character, std::string cls, std::string type, bool value){
		this->character = character;
		this->cls = cls;
		this->type = type;
		this->operation = "==";

		this->isBoolean = true;

		this->boolValue = value;
	}

	Precondition::Precondition()
	{
	}


	Precondition::~Precondition()
	{
	}

	bool Precondition::evaluate(int value){
		if (this->operation == "<"){
			return (this->intValue < value);
		}
		else if (this->operation == ">"){
			return (this->intValue > value);
		}
		else if (this->operation == "=="){
			return (this->intValue == value);
		}
		else{
			return false;
		}
	}

	bool Precondition::evaluate(bool value){
		return (this->boolValue == value);
	}
}