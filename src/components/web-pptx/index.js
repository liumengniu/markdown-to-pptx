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

function WebPptx(props) {
	const {rightData} = props
	console.log(rightData, '===========================rightData========================')

	useEffect(() => {
		// renderAllSlide()
	}, [])

	/**
	 * 绘制全部幻灯片
	 */
	const renderAllSlide = () => {
		if(!_.isEmpty(rightData)){
			return renderSlide(rightData)
		} else {
			return null
		}
	}
	/**
	 * 渲染幻灯片的html
	 */
	const renderSlide = tree => {
		let html = null;
		_.map(tree, o => {
			if (o.level && o.type === "section" && o.level === 1) {  //渲染封面和目录
				html = renderCoverAndDirectory(o)
			} else {  //渲染除封面/目录外的幻灯片（PS：只渲染至倒数第二级）
				html += (!_.isEmpty(o.children) && o.type !== "list") ? renderChildSlide(o) : null
			}
			if (!_.isEmpty(o.children) && o.type !== "list") {
				// html += renderSlide(o.children)
			}
		})
		console.log(html, 'htmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtmlhtml')
		return html;
	}
	/**
	 * 渲染封面&目录
	 * @param item
	 * @returns {JSX.Element}
	 */
	const renderCoverAndDirectory = item => {
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
	const renderChildSlide = () => {
		let html = null;
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
				{/*<SwiperSlide>*/}
				{/*	<div className="cover-slide" style={{textAlign: "center", color: "#ffffff", fontSize: 24, fontWeight: 'bold'}}>*/}
				{/*		{"eeee"}*/}
				{/*	</div>*/}
				{/*</SwiperSlide>*/}
				{/*{renderCoverAndDirectory()}*/}
				{/*{renderCover()}*/}
				{/*{renderSlides()}*/}
				{renderAllSlide()}
			</Swiper>
		</div>
	)
}

export default WebPptx;
