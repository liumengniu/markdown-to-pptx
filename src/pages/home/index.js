import ReactMarkdown from "react-markdown"
import mdStr from "@/mocks/markdown"
import "./index.scss"
import {useEffect} from "react";

/**
 * description： 首页
 * @author Kevin
 * @date 2023/8/10
 */

function Home() {
	useEffect(()=>{
		
	}, [])
	
	return (
		<div className="home">
			<div className="home-left">
				{mdStr}
			</div>
			<div className="home-right">
				<ReactMarkdown children={mdStr}/>
			</div>
			
		</div>
	)
}

export default Home
