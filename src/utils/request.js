/**
 * description：服务请求公共方法
 * @author Kevin
 * @date 2023/8/25
 */
import _ from "lodash"
import qs from "qs"
import tokenManager from "@utils/tokenManager"

const baseUrl = process.env.REACT_APP_BASE_API + ""

const request = {
	/**
	 * fetch兼容 SSE的方法
	 * @param url
	 * @param options
	 * @returns {Promise<unknown>}
	 */
	requestSSE: function (url, options = {}) {
		const _this = this
		url = baseUrl + url
		if (!options.method) options.method = "get"
		return new Promise((resolve, reject) => {
			fetch(url, { ...options, headers: { ...options.headers, Accept: "text/event-stream" } })
			.then(async response => {
				if (response.status !== 200) {
					// 报错
					throw new Error(`Server responded with ${response.status}`)
				}
				if (!response.ok) {
					throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`)
				}
				if (!response.body) {
					throw new Error("No body included in POST response object")
				}
				const reader = response.body.getReader()
				let done = false
				let decodedData = ""
				
				while (!done) {
					const { value, done: readerDone } = await reader.read()
					if (!response.ok) {
						throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`)
					}
					done = readerDone
					if (value) {
						const chunk = new TextDecoder().decode(value)
						decodedData += chunk
						_.isFunction(options?.cb) && options?.cb(decodedData)
					}
				}
				resolve()
			})
			.catch(error => {
				console.log(error)
				message.error("服务器异常，请联系管理员！")
				reject(error)
			})
		})
	},
	/**
	 * 基本请求方法
	 * @param url
	 * @param options
	 * @returns {Promise<unknown>}
	 */
	request: function (url, options = {}) {
		url = baseUrl + url
		if (!options.method) options.method = "get"
		return new Promise((resolve, reject) => {
			fetch(url, options)
			.then(res => res.json())
			.then(data => {
				if (data?.code === 20000) {
					resolve({ ...data })
				} else {
					const msg = {
						401: "服务认证失效，请稍后再试",
						429: "服务荷载达到上限，请稍后再试",
						524: "服务响应超时，请稍后再试"
					}[data?.data?.error?.code]
					message.error(msg || "服务器异常，请联系管理员！")
					reject(data)
				}
			})
			.catch(error => {
				console.log(error)
				message.error("服务器异常，请联系管理员！")
				reject(error)
			})
		})
	},
	/**
	 * get请求
	 * @param url
	 * @param options
	 * @returns {Promise<void>}
	 */
	get: async function (url, options = {}) {
		if (!options.method) {
			options.method = "get"
		}
		url = url + "?" + qs.stringify(options.data, { indices: true }) + "&" + new Date().getTime()
		if (!options.headers) {
			options.headers = { "Content-Type": "application/json" }
		}
		
		if (tokenManager.getToken()) {
			if (!options.headers) {
				options.headers = {}
			}
			options.headers["Authorization"] = tokenManager.getToken()
		}
		
		return this.request(url, options)
	},
	/**
	 * post请求
	 * @param url
	 * @param options
	 * @param responseType
	 * @returns {Promise<*>}
	 */
	post: async function (url, options = { method: "post" }, responseType) {
		if (!options.method) {
			options.method = "post"
		}
		if (options.data instanceof FormData) {
			options.body = options.data
		} else {
			if (_.isEmpty(options.headers)) {
				options.headers = {}
			}
			options.headers["Content-Type"] = "application/json"
			options.body = JSON.stringify(options.data)
			options.cb = _.get(options, "data.cb")
		}
		
		if (tokenManager.getToken()) {
			if (!options.headers) {
				options.headers = {}
			}
			options.headers["Authorization"] = tokenManager.getToken()
		}
		
		if (responseType && responseType === "sse") {
			return this.requestSSE(url, options)
		} else {
			return this.request(url, options)
		}
	}
}

export default request
