//StoryTreeLib.h
#ifndef StoryTreeLib_H
#define StoryTreeLib_H

#include "SDBClass.h"

class SDB;

namespace StoryTree{

	class StoryTree{
	public:
		StoryTree();
		~StoryTree();

	private:
		SDB*						mySDB;
	};

}
#endif