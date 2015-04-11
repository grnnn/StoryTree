//CharacterDB.h
#ifndef CharacterDB_H
#define CharacterDB_H

#include "stdafx.h"

#include "Character.h"

#include <unordered_map>
#include <string>
#include <vector>

class CharacterDB
{
public:
	CharacterDB();
	~CharacterDB();

	void													addCharacter(std::string name);
	Character												getCharacter(std::string name);
	bool													isEmpty();
	std::vector<std::string>								getListOfCharacters();

private:
	std::unordered_map<std::string, Character>				characters;
};

#endif