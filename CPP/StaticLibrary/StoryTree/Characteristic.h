//Characteristic.h
#ifndef Characteristic_H
#define Characteristic_H

#include "stdafx.h"

#include <string>

namespace ST{

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
		int						getIntValue();
		bool					getBoolValue();
		bool					boolean();
		std::string				getCharacter();
		int						getMin();
		int						getMax();

		std::string				getClass() const;
		std::string				getType() const;
		int						getIntValue() const;
		bool					getBoolValue()const;
		bool					boolean() const;
		std::string				getCharacter() const;
		int						getMin() const;
		int						getMax() const;

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