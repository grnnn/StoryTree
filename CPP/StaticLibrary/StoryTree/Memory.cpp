//Memory.cpp
#include "stdafx.h"
#include "Memory.h"


Memory::Memory()
{
}


Memory::~Memory()
{
}

Memory Memory::copy(){

}

void Memory::encodeVecValue(ST::Expression expression, ST::Characteristic characteristic){
	std::string key = expression.getVecKey();

	float val = 0;
	if (this->memVec.find(key) != this->memVec.end()){
		val = this->memVec.find(key)->second;
	}

	if (characteristic.boolean()){
		if (expression.getBoolValue() == characteristic.getBoolValue()){
			return;
		}
		else {
			val += 1;
		}
	}
	else{
		int oldval = characteristic.getIntValue();
		int changeval = expression.getIntValue();
		int actualChange = 0;
		//TODO implement if-else for operations to calculate actualChange

		//TODO attribute actualChange to to value
	}

	//TODO Actually encode the vector value in the map
}

void Memory::encodeActions(std::vector<int> actions){
	std::string actPath = "[";
	for (auto& it : actions){
		actPath += std::to_string(it);
		actPath += ":";
	}
	actPath.pop_back();
	actPath += "]";

	this->actionPath = actPath;
}

void Memory::encodeActions(std::string actions){
	this->actionPath = actions;
}


Memory Memory::Normalize(){

}

float Memory::dot(){

}