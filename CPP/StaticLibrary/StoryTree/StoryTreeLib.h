//StoryTreeLib.h
#ifndef StoryTreeLib_H
#define StoryTreeLib_H

#include "SDBClass.h"
#include "Characteristic.h"
#include "Expression.h"

class SDB;
class CharacterDB;

namespace ST{

	class StoryTree{
	public:
		StoryTree();
		~StoryTree();

	private:
		SDB*						mySDB;
		CharacterDB*				characterDB;
	};

}
#endif