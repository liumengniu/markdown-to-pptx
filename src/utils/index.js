/**
 * description： 工具函数
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
	parseMarkdownToTree2: function (markdown){
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
				//新增图片兼容，将子目录下的图片往上提升，放在父一级更好处理
				if (!currentNode.images || JSON.stringify(currentNode.images) === "[]") currentNode.images = [];
				currentNode.images = [imageUrl]
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
	},
	
	parseMarkdownToTree: function (markdown) {
		const lines = markdown.split('\n');
		const root = { type: 'root', children: [] };
		let currentParent = root;
		
		for (const line of lines) {
			const trimmedLine = line.trim();
			
			if (trimmedLine.startsWith('#')) {
				const level = trimmedLine.indexOf(' ');
				const text = trimmedLine.slice(level + 1);
				const newNode = { type: 'heading', level, text, children: [] };
				
				while (currentParent.level >= level) {
					currentParent = currentParent.parent;
				}
				
				currentParent.children?.push(newNode);
				newNode.parent = currentParent;
				currentParent = newNode;
			} else if (trimmedLine.startsWith('*')) {
				const newNode = { type: 'list', items: [], parent: currentParent };
				currentParent.children?.push(newNode);
				currentParent = newNode;
				const listItem = { type: 'listItem', text: trimmedLine.slice(1).trim(), children: [] };
				currentParent.items?.push(listItem);
			} else if (trimmedLine.startsWith('![')) {
				const altTextStart = trimmedLine.indexOf('[') + 1;
				const altTextEnd = trimmedLine.indexOf(']');
				const srcStart = trimmedLine.indexOf('(') + 1;
				const srcEnd = trimmedLine.indexOf(')');
				const altText = trimmedLine.substring(altTextStart, altTextEnd);
				const src = trimmedLine.substring(srcStart, srcEnd);
				const newNode = { type: 'image', altText, src, parent: currentParent };
				currentParent.children?.push(newNode);
			} else {
				const newNode = { type: 'paragraph', text: line, children: [], parent: currentParent };
				currentParent.children?.push(newNode);
			}
		}
		
		return root.children;
	}
}

export default utils

