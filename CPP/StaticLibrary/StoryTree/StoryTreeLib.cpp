// StoryTreeLib.cpp
// compile with: cl /c /EHsc StoryTreeLib.cpp 
// post-build command: lib StoryTreeLib.obj

#include "stdafx.h"

#include "StoryTreeLib.h"
#include "SDB.h"
#include "CharacterDB.h"

#include <stdexcept>

namespace StoryTree
{
	StoryTree::StoryTree(){
		mySDB = new SDB();
		characterDB = new CharacterDB();
	}
}