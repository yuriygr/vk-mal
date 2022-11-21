// Да, я настолько охуевшая тварь
const formatEntry = (data) => {

  // Да, жесть!
  const name = () => {
    return data.names.russian_name !== "" ? data.names.russian_name : ( 
      data.names.english_name !== "" ? data.names.english_name : (
        data.names.japanese_name !== "" ? data.names.japanese_name : "error"
      )
    )
  }

  // Да, мокап!
  const cover = () => {
    return "https://cdn.myanimelist.net/r/192x272/images/anime/12/39497.webp?s=0ae299ba10f68551842e8b3108a498f5"
  }

  const airing_status = () => {
    return data.airing_status
  }

  const airing_dates = () => {
    if (Object.keys(data.airing_dates).length > 0) {
      var _p = []

      if (data.airing_dates.start)
        _p.push(data.airing_dates.start)
      if (data.airing_dates.finish)
        _p.push(data.airing_dates.finish)

      return _p.join(" - ")
    }
    return false
  }

  // Клянусь, я сам в шоке!
  const premiered = () => {
    if (Object.keys(data.premiered).length > 0) {
      var _p = []

      if (data.premiered.season)
        _p.push(data.premiered.season)
      if (data.premiered.year)
        _p.push(data.premiered.year)

      return _p.join(" ")
    }
    return false
  }

  const progress = () => {
    return (data.series.viewed / data.series.total) * 100
  }

  // Fixs API bugs
  data.companies = data.companies || []
  data.genres = data.genres || []
  data.communities = data.communities || []
  data.authors = data.authors || []
  data.statistic = data.statistic || []
  data.ext_links = data.ext_links || []


  // Самая странная конструкция?
  // Чтобы вы понимали, я не горжусь этой хуитой!
  const grouped_companies = () => {
    let arr = {}
    data.companies.forEach(item =>
      arr[item.role] ? arr[item.role].push(item) : arr[item.role] = [item]
    )
    return arr
  }
  const flat_companies = (role) => {
    let arr = {}
    data.companies.forEach(item =>
      arr[item.role] ? arr[item.role].push(item) : arr[item.role] = [item]
    )
    return (arr[role] || []).map(item => item.names.english_name).join(" · ")
  }

  const grouped_genres = () => {
    let arr = {}
    data.genres.forEach(item =>
      arr[item.category] ? arr[item.category].push(item) : arr[item.category] = [item]
    )
    return arr
  }
  const flat_genres = (category) => {
    let arr = {}
    data.genres.forEach(item =>
      arr[item.category] ? arr[item.category].push(item) : arr[item.category] = [item]
    )
    return (arr[category] || []).map(item => item.names.english_name).join(" · ")
  }

  return {
    ...data,
    name,
    cover,
    airing_status,
    airing_dates,
    premiered,
    progress,
    grouped_companies,
    flat_companies,
    grouped_genres,
    flat_genres,
  }
}

export default formatEntry