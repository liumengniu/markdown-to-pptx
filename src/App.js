import "./App.scss"
import _ from "lodash"
import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/home"

function App() {
	useEffect(() => {
		md2json()
	}, [])

	/**
	 * 模拟md的数据
	 * @type {string}
	 */
	const mdStr =
		"# 一级标题\n" +
		"这是一级标题下的正文内容。\n" +
		"## 二级标题\n" +
		"这是二级标题下的正文内容。\n" +
		"### 三级标题\n" +
		"这是三级标题下的正文内容。\n" +
		"#### 四级标题\n" +
		"这是四级标题，但Markdown标准只支持三级标题，所以会按照三级标题来显示。\n" +
		"##### 五级标题\n" +
		"同样，这是五级标题，但会显示为三级标题。\n" +
		"## 另一个二级标题\n" +
		"这是另一个二级标题下的正文内容。\n" +
		"### 另一个三级标题\n" +
		"这是另一个三级标题下的正文内容。\n"

	/**
	 * markdown转json
	 * @param str
	 */
	const md2json = (str = mdStr) => {
		let list = _.split(str, "\n")
		console.log(list, "listlistlistlistlistlistlistlistlistlistlistlist")
	}

	return (
		<div className="App">
			<HashRouter path="/*">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/cherry-markdown" element={<Home />} />
				</Routes>
			</HashRouter>
		</div>
	)
}

export default App
