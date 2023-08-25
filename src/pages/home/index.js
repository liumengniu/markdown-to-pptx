import mdStr from "@/mocks/markdown"
import "./index.scss"
import {useEffect, useRef, useState} from "react";
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from "mdast-util-to-markdown"
import {toHtml} from 'hast-util-to-html'
import {toHast} from 'mdast-util-to-hast'
import _ from "lodash"
import {useClickAway} from 'ahooks';
import pptxgen from "pptxgenjs";
import utils from "../../utils";
import WebPptx from "@comp/web-pptx";
import EditorTree from "@comp/editor-tree";

//-------------静态资源-------------------------
import cover_bg from "./../../statics/images/cover_bg.png"
import logo from "./../../statics/images/logo.png"
import title_bg from "./../../statics/images/title_bg.png"
import slide_bg from "./../../statics/images/slide_bg.png"

const short = require('short-uuid');
let pres;

/**
 * description： 首页
 * @author Kevin
 * @date 2023/8/10
 */
function Home() {
	const tree = utils.parseMarkdownToTree(mdStr) || []
	const [leftData, setLeftData] = useState(tree)
	const [rightData, setRightData] = useState(tree)
	const [html, setHtml] = useState(null)
	const ref = useRef(null)
	
	/**
	 * 初始化数据
	 */
	useEffect(()=>{
		getAIGCData()
	},[])
	
	/**
	 * 通过AIGC获取markdown数据
	 */
	const getAIGCData = () => {
		let params = {
			profession: "程序员",
			topic: "开源项目管理",
			model_name: "gpt-3.5-turbo",
			language: "chinese"
		}
		/**
		 * todo 简单测试，后期删除
		 */
		fetch(process.env.REACT_APP_BASE_API, {
			method: 'POST', headers: {
				'Content-Type': 'application/json'
			}, body: JSON.stringify(params)
		}).then(res => {
			console.log(res, '=---------------------=======================')
			return res.json()
		}).then(res => {
			console.log(res, 'resresresresresresresresresresresres')
		}).catch(e => {
			console.log("请求服务异常")
		})
	}
	/**
	 * 初始化 pptxgen
	 */
	useEffect(() => {
		initPres();
	}, [])

	/**
	 * useClickAway 点击
	 */
	useClickAway(() => {
		hideOptions()
	}, ref);
	
	/**
	 * 实例化pres
	 */
	const initPres = () => {
		pres = new pptxgen();
		return pres
	}
	
	/**
	 * 定义母版
	 */
	
	const defineSlideMaster = () =>{
		pres.defineSlideMaster({
			title: "MASTER_COVER",
			background: { color: "FFFFFF" },
			objects: [
				{ image: { x: 0, y: 0, w: 10, h: 5.625, path: cover_bg } },
				{ image: { x: 9.0, y: 0.3,w: 0.65, h: 0.55, path: logo } },
				{ image: { x: 0.6, y: 0.6,w: 0.65, h: 0.55, path: title_bg } },
			],
			slideNumber: { x: 0.3, y: "90%" },
		});
		pres.defineSlideMaster({
			title: "MASTER_SLIDE",
			background: { color: "FFFFFF" },
			objects: [
				{ image: { x: 0, y: 0, w: 10, h: 5.625, path: slide_bg } },
				{ image: { x: 9.0, y: 0.3,w: 0.65, h: 0.55, path: logo } },
				{ image: { x: 0.6, y: 0.6,w: 0.65, h: 0.55, path: title_bg } },
			],
			slideNumber: { x: 0.3, y: "90%" },
		});
	}

	/**
	 * 生成全部幻灯片
	 */
	const renderAllSlide = () => {
		defineSlideMaster()
		!_.isEmpty(rightData) && renderSlide(rightData)
		
		// let slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
		// slide.addText("How To Create PowerPoint Presentations with JavaScript", { x: 0.5, y: 0.7, fontSize: 18 });
	}
	/**
	 * 递归绘制幻灯片
	 * 1、封面和目录要单独绘制
	 * 2、递归渲染到倒数第二级，最后一级和父标题组成一张幻灯片
	 * 3、gpt生成的每小节字数是不确定的，按照 0-80字符/80以上字符 字体大小分为2档，防止字体太多出幻灯片边界，字体太少显得空泛
	 * 4、图片暂时放在左侧50%或者右侧50%，gpt生成内容不确定，很难做成极其通用的，后期按风格或分类做几套模板或者布局（纯体力活）
	 */
	const renderSlide = tree => {
		_.map(tree, o => {
			if (o.level && o.type==="section" && o.level === 1) {  //渲染封面和目录
				renderCover(o)
				renderDirectory(o.children)
			} else {  //渲染除封面/目录外的幻灯片（PS：只渲染至倒数第二级）
				(!_.isEmpty(o.children) && o.type !== "list")  && renderChildSlide(o)
			}
			if(!_.isEmpty(o.children) && o.type !== "list"){
				return renderSlide(o.children)
			}
		})
	}
	/**
	 * 绘制pptx封面
	 */
	const renderCover = item => {
		let slide = pres.addSlide({ masterName: "MASTER_COVER" });
		slide.addText(_.get(item, 'text'), {x: 0, y: '40%', w: "100%", color: "#666", fontSize: 64, align: "center"});
	}
	/**
	 * 绘制目录界面
	 */
	const renderDirectory = directoryData => {
		let slide = pres.addSlide({ masterName: "MASTER_COVER" });
		slide && slide.addText("目录", {
			x: "9%", y: '10%', w: "80%", h: "80%", color: "#666", fontSize: 30, valign: "top"
		});
		slide.addText(_.map(directoryData || [], o => ({text: o.text, options: {breakLine: true}})),
			{x: "10%", y: "24%", w: 8.5, h: 2.0, margin: 0.1}
		);
	}
	/**
	 * 绘制底层幻灯
	 * @param item
	 */
	const renderChildSlide = item => {
		let slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
		slide && slide.addText(_.get(item, 'text'), {
			x: "9%", y: '10%', w: "80%", h: "80%", color: "#666", fontSize: 30, valign: "top"
		});
		let itemChild = item?.children || []
		if (!_.isEmpty(itemChild)) {
			let textCount = 0;
			let idx = _.findIndex(itemChild, o => o.type === "list");
			let children = []
			if(_.isNumber(idx)){
				children = flattenDepthOne(itemChild);
			}
			let textList = _.map(_.filter(children, o => o.text), o => {
				textCount += _.size(o.text);
				return ({text: o.text, options: {breakLine: true, bullet: o.type === "listItem"}})
			}) || [];
			let imgUrl = _.get(_.find(children, o => o.type === 'image'), 'src');
			slide && slide.addText(textList, {
				x: "10%",
				y: "24%",
				w: imgUrl ? 4.8 : 8.5,
				h: textCount > 160 ? 3.0 : textCount > 120 ? 2.5 : 2.0,
				margin: 0.1,
				fontSize: textCount > 160 ? 10 : textCount > 80 ? 14 : 20,
				paraSpaceBefore: 2,
				paraSpaceAfter: 4,
			});
			imgUrl && slide.addImage({path: imgUrl, x: "60%", w: "40%", h: "100%", type: "cover"})
		}
	}
	/***
	 * 展平数组
	 */
	const flattenDepthOne = list => {
		let newList = [];
		_.map(list, o => {
			if (o.type === "list" && !_.isEmpty(o?.children)) {
				newList = _.concat([], newList, o?.children)
			}
			newList.push(o);
		})
		return newList
	}
	/**
	 * 导出pptx至本地
	 */
	const exportPptx = () => {
		renderAllSlide()
		pres.writeFile({fileName: "AIGC-PPTX.pptx"});
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
	 * 编辑左侧目录树
	 */
	const handleEditMd = (e, idx, id) => {
		const value = e.target.textContent;
		if (value === "") {
			removeItem(e, idx)
			return
		}
		let oldData = _.cloneDeep(rightData)
		let newData = setTreeData(oldData, value, id,"edit")
		setRightData(newData)
	}
	/**
	 * 编辑左侧目录树
	 * @param treeData
	 * @param value
	 * @param id
	 * @param type
	 * @returns {unknown[]}
	 */
	const setTreeData = (treeData, value, id, type) => {
		return _.map(treeData, o=>{
			if(o.showOptions){
				o.showOptions = false
			}
			if(o.id === id){
				if (type === "edit") { //编辑
					o.text = value
				} else if (type === "show") {  //显示操作模块
					o.showOptions = !o.showOptions
				}
			}
			o.children = setTreeData(o?.children, value, id, type)
			return o;
		})
	}
	/**
	 * 操作目录树节点
	 * @param treeData
	 * @param item
	 * @param idx
	 * @param type
	 * @returns {*}
	 */
	const operateTreeData = (treeData, item, idx, type) =>{
		let isMatch = false
		_.map(treeData, o=>{
			if(!o){
				return
			}
			if(o?.id === item?.id){
				isMatch = true;
				if(type === "add"){
					treeData?.splice(idx + 1, 0, _.cloneDeep({...item, text: " ", children: [],showOptions: false, id: short.generate()}));
					setTreeData(treeData, item?.text, item?.id, "show")
				} else if(type === "addChild"){
					if (_.isEmpty(o.children)) o.children = []
					let neeItem = o.children[o.children?.length -1]
					o.children.push({...neeItem, text: " ", children: [], id: short.generate()})
					setTreeData(treeData, item?.text, item?.id, "show")
				} else if(type === "remove"){
					setTreeData(treeData, item?.text, item?.id, "show")
					treeData?.splice(idx, 1);
				}
			} else {
				o.children = !_.isEmpty(o?.children) ? operateTreeData(o?.children, item, idx, type) : []
				return o;
			}
		})
		return treeData
	}
	/**
	 * 显示options
	 * @param id
	 */
	const showOptions = id => {
		let oldData = _.cloneDeep(rightData)
		let newData = setTreeData(oldData, null, id, "show")
		setLeftData(newData)
		setRightData(newData)
	}
	/**
	 * 隐藏全部options
	 * @param id
	 */
	const hideOptions = () => {
		let oldData = _.cloneDeep(rightData)
		let newData = hideTreeOptions(oldData)
		setLeftData(newData)
		setRightData(newData)
	}
	/**
	 * 递归隐藏全部options
	 * @param treeData
	 */
	const hideTreeOptions = treeData => {
		return  _.map(treeData, o => {
			if(o.showOptions){
				o.showOptions = false
			}
			o.children = hideTreeOptions(o.children)
			return o;
		})
	}
	/**
	 * 添加节点
	 * @param item
	 * @param idx
	 */
	const addItem = (item, idx) => {
		operateTree(item, idx, "add")
	}
	/**
	 * 添加子节点
	 * @param item
	 * @param idx
	 */
	const addChildItem = (item, idx) => {
		operateTree(item, idx, "addChild")
	}
	/**
	 * 删除节点
	 * @param item
	 * @param idx
	 */
	const removeItem = (item, idx) => {
		operateTree(item, idx, "remove")
	}
	/**
	 * 操作树节点（新增节点/新增子节点/删除节点）
	 * @param item
	 * @param idx
	 * @param type
	 */
	const operateTree = (item, idx, type) =>{
		let oldData = _.cloneDeep(rightData)
		let newData = operateTreeData(oldData, item, idx, type)
		setLeftData(newData)
		setRightData(newData)
	}
	
	
	return (
		<div className="md">

			<div className="md-left" ref={ref}>
				<div className="btn two" onClick={exportPptx}>输出pptx</div>
				<EditorTree leftData={leftData} showOptions={showOptions} addItem={addItem} addChildItem={addChildItem}
				            removeItem={removeItem} handleEditMd={handleEditMd}/>
			</div>
			<div className="md-right">
				<WebPptx rightData={rightData}/>
			</div>
		</div>
	)
}

export default Home
