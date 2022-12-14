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

const content = {
  help: {
    get: ({ id, slug }) => {
      return instance.get(`/content/help/${id}-${slug}`)
    }
  },
  article: {
    list: (params) => {
      let data = helpers.prepareGetData(params)
      return instance.get(`/content/article?${data}`)
    },
    get: ({ id, slug }) => {
      return instance.get(`/content/article/${id}-${slug}`)
    }
  },
  feedback: (params) => {
    let [formData, headers] = helpers.preparePostData(params)
    return instance.post('/content/feedback', formData, headers)
  }
}

const auth = {
  pizdec: (params) => {
    let data = helpers.prepareGetData(params)
    return instance.get(`/auth/vkminiapp?${data}`)
  },
  session: () => {
    return instance.get('/auth/session')
  },
  logout: (params = {}) => {
    let [formData, headers] = helpers.preparePostData(params)
    return instance.post('/auth/logout', formData, headers)
  }
}

const catalog = {
  anime: (id) => {
    return instance.get(`/catalog/anime/${id}`)
  },
  company: (id) => {

  },
  genre: (id) => {
  
  },
  search: (params = {}) => {
    let data = helpers.prepareGetData(params)
    return instance.get(`/catalog/search?${data}`)
  }
}

const my = {
  profile: () => {
    return instance.get(`/my/profile`)
  },
  overview: () => {
    return instance.get(`/my/overview`)
  },
  suggest: () => {
    return instance.get(`/my/suggest`)
  },
  list: {
    get: (type, params) => {
      let data = helpers.prepareGetData(params)
      return instance.get(`/my/${type}-list?${data}`)
    },
    update: (type, id, params) => {
      let [formData, headers] = helpers.preparePostData(params)
      return instance.post(`/my/${type}-list/${id}`, formData, headers)
    },
    delete: (type, id) => {
      return instance.delete(`/my/${type}-list/${id}`)
    }
  }
}


export default {
  auth, content, catalog, my
}