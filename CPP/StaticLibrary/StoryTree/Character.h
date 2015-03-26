//Character.h
#ifndef Character_H
#define Character_H

#include "stdafx.h"

#include <string>

class Character
{
public:
	Character();
	Character(std::string name);
	~Character();

	std::string								getName();

private:
	std::string								name;
};

#endif