import mdStr from "@/mocks/markdown"
import "./index.scss"
import {useEffect, useRef, useState} from "react";
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from "mdast-util-to-markdown"
import {toHtml} from 'hast-util-to-html'
import {toHast} from 'mdast-util-to-hast'
import {toc} from 'mdast-util-toc'
import {toString} from 'mdast-util-to-string'
import _ from "lodash"
import { useClickAway } from 'ahooks';
import pptxgen from "pptxgenjs";

let pres;

/**
 * description： 首页
 * @author Kevin
 * @date 2023/8/10
 */
function Home() {
	const [data, setData] = useState([])
	const [rightData, setRightData] = useState([])
	const [html, setHtml] = useState(null)
	const ref = useRef(null)
	
	const [optionsIdx, setOptionsIdx] = useState(null)
	
	/**
	 * useEffect
	 */
	useEffect(() => {
		initData();
	}, [])
	useEffect(() => {
		initPptx();
	}, [])
	useEffect(()=>{
		initPres();
	},[])
	
	/**
	 * useClickAway 点击
	 */
	useClickAway(() => {
		setOptionsIdx(null)
	}, ref);
	
	// const
	
	/**
	 * 初始化数据
	 */
	const initData = () => {
		const tree = fromMarkdown(mdStr)
		renderHtml(tree)
		setData(tree)
		setRightData(tree)
		console.log(tree,'============================================')
	}
	/**
	 * 渲染 html 版 pptx
	 */
	const initPptx = () =>{}
	
	/**
	 * 实例化pres
	 */
	const initPres = () => {
		pres = new pptxgen();
		return pres
	}
	
	/**
	 * 输出pptx封面
	 */
	const renderCover = () => {
		let slide = pres.addSlide();
		slide.background ={ path: 'https://assets.mindshow.fun/themes/greenblue_countryside_vplus_20230720/Cover-bg.jpg'}
		slide.addText(_.get(data, 'children.0.children.0.value'), {x: 0, y: '40%', w: "100%", color: "#ffffff", fontSize: 64, align: "center"});
	}
	/**
	 * 渲染全部幻灯片
	 */
	const renderSlides = () => {
		let children = data?.children || [];
		let slidesData = _.filter(children, (o, i) => i !== 0)
		//第二层级的数据集
		let secondData = _.filter(children, (o, i) => o.depth === 2)
		//第三层级的数据集
		let thirdData = _.filter(children, (o, i) => o.depth === 3)
		let slide = null;
		for (let i = 0; i < children.length; i++) {
			let item = children[i];
			if (item?.depth === 2) {
				slide = pres.addSlide();
				slide.background = {path: 'https://assets.mindshow.fun/themes/greenblue_countryside_vplus_20230720/Cover-bg.jpg'}
			}
			console.log(item, 'itemitemitemitemitemitemitemitem', slide)
			slide && slide.addText(_.get(item, 'children.0.value'), {
				x: "10%",
				y: '10%',
				w: "80%",
				h: "80%",
				color: "#333",
				fontSize: 30,
				valign: "middle"
			});
			continue;
		}
		
	}
	/**
	 * 绘制单张幻灯片
	 */
	const renderSlide = item =>{
		let slide = pres.addSlide();
		slide.background ={ path: 'https://assets.mindshow.fun/themes/greenblue_countryside_vplus_20230720/Cover-bg.jpg'}
		
	}
	/**
	 * 导出pptx至本地
	 */
	const exportPptx = ()=>{
		renderCover()
		renderSlides()
		pres.writeFile({ fileName: "AIGC-PPTX.pptx" });
	}
	/**
	 * 根据左侧的编辑 - 渲染最新的html
	 */
	const renderHtml = mdast => {
		const hast = toHast(mdast)
		const lastHtml = toHtml(hast)
		setHtml(lastHtml)
	}
	/**
	 * 编辑左侧md树
	 */
	const handleEditMd = (e, idx) => {
		const value = e.target.textContent;
		let item = _.cloneDeep(_.get(data, `children.${idx}`))
		_.set(item, `children.${0}.value`, value)
		let newData = _.cloneDeep(data) || [];
		newData.children[idx] = item;
		renderHtml(newData)
		setRightData(newData)
	}
	/**
	 * 显示options
	 */
	const showOptions = idx =>{
		setOptionsIdx(idx)
	}
	/**
	 * 添加节点
	 */
	const addItem = (item, idx) => {
		let newItem = _.cloneDeep(item);
		_.set(newItem, `children.${0}.value`, "- ")
		let newData = _.cloneDeep(data)
		newData?.children?.splice(idx+1, 0,newItem)
		setData(newData)
		setOptionsIdx(null)
	}
	/**
	 * 添加子节点
	 */
	const addChildItem = (item, idx) => {
		let newItem = _.cloneDeep(item);
		_.set(newItem, `children.${0}.value`, "- ")
		_.set(newItem, `depth`, _.get(newItem, `depth`) + 1)
		let newData = _.cloneDeep(data)
		newData?.children?.splice(idx+1, 0,newItem)
		setData(newData)
		setOptionsIdx(null)
	}
	/**
	 * 删除节点
	 */
	const removeItem = (item, idx) => {
		let newData = _.cloneDeep(data)
		newData.children = _.filter(newData?.children, (o,i)=> i !== idx)
		setData(newData)
		setOptionsIdx(null)
	}
	/**
	 * 通过直接遍历渲染树节点
	 * @returns {JSX.Element}
	 */
	const renderTree = () => {
		let level = 1;
		return (
			<div className="tree" ref={ref}>
				{
					_.map(data?.children, (o, idx) => {
						if (!_.isNil(o?.depth)) level = o?.depth;
						return (
							<div className={` tree-item ${'tree-item-' + o?.depth}`}
							     style={{marginLeft: o?.type === "paragraph" ? level * 30 + "px" : (o?.depth - 1) * 30 + "px"}}
							     key={idx}>
								<div className="tree-item-box">
									<div className="tree-item-add">
										<span onClick={()=>showOptions(idx)}>+</span>
									</div>
									<div className={`tree-item-options ${idx === optionsIdx ? 'active' : ''}`}>
										<ul>
											<li onClick={() => addItem(o, idx)}>添加节点</li>
											<li onClick={() => addChildItem(o, idx)}>添加子节点</li>
											<li onClick={() => removeItem(o, idx)}>删除节点</li>
											<li>添加图片</li>
											<li>子节点添加图片</li>
										</ul>
									</div>
								</div>
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
	const renderItem = () => {
		return _.map(data?.map, (o, idx) => {
			return (
				<div className="tree-item" key={idx}>
					<div className="tree-item-point"/>
					<div className="tree-item-content">{_.get(o, `children.0.children.0.children.0.value`)}</div>
				</div>
			)
		})
	}
	
	/**
	 * 输出新的markdown的 str
	 */
	const handleExport = () => {
		let newStr = toMarkdown(rightData)
		alert(`输出markdown： \n${newStr}`)
	}
	
	return (
		<div className="md" >
			<div className="md-left">
				<div className="btn" onClick={handleExport}>输出markdown</div>
				<div className="btn two" onClick={exportPptx}>输出pptx</div>
				{renderTree()}
				{/*{renderItem()}*/}
			</div>
			<div className="md-right">
				<div dangerouslySetInnerHTML={{__html: html}}/>
			</div>
		</div>
	)
}

export default Home
