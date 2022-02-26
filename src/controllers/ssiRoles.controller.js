const pool = require('../db');

const getAllssiRol = async (req, res, next) => {
    try{
        const result = await pool.query('SELECT * FROM public.ssi_roles;');

        res.json(result.rows);
    } catch(error){
        next(error)
    }
}

module.exports = {
    getAllssiRol
}