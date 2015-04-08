//Memory.h
#ifndef Memory_H
#define Memory_H

#include "stdafx.h"

#include "Characteristic.h"
#include "Expression.h"

#include <map>
#include <string>
#include <vector>
#include <math.h>

class Memory;

class Memory
{
public:
	Memory();
	Memory(const Memory& mem);
	~Memory();

	void											encodeVecValue(const ST::Expression& expression, const ST::Characteristic& characteristic);
	void											encodeVecValue(std::string key, float value);
	void											encodeActions(std::vector<int> actions);
	void											encodeActions(std::string actions);
	Memory											Normalize();
	float											dot(const Memory& mem);

	std::map<std::string, float>					getMemVec();
	std::string										getActionPath();
	float											getLength();
	std::map<std::string, float>					getMemVec() const;
	std::string										getActionPath() const;
	float											getLength() const;

private:
	std::map<std::string, float>					memVec;
	std::string										actionPath;

	float											dimensionalLength;
};

#endif