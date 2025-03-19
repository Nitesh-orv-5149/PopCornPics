import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ApiContext } from '../../../ApiContext'
import { Card } from '../../exports.js';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'

const Franchise = () => {

    const API_KEY = useContext(ApiContext).API_KEY;
    const { franchisename ,id } = useParams();
    const [Franchisedata, setFranchisedata] = useState([])
    

    const fetchFranchise = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/collection/${id}`, {
                params: {
                  api_key: API_KEY,
                  language: "en",
                },
              }
            )
            setFranchisedata(response.data.parts || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchFranchise()
    }, [])

  return (
    <>
      <main className='flex flex-col justify-center items-center gap-10 py-10 '>
        <h1 className='font-extrabold text-3xl uppercase '>{franchisename} collection</h1>
        <div className="w-full">
            <Card Data={Franchisedata} mediaType="movie" classul="flex flex-wrap justify-center gap-4" />
        </div>
      </main>
    </>
  )
}

export default Franchise