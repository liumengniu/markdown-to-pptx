/**
 * description： 在线渲染pptx组件
 * @author Kevin
 * @date 2023/8/17
 */
import "./index.scss"
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from "swiper";
// Import Swiper styles
import "swiper/css/navigation";
// Import Swiper styles
import 'swiper/css';
import {useEffect} from "react";
import utils from "@utils";
import _ from "lodash";

let html = null;
let list = [];

function WebPptx(props) {
	const {rightData} = props
	

	useEffect(() => {
		renderAllSlide()
	}, [])
	
	/**
	 * 展平树结构 -> pptx所需数组
	 * @param data
	 */
	const flattenTree = data =>{
		_.map(data, o=>{
			if(o.type==="section"){
				flattenTree(o?.children)
			} else {
				list.push(o)
			}
		})
		// console.log(list, 'listlistlistlistlistlistlistlistlistlistlistlist')
		return list
	}
	/**
	 * 绘制全部幻灯片
	 */
	const renderAllSlide = () => {
		let pptxData = flattenTree(rightData)
		console.log(rightData, '===========================rightData========================', pptxData)
		html = renderCoverAndDirectory(_.get(rightData, `0`));
		if(!_.isEmpty(rightData)){
			return renderSlide(rightData, html)
		} else {
			return null
		}
	}
	/**
	 * 渲染幻灯片的html
	 * @param tree
	 * @param oldHtml
	 * @returns {null}
	 */
	const renderSlide2 = (tree, oldHtml) => {
		// let html = null;
		// let newHtml = null;
		_.map(tree, o => {
			if (o.level && o.type === "section" && o.level === 1) {  //渲染封面和目录
				html = renderCoverAndDirectory(o)
			} else {  //渲染除封面/目录外的幻灯片（PS：只渲染至倒数第二级）
				// html = (!_.isEmpty(o.children) && o.type !== "list") ? renderChildSlide(o, oldHtml) : null
				// html = (!_.isEmpty(o.children) && o.type !== "list") ? renderChildSlide(o, oldHtml) : null
				// html = !_.isEmpty(o.children) ? renderChildSlide(o, oldHtml) : null
				html = renderChildSlide(o, oldHtml)
			}
			if (!_.isEmpty(o.children) && o.type !== "list") {
				// renderSlide(o.children, html)
				html = renderSlide(o.children, html)
			}
			return o;
		})
		console.log(html, 'htmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtml')
		return html;
	}
	
	const renderSlide = (tree, oldHtml) => {
		_.map(tree, o=>{
			if(!_.isEmpty(o?.children)){
				html += renderSlide(o?.children, oldHtml)
			} else {
				// html += renderChildSlide(o, oldHtml)
			}
			return o;
		})
		return html
	}
	/**
	 * 渲染封面&目录
	 * @param item
	 * @param oldHtml
	 * @returns {JSX.Element}
	 */
	const renderCoverAndDirectory = (item) => {
		return (
			<>
				<SwiperSlide>
					<div className="cover-slide" style={{textAlign: "center", color: "#ffffff", fontSize: 24, fontWeight: 'bold'}}>
						{_.get(item, `text`)}
					</div>
				</SwiperSlide>
				<SwiperSlide>
					<div className="directory-slide">
						<h2>目录</h2>
						<div>
							{_.map(_.get(item, `children`), o=>{
								return <span key={o?.id}>{o?.text}</span>
							})}
						</div>
					</div>
				</SwiperSlide>
			</>
		)
	}
	/**
	 * 渲染子级幻灯片
	 */
	const renderChildSlide = (item, oldHtml) => {
		console.log("执行了多少次renderChildSlide==")
		return (
			<>
				{oldHtml}
				<SwiperSlide>
					<div className="common-slide">
						<h2>{item?.text}</h2>
						<div>
							{_.map(_.get(item, `children`), o=>{
								return <div key={o?.id}>{o?.text}</div>
							})}
						</div>
					</div>
				</SwiperSlide>
			</>
		)
	}

	// console.log(html, 'htmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtml')

	return (
		<div className="web-pptx">
			<Swiper
				className="swiper"
				navigation={true}
				pagination={{
					type: 'fraction',
				}}
				modules={[Navigation, Pagination]}
				onSlideChange={() => console.log('slide change')}
				onSwiper={(swiper) => console.log(swiper)}
			>
				{/*<SwiperSlide>*/}
				{/*	<div className="cover-slide" style={{textAlign: "center", color: "#ffffff", fontSize: 24, fontWeight: 'bold'}}>*/}
				{/*		{"eeee"}*/}
				{/*	</div>*/}
				{/*</SwiperSlide>*/}
				{/*{renderCoverAndDirectory()}*/}
				{/*{renderCover()}*/}
				{/*{renderSlides()}*/}
				
				{/*{renderSlide(rightData)}*/}
				
				{html}
			</Swiper>
		</div>
	)
}

export default WebPptx;
