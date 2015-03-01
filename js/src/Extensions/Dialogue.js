//This Dialogue Extension has to be built into StoryTree with the build script

/*
*	Line Class, contains info about a specific line of dialogue
*
* character(string) - Contains a macro of "%i%" (initiator or player), "%r%" (responder or who the player talks to) or a manual string for a character name
* content(string) - The dialogue that is said
*/
var Line = function(character, content){
	this.character = character;
	this.content = content;
}

//Line.checkLine(character, line)
//A static function to check the formatting of a line of dialogue
//ARGUMENTS:
//	character(string) - a macro or the name of a character
//	line(string) - what is said
//RETURN string
Line.prototype.checkLine = function(character, content){

	//start tracking whether an error is made or not
	var isBad = false;
	var errorString = "";

	//Check character
	if(typeof character !== "string"){
		isBad = true;
		errorString += "The character of your Line is not a string. \n";
	} else if(character !== "%i%" || character !== "%r%"){
		console.log("Line warning, a character in one of your lines is not the macro '%i%' or '%r%'. " +
								"This means you have manually set which character is speaking here, and your dialogue is not reactive to who the player is talking to.");
	}

	//Check line
	if(typeof content !== "string"){
		isBad = true;
		errorString += "The content of your Line is not a string. \n";
	}

	//Build up the error message if we've gone bad
	if(isBad){
		errorString = "***Error: Improper Line format.*** \n \n "
			+ "You're receiving this because you improperly formatted one of your Line objects. \n"
			+ "The bad Line: \n"
			+ " -- character: " + character + " \n"
			+ " -- content: " + content + " \n"
			+ "Other error info: \n" + errorString + "\n\n\n";
	}

	//Return what went wrong
	return errorString;
};

/*
*	Dialogue Class, contains info for a dialogue exchange between 2 characters
*
*	actionPath(string) - String representation of the path taken to get to this exchange
* lines([Line]) - A set of "Line" objects
*	hintLine(string) - a general gist of what will be said, assumed to be the first line if unspecified
*/
var Dialogue = function(path, lines, hintLine){
	this.actionPath = path;

	//Set our line objects in one by one
	this.lines = [];
	for(var i = 0; i < lines.length; i++){
		this.lines.push( new Line(lines[i].character, lines[i].content) );
	}

	this.hintLine = hintLine;
};

//Dialogue.checkDialogue(path, lines, hintLine)
//Checks the formatting of the Dialogue
//ARGUMENTS:
//	path(string or [int]) - the action path to the dialogue
//	lines([{character(string), content(string)}]) - array of line js objects
//	hintline(string) - the hint that is printed for players at that string
//RETURN bool;
Dialogue.prototype.checkDialogue = function(path, lines, hintLine){
	//Track if we go bad somewhere
	var isBad = false;
	var errorString = "";

	//Other tracking info
	var linesAreArray = false;
	var pathIsArray = false;

	//Check path of the dialogue, see if it's an array
	if(Object.prototype.toString.call( path ) === '[object Array]'){
		pathIsArray = true;
		//loop through each path number
		for(var i = 0; i < path.length; i++){
			var uid = path[i];
			if(typeof uid !== "number"){
				isBad = true;
				errorString += "Your path of uids contains at least 1 non-int. \n";
				break;
			}
		}

		//Convert the path to a string
		if(!isBad) path = DialogueDB.pathToString(path);
	}
	//Now check if it's a string otherwise
	else if(typeof path !== "string"){
		isBad = true;
		errorString += "Your path of uids is neither a string or an array of ints. \n";
	}

	//Now Check all lines
	var lineErrors = "";
	//If not an array, record that
	if(Object.prototype.toString.call( lines ) !== '[object Array]'){
		isBad = true;
		errorString += "Your lines are not an array. \n";
	} else {
		linesAreArray = true;
		//Now check line errors if it is an array
		for(var j = 0; j < lines.length; j++){
			lineErrors += Line.checkLine(lines[j].character, lines[j].content);
			if(Line.checkLine(lines[j].character, lines[j].content) !== ""){
				isBad = true;
				errorString += "One or more of your lines are incorrectly formatted. \n";
			}
		}
	}

	//Check hintLine
	if(typeof hintLine !== "string"){
		isBad = true;
		errorString += "Your hintLine is not a string"
	}

	//If we've gone bad somewhere, throw an alert
	if(isBad){

		//Build up our lines as a string, if needed
		var lineInfo = lines;
		if(linesAreArray){
			lineInfo = "[ {character: " + lines[0].character + ", content: " + lines[0].content + "}";
			for(var a = 1; a < lines.length; a++){
				lineInfo += ", {character: " + lines[a].character + ", content: " + lines[a].content + "}";
			}
			lineInfo += "]";
		}

		//Build up our path as a string, if needed
		var pathInfo = path;
		if(pathIsArray){
			pathInfo = "[ " + path[0];
			for(var b = 0; b < path.length; b++){
				pathInfo += ", " + path[b];
			}
			pathInfo += "]";
		}

		//Build our error info
		errorString = "***Error: Improper Dialogue format.*** \n \n "
			+ "You're receiving this because you improperly formatted one of your Dialogue objects. \n"
			+ "The bad Dialogue: \n"
			+ " -- path: " + pathInfo + " \n"
			+ " -- lines: " + lineInfo + " \n"
			+ " -- hintLine: " + hintLine + " \n"
			+ "Other error info: \n" + errorString + "\n\n\n" + lineErrors;

		//Throw our alert
		alert(errorString);
	}

	//Return if we've gone bad somewhere
	return isBad;

};

/*
*	DialogueDB Class, top level class that contains all possible dialogue objects, member of character
*
*	dialogues(<string, Dialogue>) - a map that maps string representation of paths to dialogue objects
*/
var DialogueDB = function(){
	this.dialogues = {};
}

//DialogueDB.addDialogue(path, lines, hintLine)
//Maps a Dialogue Object to the DialogueDB with a given path
//ARGUMENTS:
//	path([int] or string) - the path to the dialogue we're getting
//	lines([Line]) - set of line objects that the dialogue is built with
//	hintLine(string) - The outward facing line before anything is said
//RETURN void;
DialogueDB.prototype.addDialogue = function(path, lines, hintLine){
	//If it's a uid array, turn it into a string
	if(Object.prototype.toString.call( path ) === '[object Array]'){
		path = this.pathToString(path);
	}

	//Do the mapping
	this.dialogues[path] = new Dialogue(path, lines, hintLine);
};

//DialogueDB.getDialogue(path)
//Get the dialogue object for a given path
//ARGUMENTS:
//	path([int] or string) - the uid path to the dialogue we're getting
//RETURN Dialogue;
DialogueDB.prototype.getDialogue = function(path){
	//If it's a uid array, turn it into a string
	if(Object.prototype.toString.call( path ) === '[object Array]'){
		path = this.pathToString(path);
	}

	//return the dialogue object
	return this.dialogues[path];
}

//DialogueDB.pathToString(path)
//Static function to turn a path into a ":" seperated string notation
//ARGUMENTS:
//	path([int]) - A set of UIDs that represent the UID path down an action tree
//RETURN string
DialogueDB.prototype.pathToString = function(path){
	//If the array length is 0, return
	if(path.length < 1) return;

	//Build up and return the string
	var pathString = (path[0]).toString();
	for(var i = 1; i < path.length; i++){
		pathString += ":" + path[i];
	}
	return pathString;
};


//Add another field to Character for the DialogueDB
Character.prototype.dialogueDB = new DialogueDB();


/*
* Macro Class, if we want to dynamically replace something in a bit of dialogue, we can do that by setting up some macros
*
*	representation(string) - what are we replacing, surrounded by %%, can't contain spaces
*	replacement(function) - a function that returns a string that replaces the representation
*/
var Macro = function(representation, replacement){
	this.representation = representation;
	this.replacement = replacement;
};

/*
*	MacroDB Class, contains all macros
*
* macros(<string, Macro>) - a map of all representations to macros
*/
var MacroDB = function(){
	this.macros = {};
}

//MacroDB.addMacro(representation, replacement)
//Adds a Macro to the macroDB
MacroDB.prototype.addMacro = function(representation, replacement){
	//TODO Implement function
};

//MacroDB.checkMacro(representation, replacement)
//Checks the formatting of the macro to be added
MacroDB.prototype.checkMacro = function(representation, replacement){
	//TODO Implement function
};

//Add a macroDB object to our StoryTree instance
//These are global and non-specific to each character
StoryTree.prototype.macroDB = new MacroDB();

//Add another loading field to StoryTree Main,
//Since we're loading another database asyncronously, we need to track if it's being loaded as well
StoryTree.prototype.loadingDialogue = false;

//StoryTree.isLoaded() overwrite
//Overwrite of base isLoaded() function, accounting for dialogue too
//RETURN bool - have the JSONs been loaded
StoryTree.prototype.isLoaded = function(){
	return !(this.loadingSDB || this.loadingTree || this.loadingCharacters || this.loadingDialogue);
};

//StoryTree.setDialogue(character, info)
//Function that loads all relevant dialogue from a javascript object or a json file to a specific character
//Can only be called after storyTree.setActions()
//ARGUMENTS:
//	character(string) - The character this data is for
//  info([{}] or string) - Either the correctly formatted dialogue info or the location of json file
//RETURN void
StoryTree.prototype.setDialogue = function(character, info){
	//First, check for bad formatting
	if(this.badFormatting) return;

	//For scoping when loading json
	var that = this;

	//signal that we're loading dialogue
	this.loadingDialogue = true;

	//First check to see if characters have been loaded
	//We're loading JSON asynchronously, so it is a bit wonky with the timing
	if(this.characterDB.isEmpty()){
		var setD = function(){that.setDialogue(characters, info);};
		//reload function every 100 milliseconds
		window.setTimeout(setD, 100);
		return;
	}

	//Now check if the character exists, getCharacter handles the alert
	if(this.characterDB.getCharacter(character) == undefined){
		return;
	}
	var character = this.characterDB.getCharacter(character);

	//function that will actually set the info once it's been parsed
	function setMyDialogue(jsonData){
		//If the json data isn't in an array, put it in an array
		if(Object.prototype.toString.call( jsonData ) === '[object Array]'){
			jsonData = [jsonData];
		}

		for(var i = 0; i < jsonData.length; i++){
			var dialogue = jsonData[i];

			//Error check our dialogue
			if(Dialogue.checkDialogue(dialogue.path, dialogue.lines, dialogue.hintLine)){
				that.badFormatting = true;
				return;
			}

			//Now simply add our dialogue info to our character's dialogueDB
			character.dialogueDB.addDialogue(dialogue.path, dialogue.lines, dialogue.hintLine);
		}

		//Now we're done loading dialogue ;)
		that.loadingDialogue = false;
	}

	//Now check formatting of info
	if(typeof info === "string"){
		//If it's a string, we can assume json
		var request = new XMLHttpRequest();
		request.open('GET', info, true);
		//parse the info and pass it to the setMyDialogue function
		request.onload = function() {
		  if (this.status >= 200 && this.status < 400) {
				// Success!
		    var data = JSON.parse(this.responseText);
				setMyDialogue(data);
			}
		};

		request.onerror = function() {
		  console.log("Unable to parse " + character + "'s Dialogue from this path: " + info);
		  that.loadingTree = false;
		};

	} else {
		//Else, we can assume that we've been hand-fed the info, since we have error checking somewhere else
		setMyDialogue(info);
	}

};

//StoryTree.setMacro(info)
//Function that loads macros into the MacroDB
StoryTree.prototype.setMacro = function(info){
	//TODO Implement function
}

//StoryTree.getAllPaths(name)
//This is more of a utility function for dialogue than a user facing one,
//But this can still tell users a lot about how many actions could be taken
//This function will retrieve a double list of all available action paths in a
//tree for a given character
//ARGUMENTS:
//  name(string) - the name of the character
//RETURN [[int]]
StoryTree.prototype.getAllPaths = function(name){
  var that = this;

	//check to see if we're still loading JSON
	if(!this.isLoaded()){
		var l = function(){that.getAllPaths(character)};
		console.log("Wait 500 ms for the JSONs to load....");
		window.setTimeout(l, 500);
		return;
	}

	//Grab the correct character and tree
	var character = this.characterDB.getCharacter(name);
	var tree = character.tree;

	//This variable is the set of all sets of uids, will be returned
	var doubleActionList = [];

  //function for recursing through the tree
  function traverse(uid, actionList){
		//push uid onto the list
		actionList.push(uid);

		//Get the action Object
		var action = tree.actions[uid];

		//If the action is a leaf, attach current action list to doubleActionList,
		//Then return
		if(action.isLeaf()){
			doubleActionList.push(actionList);
			return;
		}

		//Loop through the action's children
		for(var i = 0; i < action.children.length; i++){
			var nextUID = action.children[i];

			//Call traverse on the next child
			traverse(nextUID, actionList);
		}
  }

	//Call traversal for all first uids
	for(var i = 0; i < tree.firsts.length; i++){
		var first = tree.firsts[i];
		traverse(first, []);
	}

	return doubleActionList;

};

//StoryTree.getDialogueOptions(name, numberOfOptions)
//Returns all hintLines of available option paths
//ARGUMENTS:
//	name(string) - name of character
//	numberOfOptions(int) - number of options to return
//RETURN [string]
StoryTree.prototype.getDialogueOptions = function(name, numberOfOptions){
	//TODO implement function
}
