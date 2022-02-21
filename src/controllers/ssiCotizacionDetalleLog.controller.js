const pool = require('../db');

const getAllssiCotizacionDetalleLog = async (req, res, next) => {

    try {
        const result = await pool.query('SELECT * FROM ssiCotizacionDetalleLog;')

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getssiCotizacionDetalleLog = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM ssiCotizacionDetalleLog WHERE id_ssicotizacion = $1 ', [id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message: 'Task not found',
            })
        res.json(result.rows);
    } catch (error) {
        next(error);
    }

}

const createssiCotizacionDetalleLog = async (req, res, next) => {
    const { id_ssicotizacion, rol, horas, estado} = req.body;

    try {
        const result = await pool.query('INSERT INTO ssiCotizacionDetalleLog (id_ssicotizacion, rol, horas, estado) VALUES ($1, $2, $3, $4) RETURNING *', [
            id_ssicotizacion, 
            rol, 
            horas,
            estado
        ]);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
        // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
    }
}
const deletessiCotizacionDetalleLog = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM ssiCotizacionDetalleLog WHERE id_ssicotizacion = $1', [id]);

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
    getAllssiCotizacionDetalleLog,
    getssiCotizacionDetalleLog,
    createssiCotizacionDetalleLog,
    deletessiCotizacionDetalleLog,
    // updateTask
};