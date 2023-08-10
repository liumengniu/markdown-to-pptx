/**
 * description： cherry-markdown
 * @author Kevin
 * @date 2023/8/10
 */
import "./index.scss"
import mdStr from "@/mocks/markdown";
import ReactMarkdown from "react-markdown";

function CherryMarkdown() {
	/**
	 * 初始化md
	 */
	
	return (
		<div className="md">
			<div className="md-left">
				{mdStr}
			</div>
			<div className="md-right">
				<ReactMarkdown children={mdStr}/>
			</div>
		
		</div>
	)
}

export default CherryMarkdown
