//SDBClass.cpp

#include "stdafx.h"

#include "SDBClass.h"

#include <string>
#include <vector>
#include <unordered_map>
#include <iostream>

namespace StoryTree{

	SDBClass::SDBClass(){

	}

	SDBClass::SDBClass(std::string name, std::vector<std::string> types, int defaultVal, int min, int max){
		//Implicit set as not a boolean
		isBoolean = false;

		//Set name and default value
		this->name = name;
		this->defaultIntVal = defaultVal;

		//Error checking min, max, and default values
		if (min > max){
			std::cout << "SDBClass constructor error: Your min value of " << min
					  << " is greater than your max value of " << max << std::endl;
			exit(-1);
		}
		if (defaultVal < min || defaultVal > max){
			std::cout << "SDBClass constructor error: Your default value of " << defaultVal
					  << " is outside of your min to max range of " << min << " to " << max << std::endl;
			exit(-1);
		}

		//Set min and max
		this->min = min;
		this->max = max;

		//Set each value of the map
		for (auto it = types.begin(); it != types.end(); ++it){
			this->types[*it] = true;
		}
	}

	SDBClass::SDBClass(std::string name, std::vector<std::string> types, bool defaultVal){
		//Implicit set type
		isBoolean = true;

		//Set name and defaultVal
		this->name = name;
		this->defaultBoolVal = defaultVal;

		//Set each value of the map
		for (auto it = types.begin(); it != types.end(); ++it){
			this->types[*it] = true;
		}
	}

	SDBClass::SDBClass(std::string name, std::string types[], int defaultVal, int min, int max){
		//Implicit set as not a boolean
		isBoolean = false;

		//Set name and default value
		this->name = name;
		this->defaultIntVal = defaultVal;

		//Error checking min, max, and default values
		if (min > max){
			std::cout << "SDBClass constructor error: Your min value of " << min
				<< " is greater than your max value of " << max << std::endl;
			exit(-1);
		}
		if (defaultVal < min || defaultVal > max){
			std::cout << "SDBClass constructor error: Your default value of " << defaultVal
				<< " is outside of your min to max range of " << min << " to " << max << std::endl;
			exit(-1);
		}

		//Set min and max
		this->min = min;
		this->max = max;

		//Set each value of the map
		for (unsigned int i = 0; i < types->size(); ++i){
			std::string type = types[i];

			this->types[type] = true;
		}
	}

	SDBClass::SDBClass(std::string name, std::string types[], bool defaultVal){
		//Implicit set type
		isBoolean = true;

		//Set name and defaultVal
		this->name = name;
		this->defaultBoolVal = defaultVal;

		//Set each value of the map
		for (unsigned int i = 0; i < types->size(); ++i){
			std::string type = types[i];

			this->types[type] = true;
		}
	}

	SDBClass::~SDBClass(){

	}

	void SDBClass::addTypes(std::vector<std::string> types){
		for (auto it = types.begin(); it != types.end(); ++it){
			this->types[*it] = true;
		}
	}

	void SDBClass::addTypes(std::string types[]){
		for (unsigned int i = 0; i < types->size(); i++){
			this->types[types[i]] = true;
		}
	}

	void SDBClass::addTypes(std::string type){
		this->types[type] = true;
	}

	std::string SDBClass::getName(){
		return this->name;
	}

	std::string* SDBClass::getTypes(){
		std::string* tehTypes = new std::string[this->types.size()];
		int count = 0;
		for (auto it = this->types.begin(); it != this->types.end(); ++it){
			tehTypes[count] = (it)->first;
		}
		return tehTypes;
	}

}