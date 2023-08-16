import "./App.scss"
import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "@/pages/home"
import Pptx from "@/pages/pptx";

function App() {

	return (
		<div className="App">
			<HashRouter path="/*">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/pptx" element={<Pptx />} />
				</Routes>
			</HashRouter>
		</div>
	)
}

export default App
