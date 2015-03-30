//Expression.h
#ifndef Expression_H
#define Expression_H

#include "stdafx.h"

#include <string>

namespace ST{

	class Expression
	{
	public:
		Expression();
		Expression(std::string character, std::string cls, std::string type, std::string operation, int value);
		Expression(std::string character, std::string cls, std::string type, bool value);
		~Expression();

		bool						boolean();

		int							getIntValue();
		bool						getBoolValue();

		std::string					getVecKey();

	private:
		std::string					charater;
		std::string					cls;
		std::string					type;
		std::string					operation;

		int							intValue;
		bool						boolValue;

		bool						isBoolean;
	};

}

#endif