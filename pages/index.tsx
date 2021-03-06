import type { GetStaticProps } from 'next'
import { Data, Movie } from '../pages/api/movies/[page]'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home({ moviesData, length }: {
    moviesData: Array<Movie>,
    length: number
  }) {

  const [movies, setMovies] = useState(moviesData)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)

  const handlePageChange = async (page: number) => {
		setPage(page);
		const { data } = await axios.get<Data>(`/api/movies/${page}?limit=${limit}`)
		setMovies(data.movies)
	}

  const handleNbResultChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const nbResult = parseInt(event.target.value);
    setLimit(nbResult > 0 ? nbResult : 12);
  }

  useEffect(() => {
    handlePageChange(1)
  }, [limit]) //eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={`${styles.title} text-3xl font-bold`}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <table className="table-auto w-6/12 m-3 rounded-t-lg rounded-b-md overflow-hidden">
          <thead className="bg-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-slate-400">Titre</th>
            <th className="px-4 py-3 text-left text-slate-400">Genre</th>
            <th className="px-4 py-3 text-left text-slate-400">Classement</th>
            <th className="px-4 py-3 text-left text-slate-400">Prix de location</th>
            <th className="px-4 py-3 text-left text-slate-400">Rental Amount</th>
          </tr>
          </thead>
          <tbody className="bg-white">
            {movies.map(movie => (
              <tr key={movie.title} className="border-x border-slate-100">
                <td className="px-4 py-2 border-b border-slate-100 text-slate-500">{movie.title}</td>
                <td className="px-4 py-2 border-b border-slate-100 text-slate-500">{movie.genre}</td>
                <td className="px-4 py-2 border-b border-slate-100 text-slate-500">{movie.rating}</td>
                <td className="px-4 py-2 border-b border-slate-100 text-slate-500">{`${movie.rental_rate} $`}</td>
                <td className="px-4 py-2 border-b border-slate-100 text-slate-500">{movie.rental_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between w-6/12">
          <div className="flex-1">
            {/* Previous */}
            <button disabled={page <= 1} onClick={() => handlePageChange(page-1)}
              className="mx-2 px-3 bg-blue-400 text-slate-100 rounded-full disabled:bg-slate-400">{'<'}
            </button>
            
            {/* First */}
            {page > 1 ? 
              <button onClick={() => handlePageChange(1)} 
                className="mx-2 font-semibold text-slate-500">{'1'}
              </button>
              : null
            }
            {page > 1 ? <span className="mx-1">{'...'}</span> : null}
            
            {/* Current */}
            <span className="mx-2 font-semibold text-blue-400">{page}</span>
            
            {/* Last */}
            {page < Math.ceil(length / limit) ? <span className="mx-1">{'...'}</span> : null}
            {page < Math.ceil(length / limit) ? 
              <button onClick={() => handlePageChange(Math.ceil(length / limit))} 
                className="mx-2 font-semibold text-slate-500">{Math.ceil(length / limit)}
              </button>
              : null
            }
            
            {/* Previous */}
            <button disabled={page >= Math.ceil(length / limit)} onClick={() => handlePageChange(page+1)}
              className="mx-2 px-3 bg-blue-400 text-slate-100 rounded-full disabled:bg-slate-400">{'>'}
            </button>
          </div>
          <div className="flex-1 text-right">
            <span className="pr-2">R??sultats par page :</span>
            <input value={limit} onChange={e => handleNbResultChange(e)}
              className="w-24 text-right px-2 border border-slate-300 rounded"/>
          </div>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data } = await axios.get<Data>(`${process.env.DOMAIN}/api/movies/1`);

    return {
        props: {
            moviesData: data.movies,
            length: data.length
        }
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
        moviesData: [],
        length: 0
    }
  }
}
