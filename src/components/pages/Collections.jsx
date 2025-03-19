import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ApiContext } from '../../ApiContext'
import Card from '../../assets/card/Card';
import { Link } from 'react-router-dom';

const Collections = () => {

    const API_KEY = useContext(ApiContext).API_KEY;
    const [Collections, setCollections] = useState([]);
    const [collectionbyCompany, setcollectionbyCompany] = useState([])

    const Collectionid = [86311,10,295]
    const collectionname = [
        {name: "star wars", id: 10,},
        {name: "Harry Potter", id: 1241,},
        {name: "The Lord of the Rings", id: 119,},
        {name: "Fast & Furious", id: 9485,},
        {name: "Jurassic Park", id: 328,},
        {name: "John Wick", id: 404609,},
        {name: "Transformers", id: 8650,},
        {name: "The Matrix", id: 2344,},
        {name: "The Conjuring Universe", id: 313086,},
        {name: "Saw", id: 656,},
        {name: "Alien", id: 8091,},
        {name: "Predator", id: 399,},
        {name: "Terminator", id: 528,},
        {name: "X-Men", id: 748,},
        {name: "Men in Black", id: 86055,},
        {name: "The Kingsman", id: 391860,},
        {name: "Jumanji", id: 495527,},
        {name: "Indiana Jones", id: 84,},
        {name: "Mission: Impossible", id: 87359,},
        {name: "James Bond", id: 645,},
        {name: "Pirates of the Caribbean", id: 295,},
        {name: "Pokémon", id: 7484,},
        {name: "Dragon Ball Z", id: 120790,}
    ]
    const company = {
        'marvel': 420,
        'dc': 128064,
    } 

    const fetchCollections = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/collection`, {
                params: {
                  api_key: API_KEY,
                  language: "en",
                  include_adult: false,
                  query: "",
                },
              }
            )
            setCollections(response.data.results || [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchbycompany = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
                params: {
                  api_key: API_KEY,
                  language: "en",
                  include_adult: false,
                  with_companies: 128064
                },
              }
            )
            setcollectionbyCompany(response.data.results || [])
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchCollections();
        fetchbycompany();
    }, [])

  return (
    <>
       <main className="flex flex-col justify-center items-center gap-5 p-5">
        <h1 className="font-extrabold text-xl lg:text-3xl text-yellow-500">EXPLORE THE COLLECTIONS <span className='text-white'> OF SHOWS FROM VARIOUS FRANCHISES </span></h1>
        {/* <ul className="flex flex-col flex-wrap justify-center gap-10">
            {Collections.map((collection) => (
                <li key={collection.id} className="flex items-center">
                    <p className="">{collection.name}, id: {collection.id}</p>
                </li>
            ))}
        </ul> */}
        
        <section className='flex flex-col gap-8 my-6 p-5'>
            {/* <Link className="uppercase text-2xl font-bold hover:text-yellow-500 text-center " to={`/franchise/star wars/${Collectionid[1]}`} >
                <h1 className=''>star wars</h1>
                <h2>collection</h2>
            </Link>
            <Link className="uppercase text-2xl font-bold hover:text-yellow-500 text-center " to={`/franchise/Pirates of the Caribbean/${Collectionid[2]}`} >
                <h1 className=''>Pirates of the Caribbean</h1>
                <h2>collection</h2>
            </Link>
            <Link className="uppercase text-2xl font-bold hover:text-yellow-500 text-center " to={`/marvel/${company['marvel']}`} >
                <h1 className=''>marvel</h1>
                <h2>collection</h2>
            </Link>
            <Link className="uppercase text-2xl font-bold hover:text-yellow-500 text-center " to={`/dc/${company['dc']}`} >
                <h1 className=''>dc</h1>
                <h2>collection</h2>
            </Link> */}

            {Object.entries(company).map(([key, value]) => (
                <Link className="uppercase text-2xl font-bold hover:text-yellow-500 text-center" 
                    to={`/${key}/${value}`} 
                    key={key}>
                    <h1>{key}</h1>
                    <h2>collection</h2>
                </Link>
            ))}

            {collectionname.map((collection) => (
                <Link className="uppercase text-2xl font-bold hover:text-yellow-500 text-center"
                    to={`/franchise/${collection.name}/${collection.id}`}
                    key={collection.id}>
                    <h1>{collection.name}</h1>
                    <h2>collection</h2>
                </Link>
            ))}

        </section>

       </main>
    </>
  )
}

export default Collections