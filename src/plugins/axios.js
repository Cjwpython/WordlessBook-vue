'use strict'

import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: '/api'
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}
console.log(process.env.baseURL, 'url')
const _axios = axios.create(config)
// const requestLists = []
// const CancelToken = axios.CancelToken
_axios.interceptors.request.use(
  function (config) {
    // config.cancelToken = new CancelToken((cancel) => {
    //   const requestFlag = config.url + JSON.stringify(config.data) + '&' + config.method
    //   requestLists.includes(requestFlag) ? cancel() : requestLists.push(requestFlag)
    // })
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // const requestFlag = response.config.url + response.config.data + '&' + response.config.method
    // requestLists.splice(requestLists.findIndex(item => item === requestFlag), 1)
    return response
  },
  function (error) {
    console.log(error.response, 'response')
    const { status } = error.response
    // Message({
    //   showClose: true,
    //   message: '错了哦，这是一条错误消息',
    //   type: 'error'
    // })
    Message.error(`状态码:${status}`)
    // Do something with response error
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.$axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
