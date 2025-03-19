import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { ApiContext } from '../../../ApiContext'
import { Card } from '../../exports.js';
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion';


const ByCompany = () => {

    const API_KEY = useContext(ApiContext).API_KEY;
    const { company, id } = useParams();
    const [Franchisedata, setFranchisedata] = useState([])
    const [pageNum, setPageNum] = useState(1);
    

    const fetchFranchise = async () => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
                params: {
                  api_key: API_KEY,
                  include_adult: false,
                  include_video: false,
                  language: "en",
                  sort_by: "primary_release_date.asc",
                  with_companies: id,
                  page: pageNum,
                },
              }
            )
            setFranchisedata(response.data.results || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchFranchise()
    }, [pageNum])

    const handlePageChange = (newPage) => {
        // Simple scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setPageNum(newPage);
    };

  return (
    <>
      <main className='flex flex-col justify-center items-center gap-10 py-10 '>
        <h1 className='font-extrabold text-3xl uppercase '>{company} collection</h1>
        <div className="w-full">
            <Card Data={Franchisedata} mediaType="movie" classul="flex flex-wrap justify-center gap-4" />
        </div>
        <motion.section className="flex gap-3 items-center justify-center mt-8 mb-4">
            <button 
                className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(pageNum - 1)} 
                disabled={pageNum === 1}
            >
                Prev
            </button>
            <p className="text-white font-medium">{pageNum}</p>
            <button 
                className="bg-gray-800 hover:bg-gray-700 text-yellow-300 font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(pageNum + 1)} 
                disabled={Franchisedata.length < 20}
            >
                Next
            </button>
        </motion.section>
        
      </main>
    </>
  )
}

export default ByCompany