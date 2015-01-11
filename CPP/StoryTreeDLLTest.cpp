//
//  StoryTreeDLLTest.cpp
//  SpeakTreeDll
//
//  Created by JIAYU ZENG & TAYLOR OWEN-MILNER on 1/11/15.
//  Copyright (c) 2015 jz. All rights reserved.
//

// SpeakTree.cpp : Defines the entry point for the console application.


#include "stdafx.h"
#include <iostream>

#include "SpeakTreeDLL.h"

using namespace SpeakTreeDLL;


int main(){
    
    SDB dataBase;
    
    std::map< std::string, int> typeTester;
    
    typeTester["happy"] = 4;
    typeTester["angry"] = 10;
    SDBClass myClass(0, 0, 0, true, "name", typeTester);
    
    std::pair<std::map<std::string, int>::iterator, bool>ret;
    
    std::map<std::string, int> ::iterator it = typeTester.begin();
    
    for (it = typeTester.begin(); it != typeTester.end(); ++it)
        std::cout << it->first << " " << it->second;
    
    dataBase.storyDB["sad"] = myClass;
    
    std::map<std::string, SDBClass> ::iterator clsIt = dataBase.storyDB.begin();
    
    // Check SDB
    for (clsIt = (dataBase.storyDB).begin(); clsIt != (dataBase.storyDB).end(); ++clsIt)
        std::cout << clsIt->first << " " << clsIt->second.defaultVal;
    return 0;
    
}

a
