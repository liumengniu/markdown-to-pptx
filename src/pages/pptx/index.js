/**
 * description： pptx
 * @author Kevin
 * @date 2023/8/15
 */
import {useEffect} from "react";
import pptxgen from "pptxgenjs";

function Pptx(){
	
	useEffect(()=>{
		renderPPTX();
	},[])
	
	/**
	 * 生成pptx
	 */
	const renderPPTX = () =>{
		// 1. 实例化Presentation
		let pres = new pptxgen();

		// 2. 添加一张幻灯片
		let slide = pres.addSlide();
		
		let textboxText = "Hello World from PptxGenJS!";
		let textboxOpts = { x: 1, y: 1, color: "363636" };
		slide.addText(textboxText, textboxOpts);
		
		// pres.writeFile({ fileName: "AIGC-PPTX.pptx" });
	}
	
	return <div className="pptx" />
}

export default Pptx;
