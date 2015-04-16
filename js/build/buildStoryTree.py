import argparse

if __name__ == '__main__':
	parser = argparse.ArgumentParser(description='Build the StoryTree library with private classes')
	parser.add_argument('--input-folder', required=True, dest='input_folder', metavar='NAME', help='The directory location of the StoryTree components')
	parser.add_argument('--output-file', required=True, dest='output_file', metavar='NAME', help='The build output javascript file')

	args = parser.parse_args()

	folderLoc = args.input_folder
	output = args.output_file

	sdb = open(folderLoc + "SDB.js", "r")
	character = open(folderLoc + "Character.js", "r")
	stree = open(folderLoc + "STree.js", "r")
	StoryTree = open(folderLoc + "StoryTree.js", "r")

	toOtherFiles = False
	triggered = False
	firstClosedBracketPassed = False
	outputString = ""
	for line in StoryTree.readlines():
		line = line.replace("alert", "throw")
		#This should only be triggered once
		if toOtherFiles:

			#read in sdblines
			for sdbline in sdb.readlines():
				sdbline = sdbline.replace("alert", "throw")
				outputString = outputString + "\t" + sdbline
			outputString = outputString + "\n\n"

			#read in characterlines
			for charline in character.readlines():
				charline = charline.replace("alert", "throw")
				outputString = outputString + "\t" + charline
			outputString = outputString + "\n\n"

			#read in Action tree lines
			for aline in stree.readlines():
				aline = aline.replace("alert", "throw")
				outputString = outputString + "\t" + aline
			outputString = outputString + "\n\n"

			toOtherFiles = False
			outputString = outputString + "\n\n"
			outputString = outputString + "\t//These are the members of StoryTree \n"

		#If we've passed our first closed bracket, don't add it to the string
		if "};" in line and not firstClosedBracketPassed:
			firstClosedBracketPassed = True
			continue

		#add the story tree line to the string
		if triggered and firstClosedBracketPassed:
			outputString = outputString + "\t" + line
		else:
			outputString = outputString + line

		#If we've passed our first open bracket, read in other lines on next line
		if "{" in line and not triggered:
			toOtherFiles = True
			triggered = True

	outputString = outputString + "\n};"

	file = open(output, "w")

	file.write(outputString)

	sdb.close()
	character.close()
	stree.close()
	StoryTree.close()

	file.close()