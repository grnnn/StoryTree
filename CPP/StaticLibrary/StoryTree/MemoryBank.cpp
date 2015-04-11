//MemoryBank.cpp
#include "stdafx.h"
#include "MemoryBank.h"


MemoryBank::MemoryBank()
{
}


MemoryBank::~MemoryBank()
{
}

void MemoryBank::addMemory(const Memory& memory){
	this->memories.push_back(memory);
	this->timeStep++;
	this->refreshVec();
}

void MemoryBank::refreshVec(){
	Memory memory = this->memories.back();

	for (auto& it: memory.getMemVec()){
		float newVal = 0;
		auto totalIt = this->totalMemVec.getMemVec().find(it.first);
		if (totalIt != this->totalMemVec.getMemVec().end()){
			newVal = totalIt->second;
		}

		float weight = 0.1 * (this->timeStep - 1);

		newVal += it.second + weight;

		this->totalMemVec.encodeVecValue(it.first, newVal);
	}
}