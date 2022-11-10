import axios from 'axios'

const helpers = {
  preparePostData: (params) => {
    let formData = new FormData()
    Object.keys(params).forEach(item => {
      formData.append(item, params[item])
    })

    let headers = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    return [formData, headers]
  },
  prepareGetData: (params) => {
    return new URLSearchParams(params).toString()
  }
}

const instance = axios.create({
  baseURL: 'https://api.mal.yuriy.gr/v1/',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

instance.interceptors.response.use(
  (response) => response.data,
  (response) => {
    return Promise.reject(
      (typeof response.response.data !== "undefined")
      ? response.response.data.status
      : response
    )
  }
)

export const help = {
  get: ({ id, slug }) => {
    return instance.get(`/help/${id}-${slug}`)
  }
}

export const utils = {
  feedback: (params) => {
    let [formData, headers] = helpers.preparePostData(params)
    return instance.post('/feedback', formData, headers)
  }
}

export const auth = {

}

export const my = {
  profile: () => {
    return instance.get(`/my/profile`)
  },
  overview: () => {
    return instance.get(`/my/overview`)
  },
  list: (type, params) => {
    let data = helpers.prepareGetData(params)
    return instance.get(`/my/${type}-list?${data}`)
  }
}

export const catalog = {
  title: (id) => {

  },
  company: (id) => {

  },
  genre: (id) => {
  
  }
}

export const mySearch = {
  get: (params) => {
    if (params.query === '')
      return Promise.resolve([]);

  }
}

export default {
  auth, catalog, my
}