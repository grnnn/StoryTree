//MemoryBank.cpp
#include "stdafx.h"
#include "MemoryBank.h"


MemoryBank::MemoryBank()
{
}


MemoryBank::~MemoryBank()
{
}

void MemoryBank::addMemory(Memory memory){
	this->memories.push_back(memory);
	this->timeStep++;
	this->refreshVec();
}

void MemoryBank::refreshVec(){
	//TODO once Memory is implemented
}