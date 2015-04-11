//Action.h
#pragma once

#include "Precondition.h"
#include "Expression.h"

#include <string>
#include <vector>

namespace ST{
	class Action
	{
	public:
		Action(std::string name, int uid);
		Action(std::string name, int uid, bool first);
		Action(std::string name, int uid, std::string cls);
		Action(std::string name, int uid, bool first, std::string cls);
		Action();
		~Action();

		void								addPrecondition(const Precondition& pre);
		void								addExpression(const Expression& exp);
		void								addChild(int uid);

		bool								isFirst();
		bool								isFirst() const;
		bool								isLeaf();
		bool								isLeaf() const;

	private:
		std::string							name;
		int									uid;
		bool								first = false;
		std::string							cls = "";

		std::vector<Precondition>		preconditions;
		std::vector<Expression>			expressions;

		std::vector<int>					children;
	};

}