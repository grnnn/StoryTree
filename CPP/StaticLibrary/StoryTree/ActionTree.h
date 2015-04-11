//ActionTree.h
#pragma once

#include "Action.h"

#include <vector>
#include <string>
#include <unordered_map>

class ActionTree
{
public:
	ActionTree();
	~ActionTree();

	void											addFirst(int uid, const ST::Action& action);
	void											addAction(int uid, const ST::Action& action);

private:

	std::vector<int>								firsts;
	std::unordered_map<int, ST::Action>				actions;
};

