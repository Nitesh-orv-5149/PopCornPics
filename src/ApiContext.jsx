import React,{createContext,useState} from 'react'

export const ApiContext = createContext();

export const ApiProvider = ({children}) => {

  const API_KEY = '593060add5d375601a9fc3d72fb9a94a'

  return (
    <ApiContext.Provider value={{API_KEY}}>
      {children}
    </ApiContext.Provider>
  )
}

