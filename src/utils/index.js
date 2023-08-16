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
			const matchHeading = line.match(/^(#+)\s+(.*)/);
			const matchImage = line.match(/^\!\[([^\]]+)\]\(([^\)]+)\)/);
			const matchLink = line.match(/\[([^\]]+)\]\(([^\)]+)\)/);

			if (matchHeading) {
				const level = matchHeading[1].length;
				const text = matchHeading[2];
				const newNode = { type: 'heading', level, text, children: [] };

				if (level <= currentNode.level) {
					while (currentNode.level >= level) {
						currentNode = currentNode.parent;
					}
				}

				newNode.parent = currentNode;
				currentNode.children.push(newNode);
				currentNode = newNode;
			} else if (matchImage) {
				const altText = matchImage[1];
				const imageUrl = matchImage[2];
				const newNode = { type: 'image', altText, imageUrl };

				currentNode.children.push(newNode);
			} else if (matchLink) {
				const linkText = matchLink[1];
				const linkUrl = matchLink[2];
				const newNode = { type: 'link', linkText, linkUrl };

				currentNode.children.push(newNode);
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
