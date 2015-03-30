// StoryTreeTest.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

#include <iostream>
#include <vector>
#include <string>

#include "StoryTreeLib.h" 

using namespace std;

int _tmain(int argc, _TCHAR* argv[])
{
	std::string name = "test";

	string s1 = "sad";
	string s2 = "happy";
	vector<string> types;
	types.push_back(s1);
	types.push_back(s2);

	ST::SDBClass myClass(name, types, 5, 0, 10);
	
	ST::StoryTree* myStoryTree = new ST::StoryTree();

	system("pause");

	return 0;
}

