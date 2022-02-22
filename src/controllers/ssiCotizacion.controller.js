const pool = require('../db');

const getAllssiCotizacion = async (req, res, next) => {

    try {
        const result = await pool.query('SELECT * FROM ssiCotizacion;')

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getssiCotizacion = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM ssiCotizacion WHERE numero_cotizacion = $1', [id]);
        // const result = await pool.query('SELECT * FROM ssiCotizacion S JOIN ssiCotizacionDetalle D ON S.numero_cotizacion = D.id_ssicotizacion WHERE D.id_ssiCotizacion = $1', [id]);

        if (result.rows.length === 0)
            return res.json({
                message: 'No se encontro ningun resultado',
            })
        // if (result.rows.length === 0) {
        //     const result2 = await pool.query('SELECT * FROM ssiCotizacion WHERE id_ssicotizacion = $1', [id]);

        //     if (result2.rows.length === 0)
        //         return res.status(404).json({
        //             message: 'Task not found',
        //         })
        // }

        res.json(result.rows);
    } catch (error) {
        next(error);
    }

}

const createssiCotizacion = async (req, res, next) => {
    const { numero_cotizacion, cliente, responsable, fecha, estado } = req.body;

    try {
        const result = await pool.query('INSERT INTO ssiCotizacion (numero_cotizacion, cliente, responsable, fecha, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *', [
            numero_cotizacion,
            cliente,
            responsable,
            fecha, 
            estado
        ]);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
        // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
    }
}

const updatessiCotizacion = async (req, res, next) => {
    const { id } = req.params;
    const { numero_cotizacion, cliente, responsable, fecha, estado } = req.body;

    try {
        const result = await pool.query('UPDATE ssiCotizacion SET numero_cotizacion = $1, cliente = $2, responsable = $3, fecha = $4, estado = $5 WHERE numero_cotizacion = $6 RETURNING *',
            [numero_cotizacion, cliente, responsable, fecha, estado, id])

        if (result.rows.length === 0)
            return res.json({
                message: "Task not found",
            });

        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllssiCotizacion,
    getssiCotizacion,
    createssiCotizacion,
    // deleteTask, 
    updatessiCotizacion
};