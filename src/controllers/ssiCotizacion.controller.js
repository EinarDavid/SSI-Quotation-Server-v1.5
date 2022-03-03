const pool = require('../db');

const getAllssiCotizacion = async (req, res, next) => {

    try {
        const result = await pool.query('SELECT * FROM public.ssi_quotation;')

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getssiCotizacion = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM public.ssi_quotation WHERE id_order = $1', [id]);
        // const result = await pool.query('SELECT * FROM ssiCotizacion S JOIN ssiCotizacionDetalle D ON S.numero_cotizacion = D.id_ssicotizacion WHERE D.id_ssiCotizacion = $1', [id]);

        if (result.rows.length === 0)
            return res.json([{
                status: 'null',
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

const createssiCotizacion = async (req, res, next) => {
    const { id_order, client, responsible, date, status, total_effort, project_code } = req.body;

    try {
        const result = await pool.query('INSERT INTO public.ssi_quotation (id_order, client, responsible, date, status, total_effort, project_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [
            id_order,
            client,
            responsible,
            date, 
            status,
            total_effort,
            project_code
        ]);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
        // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
    }
}

const updatessiCotizacion = async (req, res, next) => {
    const { id } = req.params;
    const { id_order, client, responsible, date, status, total_effort, project_code } = req.body;

    try {
        const result = await pool.query('UPDATE public.ssi_quotation SET id_order = $1, client = $2, responsible = $3, date = $4, status = $5, total_effort = $6, project_code = $7 WHERE id_order = $8 RETURNING *',
            [id_order, client, responsible, date, status, total_effort, project_code, id])

        if (result.rows.length === 0)
            return res.json({
                message: "Task not found",
            });

        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

const updatessiCotizacionStatus = async (req, res, next) => {
    const {id} = req.params;
    const { status } = req.body;

    try {
        const result = await pool.query('UPDATE public.ssi_quotation SET status = $1 WHERE id_order = $2 RETURNING *',
        [status, id])

        if (result.rows.length === 0)
            return res.json({
                message: "Task not found",
            });

        return res.json(result.rows[0]);
        
        console.log()

    } catch (error) {
        next(error);
        
    }
}

module.exports = {
    getAllssiCotizacion,
    getssiCotizacion,
    createssiCotizacion,
    // deleteTask, 
    updatessiCotizacion,
    updatessiCotizacionStatus
};