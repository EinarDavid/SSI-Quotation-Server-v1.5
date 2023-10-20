const pool = require('../db');

const getAllssiCotizacionDetalleRol = async (req, res, next) => {
    
    console.log("Entro aqui")
    try {
        const result = await pool.query('SELECT * FROM public.ssi_quotation_detail;')

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getssiCotizacionDetalleRol = async (req, res, next) => {
    const { id } = req.params;
    //console.log("Entro aqui---------",req.params)
    try {
        const result = await pool.query('SELECT * FROM public.ssi_quotation_detail WHERE id_quotation = $1', [id]);

        res.json(result.rows);


    } catch (error) {
        next(error);
    }

}

const createssiCotizacionDetalleRol = async (req, res, next) => {
    

    //console.log('Data recibida', req.body)
    const { id_quotation, id_order, client, responsible, date, status, total_effort, total_effort_approved, project_type, project_code, link_jira, project_chgreq_code, Campos } = req.body;
    
    const detalle = Campos;
    //console.log('Detalle', detalle); 
    try {        
        const result = await pool.query('UPDATE public.ssi_quotation\
                                         SET client = $2,\
                                         responsible = $3,\
                                         date = $4,\
                                         status = $5,\
                                         total_effort = $6,\
                                         project_type = $7,\
                                         id_order = $8,\
                                         project_code = $9, \
                                         link_jira = $10,\
                                         project_chgreq_code = $11,\
                                         total_effort_approved = $12\
                                         WHERE  id_quotation = $1 RETURNING *', [ id_quotation,
                                                client,
                                                responsible,
                                                date,
                                                status,
                                                total_effort,
                                                project_type,
                                                id_order,
                                                project_code,
                                                link_jira,
                                                project_chgreq_code,
                                                total_effort_approved
                                            ]);
                 //console.log('---Llego hasta aqui----');                           

        const resdelete = await pool.query('DELETE FROM public.ssi_quotation_detail WHERE id_quotation = $1', [id_quotation]);

        for (let index = 0; index < detalle.length; index++) {
            const result = await pool.query('INSERT INTO public.ssi_quotation_detail(id_quotation,role,effort,effort_approved)\
                                              VALUES ($1, $2, $3, $4) RETURNING *', [
                                                id_quotation, 
                                                detalle[index].role, 
                                                detalle[index].effort, 
                                                detalle[index].effort_approved
                                        ]);        
        }
            
        if (result.rows.length === 0)
            return res.json({
                message: "Resource not found",
            });

        //return res.json(result.rows[0]);
        res.json({ data: result.rows[0], message: 'Cotización registrada correctamente' });

        //console.log('Result---', result)

    } catch (error) {
        next(error);

    }   

}

const deletessiCotizacionDetalleRol = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM public.ssi_quotation_detail WHERE id_quotation = $1', [id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message: "Task not found",
            });

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

const updatessiCotizacionDetalleRol = async (req, res, next) => {
    const { id } = req.params;
    const { id_quotation, role, effort, effort_approved } = req.body;

    try {
        const result = await pool.query('UPDATE public.ssi_quotation_detail SET id_quotation = $1, role = $2, effort = $3, effort_approved = $4 WHERE id_quotation = $5 RETURNING *',
            [id_quotation, role, effort, effort_approved, id])

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
    getAllssiCotizacionDetalleRol,
    getssiCotizacionDetalleRol,
    createssiCotizacionDetalleRol,
    deletessiCotizacionDetalleRol,
    updatessiCotizacionDetalleRol
};