//Memory.cpp
#include "stdafx.h"
#include "Memory.h"


Memory::Memory()
{
}

Memory::Memory(const Memory& mem)
{
	this->encodeActions(mem.getActionPath());

	for (auto& keyIt : mem.getMemVec() ){
		this->encodeVecValue(keyIt.first, keyIt.second);
	}
}

Memory::~Memory()
{
}



void Memory::encodeVecValue(const ST::Expression& expression, const ST::Characteristic& characteristic){
	std::string key = expression.getVecKey();

	float val = 0;
	if (this->memVec.find(key) != this->memVec.end()){
		val = this->memVec.find(key)->second;
	}

	//The spaghetti is real
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
		if (expression.getOperation() == "+"){
			if (oldval + changeval > characteristic.getMax()){
				actualChange = characteristic.getMax() - oldval;
			}
			else {
				actualChange = changeval;
			}
		}
		else if (expression.getOperation() == "-"){
			if (oldval - changeval < characteristic.getMin()){
				actualChange = oldval - characteristic.getMin();
			}
			else {
				actualChange = changeval;
			}
		}
		else if (expression.getOperation() == "="){
			actualChange = std::abs(oldval - changeval);
		}

		float percentChange = actualChange / (characteristic.getMax() - characteristic.getMin());

		val += percentChange;
	}

	this->memVec[key] = val;

	this->dimensionalLength += val * val;
}

void Memory::encodeVecValue(std::string key, float value){
	this->memVec[key] = value;
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
	Memory* newMem = new Memory();
	(*newMem).encodeActions(this->actionPath);

	float length = this->getLength();

	for (auto& it : this->memVec){
		float normVal = it.second / length;
		(*newMem).encodeVecValue(it.first, normVal);
	}

	return (*newMem);
}

float Memory::dot(const Memory& mem){
	const Memory* shorter;
	const Memory* longer;

	if (this->memVec.size() > mem.getMemVec().size()){
		shorter = this;
		longer = &mem;
	}
	else {
		shorter = &mem;
		longer = this;
	}

	//TODO implement the actual dot product-ing
}

std::map<std::string, float> Memory::getMemVec(){
	return (this->memVec);
}

std::string Memory::getActionPath(){
	return (this->actionPath);
}

float Memory::getLength(){
	return std::sqrt(this->dimensionalLength);
}

std::map<std::string, float> Memory::getMemVec() const{
	return (this->memVec);
}

std::string Memory::getActionPath() const{
	return (this->actionPath);
}

float Memory::getLength() const{
	return std::sqrt(this->dimensionalLength);
}