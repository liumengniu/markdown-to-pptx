/**
 * description： 在线渲染pptx组件
 * @author Kevin
 * @date 2023/8/17
 */
import "./index.scss"
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css/navigation";
// Import Swiper styles
import 'swiper/css';
import {useEffect} from "react";
import utils from "@utils";

function WebPptx(props) {
	const {markdownStr} = props
	const mdTree = markdownStr ? utils.parseMarkdownToTree(markdownStr) : []
	console.log(mdTree, '===========================mdTree========================')
	
	useEffect(() => {
	
	}, [])
	
	const renderCover = () =>{
		return (<div style={{color:"#ffffff", fontSize: 24, fontWeight: 'bold'}}>
			{_.get(mdTree, `0.text`)}
		</div>)
	}
	
	/**
	 * 渲染slider， API尽量和 pptxgenjs 贴近，保持渲染版和导出版差异最小
	 */
	const renderSlider = () =>{
	
	}
	
	return (
		<div className="web-pptx">
			<Swiper
				className="mySwiper"
				navigation={true}
				pagination={{
					type: 'fraction',
				}}
				modules={[Navigation,Pagination]}
				onSlideChange={() => console.log('slide change')}
				onSwiper={(swiper) => console.log(swiper)}
			>
				<SwiperSlide>
					{renderCover()}
				</SwiperSlide>
				<SwiperSlide>Slide 2</SwiperSlide>
				<SwiperSlide>Slide 3</SwiperSlide>
				<SwiperSlide>Slide 4</SwiperSlide>
			</Swiper>
		</div>
	)
}

export default WebPptx;
