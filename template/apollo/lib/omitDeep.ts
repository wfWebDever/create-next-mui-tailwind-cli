import { omit } from 'lodash'

export const omitDeep = (input, deleteKey: string) => {
  function omitDeepOnOwnProps(obj) {
    if (typeof input === 'undefined') {
      return input
    }

    if (!Array.isArray(obj) && !isObject(obj)) {
      return obj
    }

    if (Array.isArray(obj)) {
      return omitDeep(obj, deleteKey)
    }

    const o = {}
    for (const [key, value] of Object.entries(obj)) {
      o[key] = !isNil(value) ? omitDeep(value, deleteKey) : value
    }

    return omit(o, deleteKey)
  }

  if (Array.isArray(input)) {
    return input.map(omitDeepOnOwnProps)
  }

  return omitDeepOnOwnProps(input)
}

function isNil(value) {
  return value === null || value === undefined
}

function isObject(obj) {
  return obj === Object(obj)
}
