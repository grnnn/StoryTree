#include "stdafx.h"
#include "SDB.h"



SDB::SDB(){
}


SDB::~SDB(){
}

void SDB::addClass(StoryTree::SDBClass cls){
	this->classes[cls.getName()] = cls;
}

StoryTree::SDBClass SDB::getClass(std::string cls){
	return this->classes[cls];
}

bool SDB::isEmpty(){
	return (this->classes.empty());
}

bool SDB::doesContain(std::string cls, std::string type){
	auto clsIt = this->classes.find(cls);

	if (clsIt == this->classes.end()){
		return false;
	}

	StoryTree::SDBClass myClass = clsIt->second;

	std::string* types = myClass.getTypes();

	if (types->size() == 0){
		return false;
	}

	return true;
}