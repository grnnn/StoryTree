//Characteristic.cpp
#include "stdafx.h"
#include "Characteristic.h"

#include <iostream>

namespace ST{

	Characteristic::Characteristic()
	{
	}


	Characteristic::~Characteristic()
	{
	}

	Characteristic::Characteristic(std::string character, std::string cls, std::string type, int value){
		this->isBoolean = false;

		this->character = character;
		this->cls = cls;
		this->type = type;
		this->intValue = value;
	}

	Characteristic::Characteristic(std::string character, std::string cls, std::string type, bool value){
		this->isBoolean = true;

		this->character = character;
		this->cls = cls;
		this->type = type;
		this->boolValue = value;
	}

	void Characteristic::parseExpression(std::string operation, int value){
		if (operation == "+"){
			this->addValue(value);
		}
		else if (operation == "-"){
			this->subValue(value);
		}
		else if (operation == "="){
			this->setValue(value);
		}
		else{
			std::cout << "Characteristic::parseExpression error: the operation '" << operation
					  << "' has to be '+', '-', or '='." << std::endl;
			exit(-1);
		}
	}

	void Characteristic::parseExpression(std::string operation, bool value){
		if (operation == "="){
			this->boolValue = value;
		}
		else {
			std::cout << "Characteristic::parseExpression error: the operation '" << operation
				<< "' has to be '=' because a boolean is being parsed." << std::endl;
			exit(-1);
		}
	}


	//Getter functions, with const overloads
	std::string Characteristic::getClass(){
		return (this->cls);
	}

	std::string Characteristic::getType(){
		return (this->type);
	}

	std::string Characteristic::getCharacter(){
		return (this->character);
	}

	bool Characteristic::boolean(){
		return (this->isBoolean);
	}

	int Characteristic::getIntValue(){
		return (this->intValue);
	}

	bool Characteristic::getBoolValue() const{
		return (this->boolValue);
	}

	std::string Characteristic::getClass() const{
		return (this->cls);
	}

	std::string Characteristic::getType() const{
		return (this->type);
	}

	std::string Characteristic::getCharacter() const{
		return (this->character);
	}

	bool Characteristic::boolean() const{
		return (this->isBoolean);
	}

	int Characteristic::getIntValue() const{
		return (this->intValue);
	}

	bool Characteristic::getBoolValue() const{
		return (this->boolValue);
	}

	int Characteristic::getMin(){
		if (this->isBoolean){
			std::cout << "Characteristic.getMin() error: the characteristic you're trying to access of type boolean, which doesn't have a min." << std::endl;
			exit(-1);
		}
		else {
			return (this->min);
		}
	}

	int Characteristic::getMax(){
		if (this->isBoolean){
			std::cout << "Characteristic.getMin() error: the characteristic you're trying to access of type boolean, which doesn't have a max." << std::endl;
			exit(-1);
		}
		else {
			return (this->max);
		}
	}

	int Characteristic::getMin() const{
		if (this->isBoolean){
			std::cout << "Characteristic.getMin() error: the characteristic you're trying to access of type boolean, which doesn't have a min." << std::endl;
			exit(-1);
		}
		else {
			return (this->min);
		}
	}

	int Characteristic::getMax() const{
		if (this->isBoolean){
			std::cout << "Characteristic.getMin() error: the characteristic you're trying to access of type boolean, which doesn't have a max." << std::endl;
			exit(-1);
		}
		else {
			return (this->max);
		}
	}


	//private functions
	void Characteristic::addValue(int value){
		if (this->max == NULL){
			std::cout << "Characteristic::parseExpression() warning: There is no assigned max value for your characteristic. " << std::endl;
			return;
		}
		if (this->intValue + value > this->max){
			this->intValue = this->max;
		}
		else{
			this->intValue += value;
		}
	}

	void Characteristic::subValue(int value){
		if (this->min == NULL){
			std::cout << "Characteristic::parseExpression() warning: There is no assigned min value for your characteristic. " << std::endl;
			return;
		}
		if (this->intValue + value > this->min){
			this->intValue = this->min;
		}
		else{
			this->intValue -= value;
		}
	}

	void Characteristic::setValue(int value){
		this->intValue = value;
	}

}
