//CharacterDB.cpp
#include "stdafx.h"
#include "CharacterDB.h"


CharacterDB::CharacterDB()
{
}


CharacterDB::~CharacterDB()
{
}

void CharacterDB::addCharacter(std::string name){
	this->characters[name] = Character(name);
}

Character CharacterDB::getCharacter(std::string name){
	auto myCharIt = this->characters.find(name);
	if (myCharIt != this->characters.end()){
		Character myChar = myCharIt->second;
		return myChar;
	}
	else {
		return NULL;
	}
}

bool CharacterDB::isEmpty(){
	return (this->characters.empty());
}

std::vector<std::string> CharacterDB::getListOfCharacters(){
	std::vector<std::string> charList;
	for (auto& it : this->characters){
		charList.push_back(it.second.getName());
	}
	return charList;
}