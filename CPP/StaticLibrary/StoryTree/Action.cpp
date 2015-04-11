//Action.cpp
#include "stdafx.h"
#include "Action.h"

namespace ST{

	Action::Action()
	{
	}

	Action::Action(std::string name, int uid){
		this->name = name;
		this->uid = uid;
	}
	
	Action::Action(std::string name, int uid, bool first){
		this->name = name;
		this->uid = uid;
		this->first = first;
	}

	Action::Action(std::string name, int uid, std::string cls){
		this->name = name;
		this->uid = uid;
		this->cls = cls;
	}

	Action::Action(std::string name, int uid, bool first, std::string cls){
		this->name = name;
		this->uid = uid;
		this->first = first;
		this->cls = cls;
	}


	Action::~Action()
	{
	}

	void Action::addPrecondition(const Precondition& pre){
		this->preconditions.push_back(pre);
	}

	void Action::addExpression(const Expression& exp){
		this->expressions.push_back(exp);
	}

	void Action::addChild(int uid){
		this->children.push_back(uid);
	}

	bool Action::isFirst(){
		return this->first;
	}

	bool Action::isFirst() const{
		return this->first;
	}

	bool Action::isLeaf(){
		return (this->children.size() == 0);
	}

	bool Action::isLeaf() const{
		return (this->children.size() == 0);
	}
	
}