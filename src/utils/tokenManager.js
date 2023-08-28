/**
 * token处理公共方法
 * @type {string}
 */
const tokenKey = "md2pptx-token"

const tokenManager = {
	setToken: function (token) {
		localStorage.setItem(tokenKey, token)
	},
	getToken: function () {
		return localStorage.getItem(tokenKey)
	},
	removeToken: function () {
		localStorage.removeItem(tokenKey)
	}
}

export default tokenManager
