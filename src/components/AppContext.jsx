import React,{createContext,useState} from 'react'

export const AppContext = createContext();

export const AppProvider = ({children}) => {

  const [theme, setTheme] = useState('dark')
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <AppContext.Provider value={{theme,toggleTheme}}>
      {children}
    </AppContext.Provider>
  )
}

