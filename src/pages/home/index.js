import ReactMarkdown from "react-markdown"
import mdStr from "@/mocks/markdown"
import "./index.scss"
import {useEffect} from "react";
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toString} from 'mdast-util-to-string'



const MarkdownIt = require('markdown-it');
/**
 * description： 首页
 * @author Kevin
 * @date 2023/8/10
 */

function Home() {
	useEffect(()=>{
		initData();
	}, [])
	
	/**
	 * 初始化数据
	 */
	const initData = ()=>{
		let md = new MarkdownIt();
		let res = md.renderInline(mdStr)
		
		const tree = fromMarkdown(mdStr)
		const treeStr = toString(tree)
		
		console.log(res, 'resresresresresresresresresres', tree, treeStr)
	}
	
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
