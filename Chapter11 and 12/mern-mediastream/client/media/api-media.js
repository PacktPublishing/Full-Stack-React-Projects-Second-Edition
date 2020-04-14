import config from '../../config/config'
const create = async (params, credentials, media) => {
  try {
    let response = await fetch('/api/media/new/'+ params.userId, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: media
  })    
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const listPopular = async (signal) => {
  try {
    let response = await fetch('/api/media/popular', {
    method: 'GET',
    signal: signal,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
      return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const listByUser = async (params) => {
  try {
    let response = await fetch('/api/media/by/'+ params.userId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
      return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const read = async (params, signal) => {
  try {
    let response = await fetch(config.serverUrl +'/api/media/' + params.mediaId, {
    method: 'GET',
    signal: signal
  })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const update = async (params, credentials, media) => {
  try {
    let response = await fetch('/api/media/' + params.mediaId, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: JSON.stringify(media)
  })    
    return await response.json()
    } catch(err) {
      console.log(err)
    }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/media/' + params.mediaId, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    }
  })    
  return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const listRelated = async (params, signal) => {
  try {
    let response = await fetch('/api/media/related/'+ params.mediaId, {
    method: 'GET',
    signal: signal,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
      return await response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
  create,
  listPopular,
  listByUser,
  read,
  update,
  remove,
  listRelated
}
