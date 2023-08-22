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
import {useEffect, useState} from "react";
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
				list.push(o)
				flattenTree(o?.children)
			}
		})
		return list
	}
	/**
	 * 绘制全部幻灯片
	 */
	const renderAllSlide = () => {
		let pptxData = flattenTree(rightData)
		return (
			<>
				{
					_.map(pptxData, o=>{
						return (
							<SwiperSlide>
								<div className="common-slide">
									<h2>{o?.text}</h2>
									<div>
										{_.map(_.get(o, `children`), p=>{
											return <div key={o?.id}>{p?.text}</div>
										})}
									</div>
								</div>
							</SwiperSlide>
						)
					})
				}
			</>
		)
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
				{renderAllSlide()}
			</Swiper>
		</div>
	)
}

export default WebPptx;
