//SDBClass.h
#ifndef SDBClass_H
#define SDBClass_H

#include "stdafx.h"

#include <string>
#include <vector>
#include <unordered_map>

namespace ST{
	class SDBClass{
	public:
		SDBClass();

		SDBClass(std::string name, std::vector<std::string> types, int defaultVal, int min, int max);
		SDBClass(std::string name, std::vector<std::string> types, bool defaultVal);

		SDBClass(std::string name, std::string types[], int defaultVal, int min, int max);
		SDBClass(std::string name, std::string types[], bool defaultVal);

		~SDBClass();

		void									addTypes(std::vector<std::string> types);
		void									addTypes(std::string types[]);
		void									addTypes(std::string type);

		std::string								getName();
		std::string*						    getTypes();

	private:
		std::string								name;
		std::unordered_map<std::string, bool> 	types;
		bool									isBoolean;
		
		bool									defaultBoolVal;

		int										defaultIntVal;
		int										min;
		int										max;
	};
}

#endif