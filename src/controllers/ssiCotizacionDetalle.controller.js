const pool = require('../db');

const getAllssiCotizacionDetalle = async (req, res, next) => {

    try {
        const result = await pool.query('SELECT * FROM ssi_quotation_detail;')

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getssiCotizacionDetalle = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM ssi_quotation_detail WHERE id_order = $1 ', [id]);

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
    const { id_quotation, valores} = req.body; //Cambiar el dato como envio del Cliente
    const detalle = JSON.parse(valores);

    console.log('Bodyyyyyy',req.body);
    console.log('detalleeee',detalle);

    detalle.map(async({role, effort})=>{
        try {
            const result = await pool.query('INSERT INTO ssi_quotation_detail (id_quotation, role, effort) VALUES ($1, $2, $3) RETURNING *', [
                id_quotation, 
                role, 
                effort
            ]);
    
            res.json(result.rows[0]);

        } catch (error) {
            next(error);
            // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
        }
    })

    
}
// const createssiCotizacionDetalle = async (req, res, next) => {
//     const { id_ssicotizacion, rol, horas} = req.body;

//     try {
//         const result = await pool.query('INSERT INTO ssiCotizacionDetalle (id_ssicotizacion, rol, horas) VALUES ($1, $2, $3) RETURNING *', [
//             id_ssicotizacion, 
//             rol, 
//             horas
//         ]);

//         res.json(result.rows[0]);
//     } catch (error) {
//         next(error);
//         // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
//     }
// }
const deletessiCotizacionDetalle = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM ssi_quotation_detail WHERE id_quotation = $1', [id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message: "Task not found",
            });

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

const updatessiCotizacionDetalle = async (req, res, next) => {
    const { id } = req.params;
    const { id_quotation, role, effort } = req.body;

    try {
        const result = await pool.query('UPDATE ssi_quotation_detail SET id_quotation = $1, role = $2, effort = $3 WHERE id_quotation = $4 RETURNING *',
            [id_quotation, role, effort, id])

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
    getAllssiCotizacionDetalle,
    getssiCotizacionDetalle,
    createssiCotizacionDetalle,
    deletessiCotizacionDetalle,
    updatessiCotizacionDetalle
};