//Precondition.h
#pragma once

#include <string>

namespace ST{
	class Precondition
	{
	public:
		Precondition(std::string character, std::string cls, std::string type, std::string operation, int value);
		Precondition(std::string character, std::string cls, std::string type, bool value);
		Precondition();
		~Precondition();

		bool								evaluate(int value);
		bool								evaluate(bool value);

	private:
		std::string							character;
		std::string							cls;
		std::string							type;
		std::string							operation;
		
		int									intValue;
		bool								boolValue;

		bool								isBoolean;
	};

}