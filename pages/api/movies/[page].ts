import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../database'

export type Movie = {
    title: string,
    rating: string,
    rental_rate: number,
    genre: string
    rental_amount: number
}

export type Data = {
  movies: Array<Movie>,
  length: number,
  error: unknown | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    let data: Data = { length: 0, movies: [], error: null }
    const page: number = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1
    const limit: number  = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 12

    try {
        const length = await query('SELECT COUNT(*) as length FROM film')
        const movies = await query(`
            SELECT f.title, f.rating, f.rental_rate, c.name AS category_name, COUNT(r.rental_id) AS rental_amount
            FROM film f
            LEFT JOIN film_category fc ON fc.film_id = f.film_id
            LEFT JOIN category c ON c.category_id = fc.category_id
            LEFT JOIN inventory i ON i.film_id = f.film_id
            LEFT JOIN rental r ON r.inventory_id = i.inventory_id
            GROUP BY f.film_id
            LIMIT ${limit}
            OFFSET ${(page-1) * limit};
        `);

        data.length = length[0].length;
        data.movies = movies.map(movie => {
            return {
                title: movie.title,
                rating: movie.rating,
                rental_rate: movie.rental_rate,
                genre: movie.category_name,
                rental_amount: movie.rental_amount
            }
        });
    } catch (error: unknown) {
        data.error = error
    }
    
    res.status(200).json(data)
}

