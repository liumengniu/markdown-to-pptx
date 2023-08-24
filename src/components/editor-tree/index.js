import _ from "lodash";

/**
 * description： markdown可编辑目录树
 * @author Kevin
 * @date 2023/8/24
 */

function EditorTree(props) {
	const {leftData, showOptions, addItem, addChildItem, removeItem, handleEditMd} = props;
	
	/**
	 * 渲染左侧目录树
	 * contentEditable={true}会有光标闪现最前端的BUG，所以可编辑的div做成非受控组件（PS：递归渲染的div似乎很难解决此问题）
	 * input有换行bug，textarea有高度bug
	 * 经过取舍最后还是采用 contentEditable={true}
	 */
	const renderTree = tree => {
		if (_.isEmpty(tree)) {
			return
		}
		let level = 0;
		return _.map(tree, (o, idx) => {
			if (!_.isNil(o.level)) level = o.level;
			return <div className={`tree-box tree-item-${idx} level-${o.level}`} key={`${idx}-${o.level}`}
			            style={{marginLeft: "30px"}}>
				{
					!_.isNil(o.level) && o.type !== "list" && <div className="tree-item-line"/>
				}
				<div className="tree-item" style={{marginLeft: _.isNil(o.level) ? "10px" : ''}}>
					{
						((o.type === "image" || o.type === "paragraph" || o.type === "listItem") || o?.text) &&
						<div className="tree-item-position">
							<div className="tree-item-point"/>
							<div className="tree-item-box">
								<div className="tree-item-add">
									<span onClick={() => showOptions(o.id)}>+</span>
								</div>
								<div className={`tree-item-options ${o.showOptions ? 'active' : ''}`}>
									<ul>
										<li onClick={() => addItem(o, idx)}>添加节点</li>
										{
											_.isNumber(o.level) && <li onClick={() => addChildItem(o, idx)}>添加子节点</li>
										}
										<li onClick={() => removeItem(o, idx)}>删除节点</li>
										<li>添加图片</li>
										<li>子节点添加图片</li>
									</ul>
								</div>
							</div>
						</div>
						
					}
					<div className="tree-item-content">
						{
							o.type === "image" && <img className="tree-item-img" src={o.src} alt=""/>
						}
						{
							o?.text && <div className="tree-item-content" contentEditable={true} suppressContentEditableWarning={true}
							                onInput={(e) => handleEditMd(e, idx, o.id)}>{o?.text}</div>
						}
					</div>
				</div>
				{
					renderTree(o.children)
				}
			</div>
		})
	}
	
	return (
		<div>
			{renderTree(leftData)}
		</div>
	)
}

export default EditorTree;
