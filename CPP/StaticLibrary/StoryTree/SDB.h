//SDB.h
#ifndef SDB_H
#define SDB_H

#include "stdafx.h"

#include <unordered_map>
#include <string>

#include "SDBClass.h"

class SDB {
public:
	SDB();
	~SDB();

	void															addClass(const ST::SDBClass& cls);
	ST::SDBClass													getClass(std::string name);
	bool															isEmpty();
	bool															doesContain(std::string cls, std::string type);

private:
	std::unordered_map<std::string, ST::SDBClass>					classes;
};

#endif