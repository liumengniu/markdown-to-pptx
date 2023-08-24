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
import {useEffect, useRef, useState} from "react";
import utils from "@utils";
import _ from "lodash";

function WebPptx(props) {
	let list = [];
	const {rightData} = props
	const [activeIndex, setActiveIndex] = useState(1)
	const ref = useRef();
	
	/**
	 * 展平树结构 -> pptx所需数组
	 * @param data
	 */
	const flattenTree = data =>{
		_.map(data, o=>{
			if(o.type==="section"){
				list.push(o)
				flattenTree(o?.children)
			}
		})
		return list
	}
	const [pptxData, setData] = useState(flattenTree(rightData))
	console.log(pptxData,'pptxDatapptxDatapptxDatapptxDatapptxData')
	
	/**
	 * 获取单页幻灯片字数统计
	 */
	const getCount = tree => {
		let count = 0;
		_.map(tree, o => {
			count += _.size(o?.text);
			o?.type === "list" && _.map(o.children, p => {
				count += _.size(p?.text);
			})
		})
		return count
	}
	/**
	 * 绘制全部幻灯片
	 */
	const renderAllSlide = () => {
		return (
			<>
				<SwiperSlide>
					<div className="cover-slide" style={{textAlign: "center", fontSize: 24, fontWeight: 'bold'}}>
						{_.get(pptxData, `0.text`)}
					</div>
				</SwiperSlide>
				{
					_.map(pptxData, o => {
						return (
							<div key={o?.id}>
								<SwiperSlide  key={o?.id}>
									<div className="common-slide">
										<div className="common">
											<h2>{o?.level === 1 && o.type !== "list" ? "目录" : o?.text}</h2>
											<div>
												{_.map(_.get(o, `children`), p => {
													let hasImg = _.findIndex(_.get(o, `children`), a=> a.type === "image") > -1;
													let textCount = getCount(o?.children);
													return (
														<div key={p?.id}>
															{
																p?.text && <div className="common-content"
																  style={{fontSize: textCount > 160 ? "8px" : textCount > 120 ? "10px" : "16px",
																	  width: hasImg ? "60%" : "100%"}}>
																	{p?.text}
																</div>
															}
															{
																p?.type === "list" &&
																<ul className="common-list">
																	{
																		_.map(p?.children, q => {
																			return <li key={q?.id}>{q?.text}</li>
																		})
																	}
																</ul>
															}
															{
																p?.type === "image" && <img className="common-img" src={p?.src} alt=""/>
															}
														</div>
													)
												})}
											</div>
										</div>
									</div>
								</SwiperSlide>
							</div>
						)
					})
				}
			</>
		)
	}
	/**
	 * 上一张
	 */
	const handleNavigatePrev = () => {
		let swiperDom = ref.current.swiper;
		swiperDom && swiperDom.slidePrev();
	}
	/**
	 * 下一张
	 */
	const handleNavigateNext = () => {
		if(activeIndex >= _.size(pptxData)){
			return
		}
		let swiperDom = ref.current.swiper;
		swiperDom && swiperDom.slideNext();
	}

	return (
		<div className="web-pptx">
			<Swiper
				ref={ref}
				className="swiper"
				pagination={{
					type: 'fraction',
				}}
				loop={false}
				modules={[Navigation, Pagination]}
				onSlideChange={(e) => setActiveIndex(e.activeIndex)}
			>
				{renderAllSlide()}
				<div className="slide-navigator">
					<div className="slide-navigator-left navigator-arrow" onClick={handleNavigatePrev}>{"←"}</div>
					<div className="slide-navigator-pagination">
						{`${activeIndex}/${_.size(pptxData)}`}
					</div>
					<div className="slide-navigator-right navigator-arrow" onClick={handleNavigateNext}>{"→"}</div>
				</div>
			</Swiper>
		</div>
	)
}

export default WebPptx;
