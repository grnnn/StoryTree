StoryTree is an advanced game AI engine library inspired by UCSC's CiF.

Features:
=========
  *As a game creator, you can use StoryTree to set up a flexible story space.  
  *StoryTree can set and track characteristics of characters, the game world, and the player.  
  *StoryTree uses a non-binary, layered tree structure to dynamically choose which actions can be performed.  
  *StoryTree can load and run multiple StoryTree instances for organizational purposes  
  *Content in StoryTree is authored by simple JSON files  

StoryTree is written in Javascript, with a C++ version on the way

Overview
========

StoryTree is not a trivial AI engine. There are 3 moving parts.
  *SDB (Story DataBase)
  *Characters
  *Story Trees

SDB
---

The Story DataBase represents the Story Space that can be traversed in StoryTree. The Objects in the SDB follow a specific format, but the SDB is general enough to allow a lot of flexibility.

![alt tag](https://github.com/grnnn/StoryTree/blob/master/Examples/SDBExample.png)

The SDB's basic building blocks are Classes (Not to be confused with Computer Science classes). Classes are categories that can be given a set of more specific types.

SDB Classes can either have values of booleans or ints. If Classes have int values, then they have to be given a minimum and a maximum value. SDB Classes are also given default values.

Example JSON to populate an SDB:
```json
[
{
	"class" : "feeling",
	"types" : ["happy", "sad", "angry"],
	"isBoolean" : false,
	"min" : 0,
	"max" : 10,
	"defaultVal" : 5
},
{
	"class" : "likes eating",
	"types" : ["cookie", "pasta", "pizza"],
	"isBoolean" : true,
	"defaultVal" : true
},
{
	"class" : "owns",
	"types" : ["cookie", "computer", "house"],
	"isBoolean" : true,
	"defaultVal" : true
},
{
	"class" : "location",
	"types" : ["underwater", "volcano"],
	"isBoolean" : true,
	"defaultVal" : true
}
]
``` 

Characters
----------

The Characters are entities within StoryTree that can be given characteristics and be interacted with. There are 2 default characters called "World" and "Player", which can also be given characteristics.

![alt tag](https://github.com/grnnn/StoryTree/blob/master/Examples/CharacterExample.png)

Characteristics are expressed by SDB values. You can give a character a characteristic by specifying what the class, type, and value is for that characteristic.

Example JSON to populate characters:
```json
{
	"characters" : ["Becky", "Trish"],
	"characteristics" : 
	[
		{
			"name" : "Becky", 
			"class" : "feeling",
			"type" : "happy",
			"value" : 4
		},
		{
			"name" : "Becky",
			"class" : "likes eating",
			"type" : "cookie",
			"value" : true
		},
		{
			"name" : "Trish", 
			"class" : "feeling",
			"type" : "sad",
			"value" : 2
		},
		{
			"name" : "Trish",
			"class" : "likes eating",
			"type" : "cookies",
			"value" : false
		},
		{
			"name" : "World", 
			"class" : "location",
			"type" : "underwater"
		},
		{
			"name" : "Player",
			"class" : "owns",
			"type" : "cookie",
			"value" : true
		}
	]
}
```

Action Tree
-----------

The Action Tree brings StoryTree together, and it is absolutely the most complex part. Every character can be assigned an Action Tree, and Actions make up every node on the tree.

![alt tag](https://github.com/grnnn/StoryTree/blob/master/Examples/ActionTreeExample.png)

An Action is given a name (which doesn't have to be unique), a uid (unique ID, has to be a unique int), a identifier puts it at the top of the tree, a parent uid (0 if at top of tree), a set of children uids, a class,
a set of Preconditions, and a set of Expressions.

Preconditions are expressed by an SDB Value (class, type, value), a character, and an operator. The operation on the precondition describes how it is compared to a precondition (ex. ">", "<", "=="). All preconditions on an action have to be true for it to be traversed to. All Actions have to have at least 1 Precondition.

Expressions change chracteristics of the StoryTree system. They are also represented as SDB values (class, type, value), a character, and an operator. The operation on the Expression describes how it changes a Characteristic (ex. "+", "-", "="). The character specifies which character's characteristic to change. Actions don't have to have an Expression.

There are two main ways that the Action Tree is interacted with:
  *Story Tree can retrieve a number of specified leaf (no children) actions from the Action class with the getActions() function. The Action Tree will only return leaf actions that have satisfied all of the preconditions of all preceding parents. (*Note*: If an Action is given a class, all child actions will inherit that class. No more than 1 action from the same class can be returned by the getOptions() function. This is a useful way to break your actions up into categories.)
  *Story Tree can execute a leaf Action that is accesible by way of getOptions(). You do this with the executeAction() function. This will resolve all expressions of the Action, and then also resolve all of the expressions of all of the parent Actions.

Example JSON to populate Action Tree:
```json
[
{
	"name" : "Trish Looks sad. Ask her if she's okay.",
	"uid" : 15495,
	"first" : true,
	"parent" : 0,
	"preconditions" : 
	[
		{
			"character" : "Trish",
			"class" : "feeling",
			"type" : "sad",
			"operation" : "==",
			"value" : 2
		}
	]
},
{
	"name" : "Give Trish a Cookie",
	"uid" : 15496,
	"first" : true,
	"parent" : 0,
	"class" : "Give Cookie",
	"preconditions" : 
	[
		{
			"character" : "Player",
			"class" : "owns",
			"type" : "cookie",
			"operation" : "==",
			"value" : true
		}
	],
	"expressions" :
	[
		{
			"character" : "Trish",
			"class" : "owns",
			"type" : "cookie",
			"operation" : "=",
			"value" : true
		},
		{
			"character" : "Player",
			"class" : "owns",
			"type" : "cookie",
			"operation" : "=",
			"value" : false
		}
	],
	"leadsTo": 
	[
		15497, 15498
	]
},
{
	"name" : "Give Trish a cookie, and Trish is Happy",
	"uid" : 15497,
	"first" : false,
	"parent" : 15496,
	"preconditions" :
	[
		{
			"character" : "Trish",
			"class" : "feeling",
			"type" : "happy",
			"operation" : ">",
			"value" : 5
		}
	],
	"leadsTo": 
	[
		15499, 15500
	]
},
{
	"name" : "Give Trish a cookie, and Trish is Unhappy",
	"uid" : 15498,
	"first" : false,
	"parent" : 15496,
	"preconditions" :
	[
		{
			"character" : "Trish",
			"class" : "feeling",
			"type" : "happy",
			"operation" : "<",
			"value" : 6
		}
	], 
	"expressions" :
	[
		{
			"character" : "Trish",
			"class" : "feeling",
			"type" : "angry",
			"operation" : "+",
			"value" : 2
		}
	]
},
{
	"name" : "Give Trish a cookie, Trish is happy, and Trish likes cookies",
	"uid" : 15499,
	"first" : false,
	"parent" : 15497,
	"preconditions" :
	[
		{
			"character" : "Trish",
			"class" : "likes eating",
			"type" : "cookie",
			"operation" : "==",
			"value" : true
		}
	]
},
{
	"name" : "Give Trish a cookie, Trish is happy, and Trish doesn't like cookies",
	"uid" : 15499,
	"first" : false,
	"parent" : 15497,
	"preconditions" :
	[
		{
			"character" : "Trish",
			"class" : "likes eating",
			"type" : "cookie",
			"operation" : "==",
			"value" : false
		}
	]
}
]
```

*Note:* StoryTree reads in a path to a folder for Action Tree population. Each character has a json file that has the exact name of that character (for example, the above json is called Trish.json), and then that folder is moved to the folder. StoryTree looks for all characters registered by characters.json when evaluating (Except for "World" and "Player").

Public Functions:
=================

**Constructor** - creates a new StoryTree instance

js:
```javascript
var myStoryTree = new StoryTree();
```


**setSDB** - Populates a StoryTree with a new SDB (Story DataBase) from a JSON file  
Arguments: String JSONPath

js:
```javascript
myStoryTree.setSDB('res/SDB.json');
```


**setCharacters** - Populates a StoryTree with a set of characters, can only be ran after SDB has been populated  
Arguments: String JSONPath

js:
```javascript
myStoryTree.setCharacters('res/character.json');
```


**setTrees** - Populates a StoryTree with a set of trees, with one tree for each character.
		   There's 1 StoryTree JSON file for each character. Can only be run after setSDB and setCharacters.  
Arguments: String FolderPath

js:
```javascript
myStoryTree.setTrees('res/StoryTrees/');
```


**getOptions** - Given a character and a maximum number of options, 
		     getOptions will return a set of uids for available actions (leafs on the tree)  
Arguments: String characterName, int uid

js:
```javascript
var options = myStoryTree.getOptions("Trish", 3);
```


**getActionName** - Given a character and a uid for an action, return the name  
Arguments: String characterName, int uid

js:
```javascript
var name = myStoryTree.getActionName("Trish", options[0]);
```


**isLoaded** - Can tell if any JSON libraries are still loading, StoryTree shouldn't be used if anything is loading

js:
```javascript
if(myStoryTree.isLoaded()){
	console.log("It's okay to use StoryTree");
}
```


**executeAction** - Given a character and a uid, execute an action in StoryTree  
Arguments: String characterName, int uid

js:
```javascript
myStoryTree.executeAction("Trish", options[0]);
```


**getCharacters** - Returns a set of characters available in the Story Tree

js:
```javascript
var characters = myStoryTree.getCharacters();
```


**getCharacteristics** - Given a character, return the characteristics of that character  
Arguments: String characterName

js:
```javascript
var TrishCharacterisitics = myStoryTree.getCharacteristics("Trish");
```