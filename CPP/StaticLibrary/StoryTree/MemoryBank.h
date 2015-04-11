//MemoryBank.h
#ifndef MemoryBank_H
#define MemoryBank_H

#include "stdafx.h"

#include "Memory.h"

#include <vector>

class MemoryBank
{
public:
	MemoryBank();
	~MemoryBank();

	void						addMemory(const Memory& memory);

private:
	int							timeStep = 0;
	std::vector<Memory>			memories;
	Memory						totalMemVec;

	//private function
	void						refreshVec();
};

#endif