import "./App.scss"
import _ from "lodash"
import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/home"
import CherryMarkdown from "@/pages/cherry-markdown";
import mdStr from "@/mocks/markdown";

function App() {
	useEffect(() => {
		md2json(mdStr)
	}, [])
	
	/**
	 * markdown转json
	 * @param str
	 */
	const md2json = str => {
		let list = _.split(str, "\n")
		console.log(list, "listlistlistlistlistlistlistlistlistlistlistlist")
	}

	return (
		<div className="App">
			<HashRouter path="/*">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/cherry-markdown" element={<CherryMarkdown />} />
				</Routes>
			</HashRouter>
		</div>
	)
}

export default App
