const pool = require('../db');

const getAllssiCotizacionDetalle = async (req, res, next) => {

    try {
        const result = await pool.query('SELECT * FROM ssiCotizacionDetalle;')

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getssiCotizacionDetalle = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM ssiCotizacionDetalle WHERE id_ssicotizacion = $1 ', [id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message: 'Task not found',
            })
        res.json(result.rows);
    } catch (error) {
        next(error);
    }

}

const createssiCotizacionDetalle = async (req, res, next) => {
    const { id_ssicotizacion, rol, horas} = req.body;

    try {
        const result = await pool.query('INSERT INTO ssiCotizacionDetalle (id_ssicotizacion, rol, horas) VALUES ($1, $2, $3) RETURNING *', [
            id_ssicotizacion, 
            rol, 
            horas
        ]);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
        // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
    }
}
const deletessiCotizacionDetalle = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM ssiCotizacionDetalle WHERE id_ssicotizacion = $1', [id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message: "Task not found",
            });

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllssiCotizacionDetalle,
    getssiCotizacionDetalle,
    createssiCotizacionDetalle,
    deletessiCotizacionDetalle,
    // updateTask
};