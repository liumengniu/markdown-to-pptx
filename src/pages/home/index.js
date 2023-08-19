import mdStr from "@/mocks/markdown"
import "./index.scss"
import {useEffect, useRef, useState} from "react";
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from "mdast-util-to-markdown"
import {toHtml} from 'hast-util-to-html'
import {toHast} from 'mdast-util-to-hast'
import _ from "lodash"
import { useClickAway } from 'ahooks';
import pptxgen from "pptxgenjs";
import utils from "../../utils";
import WebPptx from "@comp/web-pptx";

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
		const treeData = utils.parseMarkdownToTree(mdStr)
		// console.log(tree,'============================================', treeData)
	}
	/**
	 * 渲染 html 版 web-pptx
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
	 * 生成全部幻灯片
	 */
	const renderAllSlide = () =>{
		const newMdStr = toMarkdown(rightData);
		const tree = utils.parseMarkdownToTree(mdStr);
		console.log(tree, '=====================treetreetreetreetree=====================', rightData)
		!_.isEmpty(tree) && renderSlide(tree)
	}
	/**
	 * 递归绘制幻灯片
	 * 1、封面和目录要单独绘制
	 * 2、递归渲染到倒数第二级，最后一级和父标题组成一张幻灯片
	 * 3、gpt生成的每小节字数是不确定的，按照 0-80字符/80以上字符 字体大小分为2档，防止字体太多出幻灯片边界，字体太少显得空泛
	 * 4、图片暂时放在左侧50%或者右侧50%，gpt生成内容不确定，很难做成极其通用的，后期按风格或分类做几套模板或者布局（纯体力活）
	 */
	const renderSlide = tree => {
		_.map(tree, o=>{
			if(o.level && o.level === 1){  //渲染封面和目录
				renderCover()
				renderDirectory(o.children)
			} else {  //渲染除封面/目录外的幻灯片（PS：只渲染至倒数第二级）
				!_.isEmpty(o.children) && renderChildSlide(o)
			}
			return renderSlide(o.children)
		})
	}
	/**
	 * 绘制pptx封面
	 */
	const renderCover = () => {
		let slide = pres.addSlide();
		slide.background ={ path: 'https://assets.mindshow.fun/themes/greenblue_countryside_vplus_20230720/Cover-bg.jpg'}
		slide.addText(_.get(data, 'children.0.children.0.value'), {x: 0, y: '40%', w: "100%", color: "#666", fontSize: 64, align: "center"});
	}
	/**
	 * 绘制目录界面
	 */
	const renderDirectory = directoryData =>{
		let slide = pres.addSlide();
		slide.background = {path: 'https://assets.mindshow.fun/themes/greenblue_countryside_vplus_20230720/Cover-bg.jpg'}
		slide && slide.addText("目录", {
			x: "10%", y: '10%', w: "80%", h: "80%", color: "#666", fontSize: 30, valign: "top"
		});
		slide.addText(_.map(directoryData || [], o => ({text :o.text, options: { breakLine: true }})),
			{ x: "10%", y: "24%", w: 8.5, h: 2.0, margin: 0.1 }
		);
	}
	/**
	 * 绘制底层幻灯
	 * @param item
	 */
	const renderChildSlide = item => {
		let slide = pres.addSlide();
		slide.background = {path: 'https://assets.mindshow.fun/themes/greenblue_countryside_vplus_20230720/Cover-bg.jpg'}
		slide && slide.addText(_.get(item, 'text'), {
			x: "10%", y: '10%', w: "80%", h: "80%", color: "#666", fontSize: 30, valign: "top"
		});
		let children = item?.children || []
		if(!_.isEmpty(children)){
			let textCount = 0;
			let textList = _.map(_.filter(children, o=> o.text), o => {
				textCount += _.size(o.text);
				return 	({text :o.text, options: { breakLine: true }})
			}) || [];
			let imgUrl = _.get(_.find(children, o=> o.type === 'image'), 'src');
			slide && slide.addText(textList, {
				x: "10%",
				y: "24%",
				w: imgUrl ? 3.8 : 8.5,
				h: 2.0,
				margin: 0.1,
				fontSize: textCount > 160 ? 10 : textCount > 80 ? 14 : 20
			});
			imgUrl && slide.addImage({path: imgUrl, x: "50%", w: "50%", h: "100%", type: "cover"})
		}
	}
	/**
	 * 导出pptx至本地
	 */
	const exportPptx = ()=>{
		console.log("绘制封面")
		// renderCover()
		console.log("绘制全部slides")
		// renderSlides()
		renderAllSlide()
		pres.writeFile({ fileName: "AIGC-PPTX.pptx" });
		console.log("执行导出pptx")
		// pres.write("base64")
		// 	.then((data) => {
		// 		console.log("write as base64: Here are 0-100 chars of `data`:\n");
		// 		console.log(data.substring(0, 100));
		// 		console.log(data)
		// 	})
		// 	.catch((err) => {
		// 		console.error(err);
		// 	});
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
		if(value === ""){
			removeItem(e, idx)
			return
		}
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
	 * 渲染左侧目录树
	 * contentEditable={true}会有光标闪现最前端的BUG，所以可编辑的div做成非受控组件（PS：递归渲染的div似乎很难解决此问题）
	 * input有换行bug，textarea有高度bug
	 * 经过取舍最后还是采用 contentEditable={true}
	 */
	const renderTree = tree => {
		if (_.isEmpty(tree)){
			return
		}
		let level = 1
		return _.map(tree, (o, idx)=>{
			level++;
			return <div className={`tree-box tree-item-${idx} level-${o.level}`} key={`${idx}-${o.level}`} style={{marginLeft: o.level * 10 + "px"}}>
				<div className="tree-item">
					{
						(o.type === "image" || o?.text) && <div className="tree-item-point"/>
					}
					<div className="tree-item-content">
						{
							o.type === "image" && <img className="tree-item-img" src={o.src} alt=""/>
						}
						{
							o?.text && <div>{o?.text}</div>
						}
					</div>
				</div>
				{
					renderTree(o.children)
				}
			</div>
		})
	}

	/**
	 * 通过直接遍历渲染树节点
	 * @returns {JSX.Element}
	 */
	const renderTree2 = () => {
		let level = 1;
		return (
			<div className="tree" ref={ref}>
				{
					_.map(data?.children, (o, idx) => {
						if (!_.isNil(o?.depth)) level = o?.depth;
						let type = _.get(o, `children.0.type`);
						return (type === "text" || type === "image") && (
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
								{
									type === "text" &&
									<div className="tree-item-content" contentEditable={true} suppressContentEditableWarning={true}
									     onInput={(e) => handleEditMd(e, idx)}>{_.get(o, `children.0.value`)}</div>
								}
								{
									type === "image" && <img className="tree-item-img" src={_.get(o, `children.0.url`)} alt=""/>
								}
							</div>
						)
					})
				}
			</div>
		)
	}
	/**
	 * 输出新的markdown的 str
	 */
	const handleExport = () => {
		let newStr = toMarkdown(_.cloneDeep(rightData))
		alert(`输出markdown： \n${newStr}`)
	}

	/**
	 * 最终的markdown的str
	 * @type {null|string}
	 */
	const markdownStr = _.isEmpty(rightData) ? null : toMarkdown(_.cloneDeep(rightData));
	const tree = utils.parseMarkdownToTree(mdStr) || []
	console.log(tree, 'treetreetreetreetreetreetreetreetreetreetree')

	return (
		<div className="md" >

			<div className="md-left">
				<div className="btn" onClick={handleExport}>输出新markdown</div>
				<div className="btn two" onClick={exportPptx}>输出pptx</div>
				{renderTree(tree)}
			</div>
			<div className="md-middle">
				<pre>
					{markdownStr}
				</pre>
			</div>
			<div className="md-right">
				<WebPptx markdownStr={markdownStr}/>
			</div>
		</div>
	)
}

export default Home
