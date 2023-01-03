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
  },
  /**
  * Скажу сразу, мне это все пиздец не нравится, так же как и вам.
  * Вот эта вот тупая заморозка параметров, ковыряение тегов, удаление устых полей объекта
  * По этому если есть желание - поправьте меня
  */
  prepareFiltersData: (params) => {
    let _params = Object.assign({}, params)

    _params.tags = _params.tags.map(x => x.value)

    Object.keys(_params).forEach(item => {
      if (_params[item] === '') {
        delete _params[item]
      }
    })
    return new URLSearchParams(_params).toString()
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
  search: (params = {}, filters = {}) => {
    let data = helpers.prepareFiltersData(filters)
    return instance.get(`/catalog/${params.type}-search?query=${params.query}&${data}`)
  }
}

const my = {
  profile: () => {
    return instance.get(`/my/profile`)
  },
  overview: () => {
    return instance.get(`/my/overview`)
  },
  suggest: (filters = {}) => {
    let data = helpers.prepareGetData(filters)
    return instance.get(`/my/suggest?${data}`)
  },
  list: {
    get: (params = {}, filters = {}) => {
      let data = helpers.prepareFiltersData(filters)
      return instance.get(`/my/${params.type}-list?list=${params.list}&${data}`)
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