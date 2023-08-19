/**
 * description： 工具函数
 * @author Kevin
 * @date 2023/8/10
 */
import _ from "lodash"

const utils = {
	md2json: function (){

	},
	json2md: function (){

	},
	/**
	 * markdown的str转 目录树形结构
	 */
	parseMarkdownToTree:function (markdown){
		const lines = markdown.split('\n');
		const directoryTree = [];
		let currentSection = { type: 'root', children: directoryTree };
		const listStack = [];

		for (const line of lines) {
			const trimmedLine = line.trim();
			const matchHeading = trimmedLine.match(/^(#{1,6})\s+(.*)/);
			const matchListItem = trimmedLine.match(/^(\s*[-+*])\s+(.*)/);
			const matchImage = trimmedLine.match(/^!\[([^\]]+)\]\(([^\)]+)\)/);

			if (matchHeading) {
				const level = matchHeading[1].length;
				const text = matchHeading[2];
				const newSection = { type: 'section', level, text, children: [] };
				while (listStack.length > 0 && listStack[listStack.length - 1].level >= newSection.level) {
					listStack.pop();
				}
				if (listStack.length === 0) {
					directoryTree?.push(newSection);
				} else {
					listStack[listStack.length - 1].children?.push(newSection);
				}
				listStack?.push(newSection);
				currentSection = newSection;
			} else if (matchListItem) {
				const text = matchListItem[2];
				if (currentSection.type !== 'list') {
					const newList = { type: 'list', level: matchListItem[1].length, children: [] };
					currentSection.children?.push(newList);
					listStack?.push(currentSection);
					currentSection = newList;
				}
				const newItem = { type: 'item', text, children: [] };
				currentSection.children?.push(newItem);
			} else if (matchImage) {
				const altText = matchImage[1];
				const src = matchImage[2];
				currentSection?.type === "list" ? listStack[listStack.length - 1].children?.push({
					type: 'image',
					altText,
					src
				}) : currentSection.children?.push({type: 'image', altText, src});
			} else if (trimmedLine !== '') {
				if (currentSection.type === 'list') {
					const newParagraph = { type: 'paragraph', text: trimmedLine };
					listStack[listStack.length - 1].children?.push(newParagraph);
				} else {
					currentSection.children?.push({ type: 'paragraph', text: trimmedLine });
				}
			}
		}

		return directoryTree;
	}
}

export default utils

