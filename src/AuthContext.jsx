import React,{ createContext,useContext,useState,useEffect } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [User, setUser] = useState(null)
    const [Loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                setUser(currentUser)
                setLoading(false)
            }else{
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    },[])

    return (
        <AuthContext.Provider value={{User,Loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}