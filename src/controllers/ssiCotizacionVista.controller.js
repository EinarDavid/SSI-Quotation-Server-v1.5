const pool = require('../db');

const getAllssiCotizacionVista = async (req, res, next) => {

    try {
        const result = await pool.query('SELECT * FROM ssi_view_sale_order;')

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getssiCotizacionVista = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM ssi_view_sale_order WHERE sale_order = $1', [id]);
        // const result = await pool.query('SELECT * FROM ssiCotizacion S JOIN ssiCotizacionDetalle D ON S.numero_cotizacion = D.id_ssicotizacion WHERE D.id_ssiCotizacion = $1', [id]);

        if (result.rows.length === 0)
            return res.json([{
                state: 'null',
            }])
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

module.exports = {
    getAllssiCotizacionVista,
    getssiCotizacionVista
};