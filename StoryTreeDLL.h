//
//  StoryTreeDLL.h
//  SpeakTreeDll
//
//  Created by JIAYU ZENG and TAYLOR OWEN-MILNER on 1/11/15.
//  Copyright (c) 2015 jz. All rights reserved.
//
#ifdef STORYTREEDLL_EXPORTS
#define STORYTREEDLL_API __declspec(dllexport)
#else
#define STORYTREEDLL_API __declspec(dllimport)
#endif

#include <map>
#include <string>]
#include <vector>


namespace StoryTreeDLL
{
    class SDBClass{
    public:
        std::string name;
        int min, max, defaultVal;
        bool isBoolean;
        std::map <std::string, int> types;
        
        STORYTREEDLL_API SDBClass(){};
        STORYTREEDLL_API SDBClass(int min, int max, int defaultVal, bool isBoolean, std::string name, std::map<std::string, int>types){
            this->name = name;
            this->types = types;
            this->defaultVal = defaultVal;
            this->isBoolean = isBoolean;
            if (isBoolean){
                this->min = min;
                this->max = max;
            }
            
        };
        
        STORYTREEDLL_API ~SDBClass() { types.clear(); }
    };
    
    class SDB{
        
    public:
        std::map <std::string, SDBClass> storyDB;
        
        STORYTREEDLL_API SDB(){ SDBClass empty;  storyDB["empty"] = empty; }
        STORYTREEDLL_API ~SDB() { storyDB.clear(); }
    };
    
    /**********************************************************/
    
    class Characteristics{
    public:
        std::string className, type;
        int min, max, value;
        bool isBoolean;
        
        STORYTREEDLL_API Characteristics(){ value = -1; }
        
        STORYTREEDLL_API Characteristics(int min, int max, int defaultVal, bool isBoolean, std::string name, std::string type){
            this->className = name;
            this->type = type;
            this->value = defaultVal;
            this->isBoolean = isBoolean;
            if (isBoolean){
                this->min = min;
                this->max = max;
            }
        };
        
        STORYTREEDLL_API ~Characteristics() {  }
        
        
        
        STORYTREEDLL_API void addVal(int delta){
            if (this->value + delta < this->max){
                this->value += delta;
            }
            else
                this->value = this->max;
        }
        STORYTREEDLL_API void subVal(int delta){
            if (this->value - delta > this->min){
                this->value -= delta;
            }
            else
                this->value = this->min;
        }
        STORYTREEDLL_API void setVal(int value){
            if (value > this->min && value < this->max)
                this->value = value;
        }
        
        STORYTREEDLL_API void parseExpression(char oper, int value){
            switch (oper){
                case '=': this->setVal(value);
                    break;
                case '+': this->addVal(value);
                    break;
                case'-': this->subVal(value);
                    break;
                default:	printf(" Invalid operation. Value remains \n");
                    
            }
        }
    }; // end characteristic
    
    class Precondition{
        
        std::string characterName;
        std::string cls;
        std::string type;
        char operation;
        int value;
        
        STORYTREEDLL_API Precondition(std::string name, std::string cls, std::string type, char oper, int value){
            this->characterName = name;
            this->cls = cls;
            this->type = type;
            this->operation = oper;
            this->value = value;
        }
        
    }; //end Precondition
    
    class Expression{
        
        std::string characterName;
        std::string cls;
        std::string type;
        char operation;
        int value;
        
        STORYTREEDLL_API Expression(std::string name, std::string cls, std::string type, char oper, int value){
            this->characterName = name;
            this->cls = cls;
            this->type = type;
            this->operation = oper;
            this->value = value;
        }
        
    }; //end Expression
    
    class Action{
        
        std::string name;
        int uid;
        
        std::vector<Precondition> preconditions;
        std::vector<Expression> expressions;
        
        std::vector<Action> children;
        int parent = 0;
        
        std::string cls = "";
        
        STORYTREEDLL_API Action(std::string name, int uid){
            this->name = name;
            this->uid = uid;
        }
        
        STORYTREEDLL_API void addPrecondition(std::string name, std::string cls, std::string type, char operation, int value){
            Precondition newPre(name, cls, type, operation, value);
            this->preconditions.push_back(newPre);
        }
        
    }; //end Action
    
    class Character{
        
        std::string name;
        std::map<std::string, std::map<std::string, Characteristics>> characteristics;
        //STree locked
        
        SPEAKTREEDLL_API Character() {} // defalut
        SPEAKTREEDLL_API Character(std::string name){
            this->name = name;
        }
        
        STORYTREEDLL_API void addCharacteristic(int min, int max, int defaultVal, bool isBoolean, std::string name, std::string type){
            Characteristics newChar(min, max, defaultVal, isBoolean, name, type);
            
            //if (characteristic[name].count == 0) 
            characteristics[name][type] = newChar;
        }
        
        STORYTREEDLL_API void setCharacteristic(Characteristics newChar){ // can be a copy constructor
            std::string name = newChar.className;
            std::string type = newChar.type;
            this->characteristics[name][type] = newChar;
        }
        
        STORYTREEDLL_API void parseExpression(std::string name, std::string type, char oper, int value){
            std::map<std::string, std::map<std::string, Characteristics>>::iterator it = characteristics.find(name);
            if (it != characteristics.end())
            {
                std::map<std::string, Characteristics> map2 = it->second;
                
                std::map<std::string, Characteristics>::iterator it2 = map2.find(type);
                
                if (it2 != map2.end()){
                    
                    characteristics[name][type].parseExpression(oper, value);
                    
                }
                
            }
            
        }
        
    };
    
    
    
    class StoryTree{
        SDB storyBase;
        Character *characters;
        
        
    };
    
    
    
}
