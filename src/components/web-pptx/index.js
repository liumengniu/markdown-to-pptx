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
	
	useEffect(() => {
	
	}, [])
	
	return (
		<div className="web-pptx">
			<Swiper
				className="mySwiper"
				// spaceBetween={50}
				// slidesPerView={3}
				navigation={true}
				pagination={{
					type: 'fraction',
				}}
				modules={[Navigation,Pagination]}
				onSlideChange={() => console.log('slide change')}
				onSwiper={(swiper) => console.log(swiper)}
			>
				<SwiperSlide>Slide 1</SwiperSlide>
				<SwiperSlide>Slide 2</SwiperSlide>
				<SwiperSlide>Slide 3</SwiperSlide>
				<SwiperSlide>Slide 4</SwiperSlide>
			</Swiper>
		</div>
	)
}

export default WebPptx;
