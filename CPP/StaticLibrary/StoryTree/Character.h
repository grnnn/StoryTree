//Character.h
#ifndef Character_H
#define Character_H

#include "stdafx.h"

#include "Characteristic.h"
#include "MemoryBank.h"

#include <string>
#include <unordered_map>

class Character
{
public:
	Character();
	Character(std::string name);
	~Character();

	std::string																getName();

	void																	addCharacteristic(StoryTree::Characteristic characteristic);
	void																	parseExpression(std::string cls, std::string type, std::string operation, int value);
	void																	parseExpression(std::string cls, std::string type, std::string operation, bool value);

private:
	std::string																						name;

	std::unordered_map<std::string, std::unordered_map<std::string, StoryTree::Characteristic>>		characteristics;

	MemoryBank																						memoryBank;
};

#endif