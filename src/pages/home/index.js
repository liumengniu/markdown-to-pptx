import ReactMarkdown from "react-markdown"
import mdStr from "@/mocks/markdown"
import "./index.scss"
import {useEffect, useRef, useState} from "react";
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from "mdast-util-to-markdown"
import {toHtml} from 'hast-util-to-html'
import {toHast} from 'mdast-util-to-hast'
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
	const [rightData, setRightData] = useState([])
	const [html, setHtml] = useState(null)
	
	useEffect(()=>{
		initData();
	}, [])
	
	// const
	
	/**
	 * 初始化数据
	 */
	const initData = ()=>{
		let md = new MarkdownIt();
		let res = md.render(mdStr)
		const tree = fromMarkdown(mdStr)
		renderHtml(tree)
		const str =  toString(tree)
		const table = toc(tree)
		setData(tree)
		setRightData(tree)
		// console.log(tree,'============================================',  str)
	}
	/**
	 * 根据左侧的编辑 - 渲染最新的html
	 */
	const renderHtml = mdast =>{
		const hast = toHast(mdast)
		const lastHtml = toHtml(hast)
		setHtml(lastHtml)
	}
	/**
	 * 编辑左侧md树
	 */
	const handleEditMd = (e, idx) =>{
		const value = e.target.textContent;
		let item = _.cloneDeep(_.get(data, `children.${idx}`))
		_.set(item, `children.${0}.value`, value)
		let newData = _.cloneDeep(data) || [];
		newData.children[idx] = item;
		renderHtml(newData)
		setRightData(newData)
	}
	/**
	 * 通过直接遍历渲染树节点
	 * @returns {JSX.Element}
	 */
	const renderTree = ()=>{
		let level = 1;
		return (
			<div className="tree">
				{
					_.map(data?.children, (o, idx) => {
						if (!_.isNil(o?.depth)) level = o?.depth;
						return (
							<div className={`${o?.depth ? 'depth-' + o?.depth : ''} tree-item`}
							     style={{paddingLeft: o?.type === "paragraph" ? level * 30 + "px" : (o?.depth - 1) * 30 + "px"}}
							     key={idx}>
								<div className="tree-item-line"/>
								<div className="tree-item-point"/>
								<div className="tree-item-content" contentEditable={true} suppressContentEditableWarning={true}
								     onInput={(e) => handleEditMd(e, idx)}>{_.get(o, `children.0.value`)}</div>
								{
									_.get(o, `children.0.type`) === "image" && <img src={_.get(o, `children.0.url`)} alt=""/>
								}
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
	
	/**
	 * 输出新的markdown的 str
	 */
	const handleExport = () =>{
		let newStr = toMarkdown(rightData)
		alert(`输出markdown： \n${newStr}`)
	}
	
	return (
		<div className="md">
			<div className="md-left">
				<div className="btn" onClick={handleExport}>输出</div>
				{renderTree()}
				{/*{renderItem()}*/}
			</div>
			<div className="md-right">
				<div dangerouslySetInnerHTML={{ __html: html }} />
			</div>
		</div>
	)
}

export default Home
