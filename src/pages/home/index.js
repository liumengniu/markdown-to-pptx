import ReactMarkdown from "react-markdown"
import mdStr from "@/mocks/markdown"
import "./index.scss"
import {useEffect, useState} from "react";
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {definitions} from 'mdast-util-definitions'
import {toc} from 'mdast-util-toc'
import {toString} from 'mdast-util-to-string'
import _ from "lodash"

const MarkdownIt = require('markdown-it');
/**
 * description： 首页
 * @author Kevin
 * @date 2023/8/10
 */

function Home() {
	const [data, setData] = useState([])
	
	
	useEffect(()=>{
		initData();
	}, [])
	
	/**
	 * 初始化数据
	 */
	const initData = ()=>{
		let md = new MarkdownIt();
		let res = md.render(mdStr)
		
		const tree = fromMarkdown(mdStr)
		const table = toc(tree, {tight: false, ordered: true})
		setData(tree)
		console.log(tree,'============================================',  table)
		console.dir(table, {depth: 2})
	}
	
	const renderTree = ()=>{
		let level = 1;
		return (
			<div className="tree">
				{
					_.map(data?.children, (o, idx)=>{
						if(!_.isNil(o?.depth)) level = o?.depth;
						return (
							<div className={`${o?.depth ? 'depth-'+ o?.depth : '' } tree-item`} style={{ paddingLeft: o?.type === "paragraph" ? level *30 + "px" : (o?.depth -1) *30 + "px"}} key={idx}>
								<div className="tree-item-line"/>
								<div className="tree-item-point"/>
								<div className="tree-item-content">{_.get(o, `children.0.value`)}</div>
							</div>
						)
					})
				}
			</div>
		)
	}
	/**
	 * 递归渲染md树节点
	 */
	const renderItem = ()=>{
		return _.map(data?.map, (o, idx)=>{
			return (
				<div className="tree-item" key={idx}>
					<div className="tree-item-point"/>
					<div className="tree-item-content">{_.get(o,`children.0.children.0.children.0.value`)}</div>
				</div>
			)
		})
	}
	
	return (
		<div className="md">
			<div className="md-left">
				{renderTree()}
				{/*{renderItem()}*/}
			</div>
			<div className="md-right">
				<ReactMarkdown children={mdStr}/>
			</div>
		</div>
	)
}

export default Home
