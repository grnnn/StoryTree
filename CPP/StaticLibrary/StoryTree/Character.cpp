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
