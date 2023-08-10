import "./App.scss"
import _ from "lodash"
import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/home"
import CherryMarkdown from "@/pages/cherry-markdown";
import mdStr from "@/mocks/markdown";

function App() {

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
