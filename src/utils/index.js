/**
 * description：
 * @author Kevin
 * @date 2023/8/10
 */

const utils = {
	md2json: function (){

	},
	json2md: function (){

	},
	/**
	 * markdown的str转 树形结构
	 */
	parseMarkdownToTree: function (markdown){
		const lines = markdown.split('\n');
		const tree = [];
		let currentNode = { children: tree };

		for (const line of lines) {
			const match = line.match(/^(#+)\s+(.*)/);
			if (match) {
				const level = match[1].length; // Heading level based on the number of '#' symbols
				const text = match[2];
				const newNode = { level, text, children: [] };

				if (level <= currentNode.level) {
					while (currentNode.level >= level) {
						currentNode = currentNode.parent;
					}
				}

				newNode.parent = currentNode;
				currentNode.children.push(newNode);
				currentNode = newNode;
			} else {
				if (line.trim() !== "") {
					if (!currentNode.text) {
						currentNode.text = "";
					}
					currentNode.text += line + "\n";
				}
			}
		}

		return tree;
	}
}

export default utils
