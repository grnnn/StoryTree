//Memory.h
#ifndef Memory_H
#define Memory_H

#include "stdafx.h"

#include "Characteristic.h"
#include "Expression.h"

#include <map>
#include <string>
#include <vector>

class Memory;

class Memory
{
public:
	Memory();
	~Memory();

	Memory											copy();
	void											encodeVecValue(StoryTree::Expression expression, StoryTree::Characteristic characteristic);
	void											encodeActions(std::vector<int> actions);
	Memory											Normalize();
	float											dot();

private:
	std::map<std::string, float>					memVec;
	std::string										actionPath;
};

#endif