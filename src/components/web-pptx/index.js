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
		renderAllSlide()
	}, [])
	
	/**
	 * 绘制全部幻灯片
	 */
	const renderAllSlide = () => {
		!_.isEmpty(rightData) && renderSlide(rightData)
	}
	/**
	 * 渲染幻灯片的html
	 */
	const renderSlide = tree => {
		_.map(tree, o => {
			if (o.level && o.type === "section" && o.level === 1) {  //渲染封面和目录
				renderCover(o)
				renderDirectory(o.children)
			} else {  //渲染除封面/目录外的幻灯片（PS：只渲染至倒数第二级）
				(!_.isEmpty(o.children) && o.type !== "list") && renderChildSlide(o)
			}
			if (!_.isEmpty(o.children) && o.type !== "list") {
				return renderSlide(o.children)
			}
		})
	}
	/**
	 * 渲染封面
	 * @param item
	 * @returns {JSX.Element}
	 */
	const renderCover = item => {
		return (
			<SwiperSlide>
				<div className="cover-slide" style={{textAlign: "center", color: "#ffffff", fontSize: 24, fontWeight: 'bold'}}>
					{_.get(item, `text`)}
				</div>
			</SwiperSlide>
		)
	}
	/**
	 * 渲染目录
	 * @param item
	 */
	const renderDirectory = item => {
	
	}
	/**
	 * 渲染子级幻灯片
	 */
	const renderChildSlide = () => {
	
	}
	/**
	 * 渲染全部slide
	 */
	const renderSlides = () => {
		const slidesTree = _.get(mdTree, '0.children');
		return (
			<div className="other-slides">
				{
					_.map(slidesTree, (o, idx) => {
						return (
							<SwiperSlide key={idx}>
								<div className={"slide-title"}>{o?.text}</div>
								{
									_.map(o?.children, (p,childIdx)=> {
										return (
											<div key={`${idx}-${childIdx}`} className={"slide-list-title"}>{p?.text}</div>
										)
								})
								}
							</SwiperSlide>
						)
					})
				}
			</div>
		)
	}
	
	/**
	 * 渲染slider， API尽量和 pptxgenjs 贴近，保持渲染版和导出版差异最小
	 */
	const renderSlider = () => {
	
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
				{/*{renderCover()}*/}
				{/*{renderSlides()}*/}
			</Swiper>
		</div>
	)
}

export default WebPptx;
