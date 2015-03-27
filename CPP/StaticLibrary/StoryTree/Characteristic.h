//Characteristic.h
#ifndef Characteristic_H
#define Characteristic_H

#include "stdafx.h"

#include <string>

namespace StoryTree{

	class Characteristic
	{
	public:
		Characteristic();
		Characteristic(std::string character, std::string cls, std::string type, int value);
		Characteristic(std::string character, std::string cls, std::string type, bool value);

		~Characteristic();

		void					parseExpression(std::string operation, int value);
		void					parseExpression(std::string operation, bool value);

		std::string				getClass();
		std::string				getType();

		std::string				getCharacter();

	private:
		std::string				character;

		std::string				cls;
		std::string				type;
		
		int						intValue;
		bool					boolValue;

		bool					isBoolean;

		int						min;
		int						max;

		//private functions for use in ParseExpression
		void					addValue(int value);
		void					subValue(int value);
		void					setValue(int value);

	};

}

#endif