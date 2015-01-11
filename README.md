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

![alt tag](https://raw.github.com/grnnn/StoryTree/Examples/SDBExample.png)

The SDB's basic building blocks are Classes (Not to be confused with Computer Science classes). Classes are categories that can be given a set of more specific types.

SDB Classes can either have values of booleans or ints. If Classes have int values, then they have to be given a minimum and a maximum value. SDB Classes are also given default values.

Example JSON to populate an SDB:
```
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