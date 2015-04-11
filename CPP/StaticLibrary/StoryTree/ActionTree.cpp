//ActionTree.cpp

#include "stdafx.h"
#include "ActionTree.h"

#include <iostream>

ActionTree::ActionTree()
{
}


ActionTree::~ActionTree()
{
}

void ActionTree::addAction(int uid, const ST::Action& action){
	if (this->actions.find(uid) != this->actions.end()){
		std::cout << "Warning: An action with the uid '" << uid << "' has already been added to this character. Overriding the last action added." << std::endl;
	}
	this->actions[uid] = action;
}

void ActionTree::addFirst(int uid, const ST::Action& action){
	this->firsts.push_back(uid);
	this->addAction(uid, action);
}