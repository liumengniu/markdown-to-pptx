import "./App.scss"
import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/home"
import Markdown from "@/pages/markdown";

function App() {

	return (
		<div className="App">
			<HashRouter path="/*">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/cherry-markdown" element={<Markdown />} />
				</Routes>
			</HashRouter>
		</div>
	)
}

export default App
