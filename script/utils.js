export const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export const capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const titleize = function (str) {
  const title = str.replace(/[- _]+/g, ' ')
  const words = title.split(' ')
  const res = []

  let len = words.length
  let i = 0
  while (len--) {
    const word = words[i++]
    res.push(capitalize(word))
  }
  return res.join(' ')
}
