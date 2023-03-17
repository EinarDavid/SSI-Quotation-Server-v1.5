const pool = require('../db');

const getAllssiClients = async (req, res, next) => {

    try {
        const result = await pool.query('SELECT * FROM public.ssi_clients;')

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllssiResources = async (req, res, next) => {
    const state = 'A';
    try {
        const result = await pool.query('SELECT * FROM public.ssi_resource_odoo Where state = $1;', [state])

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllssiCatalogProjectType = async (req, res, next) => {
    const state = 'A';
    const cod_entity = 'PROJECT_TYPE';
    try {
        const result = await pool.query('SELECT * FROM public.ssi_Catalog Where state = $1 and cod_entity = $2 ORDER BY cod_entity;', [state, cod_entity])

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllssiCatalogRequirement = async (req, res, next) => {
    const state = 'A';
    const cod_entity = 'REQUIREMENT';
    try {
        const result = await pool.query('SELECT * FROM public.ssi_Catalog Where state = $1 and cod_entity = $2 ORDER BY cod_entity;', [state, cod_entity])

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllssiCatalogResource = async (req, res, next) => {
    const state = 'A';
    const cod_entity = 'RESOURCE';
    try {
        const result = await pool.query('SELECT * FROM public.ssi_Catalog Where state = $1 and cod_entity = $2 ORDER BY cod_entity;', [state, cod_entity])

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllWeeksByYear = async (req, res, next) => {
    const { pyear, pmonth } = req.params;
    var curWeek = 1;
    try {
        const resWeek = await pool.query('SELECT EXTRACT(WEEK FROM MAKE_DATE($1::int, 12, 28)) nbrofweeksinyear;', [pyear])
        const nbrofweeksinyear = resWeek.rows[0].nbrofweeksinyear;
        let date_ob = new Date();
        let startDate = new Date(date_ob.getFullYear(), 0, 1);
        let curYear = date_ob.getFullYear();
        console.log(resWeek.rows[0].nbrofweeksinyear, ' - ', date_ob, ' - ', curYear);
        if (pyear == curYear) {
            let days = Math.floor((date_ob - startDate) / (24 * 60 * 60 * 1000));
            let weekNumber = Math.ceil(days / 7);
            curWeek = weekNumber;
            console.log('Current Year. Weeks: ', (date_ob - startDate), '   -  ', weekNumber);
        }

        const result = await pool.query('SELECT DISTINCT weekofyear code_week, weekofyear week FROM PUBLIC.ssi_dim_date WHERE YEAR = $1::int AND MONTH = $2::int;', [pyear, pmonth])

        //const result = await pool.query('SELECT week code_week, week FROM generate_series($1::int, $2::int) "week";', [curWeek,nbrofweeksinyear])

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllMonths = async (req, res, next) => {

    try {
        const result = await pool.query("SELECT TO_NUMBER(TO_CHAR(TO_DATE(TO_CHAR(now(),'YYYY')||'-01-01','YYYY-MM-DD') + (INTERVAL '1' MONTH * generate_series(0,month_count::INT)),'MM'),'99') monthNbrofYear,\
                                                    TO_CHAR(TO_DATE(TO_CHAR(now(),'YYYY')||'-01-01','YYYY-MM-DD') + (INTERVAL '1' MONTH * generate_series(0,month_count::INT)),'Month') AS MonthName\
                                            FROM (\
                                                SELECT (EXTRACT(YEAR FROM diff) * 12 + EXTRACT(MONTH FROM diff) + 12)-1 AS month_count\
                                                FROM ( SELECT age(now(), now()) AS diff ) td\
                                            ) t;"
        )
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllYears = async (req, res, next) => {

    try {
        const resYears = await pool.query("SELECT TO_NUMBER(TO_CHAR(now(),'YYYY'),'FM9999')::int minYear, MAX(YEAR)::int maxYear FROM PUBLIC.ssi_dim_date;")
        //console.log(resYears.rows[0].minyear,resYears.rows[0].maxyear);
        const minyear = resYears.rows[0].minyear;
        const maxyear = resYears.rows[0].maxyear;

        const result = await pool.query('SELECT year code_year, year FROM generate_series($1::int, $2::int) year;', [minyear, maxyear])
        res.json(result.rows);

    } catch (error) {
        next(error);
    }
}

const createssiQuotation = async (req, res, next) => {
    const { client, responsible, date, status, total_effort, project_code, project_type } = req.body;

    try {
        const result = await pool.query('INSERT INTO public.ssi_quotation( client, responsible, date, status, total_effort, project_code, project_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [
            client,
            responsible,
            date,
            status,
            total_effort,
            project_code,
            project_type
        ]);

        res.json({ data: result.rows[0], message: 'Cotizacion registrada correctamente' });

    } catch (error) {
        next(error);
        // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
    }
}

const updatessiQuotation = async (req, res, next) => {
    const { id_quotation, id_order, client, responsible, date, status, total_effort, project_type } = req.body;

    try {
        const result = await pool.query('UPDATE public.ssi_quotation \
                                         SET id_order = $2,\
                                            client = $3,\
                                            responsible = $4,\
                                            date = $5,\
                                            status = $6,\
                                            total_effort = $7,\
                                            project_type = $8\
                                        WHERE id_quotation = $1 RETURNING *', [id_quotation, id_order, client, responsible, date, status, total_effort, project_type]);

        res.json({ data: result.rows[0], message: 'Cotizacion actualizada correctamente' });

    } catch (error) {
        next(error);
        // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
    }
}

const insertResourceDetail = async (req, res, next) => {
    //const {id} = req.params;
    //console.log('Data recibida', req.body)
    const { id_quotation, id_order, client, responsible, date, status, total_effort, project_type, project_code, Campos } = req.body;
    //console.log('Json', JSON.parse(Campos));
    
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
                                         project_code= $9 \
                                         WHERE  id_quotation = $1 RETURNING *', [ id_quotation,
                                                client,
                                                responsible,
                                                date,
                                                status,
                                                total_effort,
                                                project_type,
                                                id_order,
                                                project_code
                                            ]);
                 //console.log('---Llego hasta aqui----');                           

        const resdelete = await pool.query('DELETE FROM public.ssi_resource_allocation WHERE id_quotation = $1', [id_quotation]);

        for (let index = 0; index < detalle.length; index++) {
            const result = await pool.query('INSERT INTO public.ssi_resource_allocation(id_quotation,id_resource,role,year,month,week,effort,days,state)\
                                              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [
                                                id_quotation, 
                                                detalle[index].id_resource, 
                                                detalle[index].role, 
                                                detalle[index].year, 
                                                detalle[index].month, 
                                                detalle[index].week, 
                                                detalle[index].effort, 
                                                detalle[index].days, 
                                                detalle[index].state
                                        ]);
            // console.log('Res----------',result);                
        }
    
        
        if (result.rows.length === 0)
            return res.json({
                message: "Resource not found",
            });

        //return res.json(result.rows[0]);
        res.json({ data: result.rows[0], message: 'Cotizacion registrada correctamente' });

        //console.log('Result---', result)

    } catch (error) {
        next(error);

    }
}

const updateResourceDetail = async (req, res, next) => {
    const { client, responsible, date, status, total_effort, project_code, project_type } = req.body;

    try {
        const result = await pool.query('UPDATE public.ssi_resource_allocation \
                                         SET id_resource = $2,\
                                            role = $3,\
                                            year = $4,\
                                            month = $5,\
                                            week = $6,\
                                            effort = $7,\
                                            days = $8,\
                                            state = $9\
                                        WHERE id_resource_allocation = $1 RETURNING *', [id_resource_allocation, id_quotation, id_resource, role, year, month, week, effort, days, state]);

        res.json({ data: result.rows[0], message: 'Cotizacion registrada correctamente' });

    } catch (error) {
        next(error);
        // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
    }
}

const getResourceDetailByQuotationId = async (req, res, next) => {
    const { pidquotation } = req.params;

    try {
        const result = await pool.query('SELECT * FROM public.ssi_resource_allocation \
                                        WHERE id_quotation = $1', [pidquotation])

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getResourceAllocationDetail = async (req, res, next) => {
    const state = 'A';
    const { presource, pyear, pmonth, pweek } = req.params;
    console.log('parametros',req.params)
    try {
        const result = await pool.query('SELECT id_resource, year, month, week, \
                                            (SELECT DISTINCT labourdaysinweek FROM PUBLIC.ssi_dim_date WHERE year = $2 AND month = $3 AND weekofyear = $4) labourdaysinweek, \
                                            sum(effort) totalEffortHoursResource\
                                        FROM public.ssi_resource_allocation \
                                        WHERE id_resource = $1 AND year = $2 AND month = $3 AND week = $4\
                                        GROUP BY id_resource, year, month, week;', [presource, pyear, pmonth, pweek])

        
        
        if(result.rows.length === 0){
            res.json({ message: 'El usuario no tiene horas registradas'});
            console.log('---',result)
        }else{
            res.json(result.rows);
        }
    } catch (error) {
        next(error);
    }
}

const getLabourDaysInformation = async (req, res, next) => {
    const { pyear, pmonth, pweek } = req.params;
    try {
        const result = await pool.query('SELECT DISTINCT weekofyear, labourhoursinweek, labourdaysinweek FROM PUBLIC.ssi_dim_date WHERE year = $1 AND month = $2 AND weekofyear = $3;', [pyear, pmonth, pweek])

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

// FILTERS

const getInformationByFilters = async (req, res, next) => {
    const { pclient,presponsible,pprojectcode,pprojectctype,porderfield,pdesasc} = req.params;
    let sql = "SELECT id_quotation, id_order, client, responsible, date,\
                    (SELECT description FROM PUBLIC.ssi_catalog WHERE cod_value = q.status and cod_entity = 'REQUIREMENT') status, \
                    total_effort, project_code, \
                    (SELECT description FROM PUBLIC.ssi_catalog WHERE cod_value = q.project_type and cod_entity = 'PROJECT_TYPE') project_type \
                FROM PUBLIC.ssi_quotation q\
                WHERE 1=1";
        
    if(pclient != 'ALL'){
        sql = sql + " AND client = '" + pclient + "'";
    }
    if(presponsible != 'ALL'){
        sql = sql + " AND responsible = '" + presponsible + "'";
    }   
    if(pprojectcode != 'ALL'){
        sql = sql + " AND project_code = '" + pprojectcode + "'";
    }
    if(pprojectctype != 'ALL'){
        sql = sql + " AND project_type = '" + pprojectctype + "'";
    }
       
    if(porderfield != ' '){
        sql = sql + " ORDER BY " + porderfield + " " + pdesasc;
    } else{
        sql = sql + " ORDER BY date DESC";
    }    
    console.log('SQL: ' + sql);

    try {
        const result = await pool.query(sql)
        console.log('query');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllssiClients,
    getAllssiResources,
    getAllssiCatalogProjectType,
    getAllssiCatalogRequirement,
    getAllssiCatalogResource,
    getAllWeeksByYear,
    getAllMonths,
    getAllYears,
    createssiQuotation,
    updatessiQuotation,
    insertResourceDetail,
    updateResourceDetail,
    getResourceDetailByQuotationId,
    getResourceAllocationDetail,
    getLabourDaysInformation,
    getInformationByFilters
}    
