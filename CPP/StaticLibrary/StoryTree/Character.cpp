//Character.cpp
#include "stdafx.h"
#include "Character.h"


Character::Character()
{
}

Character::Character(std::string name){
	this->name = name;
}


Character::~Character()
{
}

std::string Character::getName(){
	return this->name;
}

void Character::addCharacteristic(const ST::Characteristic& characteristic){
	this->characteristics[characteristic.getClass()][characteristic.getType()] = characteristic;
}

void Character::parseExpression(std::string cls, std::string type, std::string operation, int value){
	auto clsIt = this->characteristics.find(cls);
	if (clsIt != this->characteristics.end()){
		auto typeIt = clsIt->second.find(type);
		if (typeIt != clsIt->second.end()){
			typeIt->second.parseExpression(operation, value);
		}
	}
}

void Character::parseExpression(std::string cls, std::string type, std::string operation, bool value){
	auto clsIt = this->characteristics.find(cls);
	if (clsIt != this->characteristics.end()){
		auto typeIt = clsIt->second.find(type);
		if (typeIt != clsIt->second.end()){
			typeIt->second.parseExpression(operation, value);
		}
	}
}

void Character::addAction(int uid, const ST::Action& action){
	if (action.isFirst()){
		this->actionTree.addFirst(uid, action);
	}
	else {
		this->actionTree.addAction(uid, action);
	}
}