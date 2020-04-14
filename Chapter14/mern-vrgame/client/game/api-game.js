const create = async (params, credentials, game) => {
  try {
    let response = await fetch('/api/games/by/'+ params.userId, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(game)
    })
    return await response.json()
  } catch(err) { 
    console.log(err)
  }
}

const list = async (signal) => {
  try {
    let response = await fetch('/api/games', {
      method: 'GET',
      signal: signal
    })
    return await response.json()
  } catch(err) { 
    console.log(err)
  }
}

const listByMaker = async (params, signal) => {
  try {
    let response = await fetch('/api/games/by/'+params.userId, {
      method: 'GET',
      signal: signal,
    })
    return await response.json()
  } catch(err) { 
    console.log(err)
  }
}

const read = async (params, credentials) => {
  try {
    let response = await fetch('/api/game/' + params.gameId, {
      method: 'GET'
    })
    return await response.json()
  } catch(err) { 
    console.log(err)
  }
}

const update = async (params, credentials, game) => {
  try {
    let response = await fetch('/api/games/' + params.gameId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(game)
    })
    return await response.json()
  } catch(err) { 
    console.log(err)
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/games/' + params.gameId, {
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

export {
  create,
  list,
  listByMaker,
  read,
  update,
  remove
}
