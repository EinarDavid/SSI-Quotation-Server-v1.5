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
        const result = await pool.query('SELECT * FROM public.ssi_resource_odoo Where state = $1 ORDER BY resource;', [state])

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

        const result = await pool.query('SELECT DISTINCT weekofyear code_week, weekofyear week FROM PUBLIC.ssi_dim_date WHERE YEAR = $1::int AND MONTH = $2::int AND isweekday	= true;', [pyear, pmonth])

        //const result = await pool.query('SELECT week code_week, week FROM generate_series($1::int, $2::int) "week";', [curWeek,nbrofweeksinyear])

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllMonths = async (req, res, next) => {
    const { pyear} = req.params;
    //CASE WHEN TO_CHAR(now(),'YYYY')::INT = $1 THEN TO_CHAR(now(),'MM')::INT ELSE 1 END AS month,\
    try {
        const result = await pool.query("SELECT TO_NUMBER(TO_CHAR(TO_DATE(year||'-'||month||'-01','YYYY-MM-DD') + (INTERVAL '1' MONTH * generate_series(0,month_count::INT-TO_CHAR(TO_DATE(year||'-'||month||'-01','YYYY-MM-DD'),'MM')::INT+1)),'MM'),'99')  monthNbrofYear,\
                                         TO_CHAR(TO_DATE(year||'-'||month||'-01','YYYY-MM-DD') + (INTERVAL '1' MONTH * generate_series(0,month_count::INT-TO_CHAR(TO_DATE(year||'-'||month||'-01','YYYY-MM-DD'),'MM')::INT+1)),'Month')  MonthName\
                             FROM (\
                                 SELECT CASE WHEN TO_CHAR(now(),'YYYY')::INT = $1 THEN TO_CHAR(now(),'YYYY')::INT ELSE $1 END AS year,\
                                      1 AS MONTH,\
                                            (EXTRACT(YEAR FROM diff) * 12 + EXTRACT(MONTH FROM diff) + 12)-1 AS month_count\
                                 FROM ( SELECT now() curDate, age(now(), now()) AS diff ) td\
                             ) t;", [pyear]  
        )
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const getAllYears = async (req, res, next) => {

    try {
        const resYears = await pool.query("SELECT TO_NUMBER(TO_CHAR(now(),'YYYY'),'FM9999') minYear, TO_NUMBER(TO_CHAR(now() + interval '2 year','YYYY'),'FM9999') maxYear;")
        //SELECT TO_NUMBER(TO_CHAR(now(),'YYYY'),'FM9999')::int minYear, MAX(YEAR)::int maxYear FROM PUBLIC.ssi_dim_date;")
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
    const { client, responsible, date, status, total_effort, project_code, project_type, link_jira, project_chgreq_code } = req.body;
    const state = 'BLOCKED';
    var result = null;
    try {
        // Check if already exists a record of the project in old tables of ODOO
        result = await pool.query('SELECT count(*) qty FROM ssi_quotation sq, ssi_quotation_detail sqd \
                                    WHERE sq.id_quotation = sqd.id_quotation\
                                    AND upper(sq.project_code) = upper($1)\
                                    AND sq.status = $2', [project_code,state]);

        console.log("Result:", result.rows[0].qty)                                   
        
        if( result.rows[0].qty == 0){
            console.log("project_chgreq_code: ", project_chgreq_code);
            if(project_chgreq_code == '' && project_type != 'CHGREQ'){
                console.log("project_code: ", project_code, " project_type: ", project_type);
                 result = await pool.query('SELECT count(*) qty FROM public.ssi_quotation \
                                             WHERE upper(project_code) = upper($1)\
                                               AND project_type = $2', [project_code, project_type]);
            }else {
                if(project_chgreq_code == '' && project_type == 'CHGREQ'){
                     result = await pool.query('SELECT 1 qty');
                    res.json({ data: result.rows[0], message: 'Debe ingresar el código del Change Request.' });
                }else{
                    if(project_chgreq_code != '' && project_type != 'CHGREQ'){
                         result = await pool.query('SELECT 1 qty ' );
                        res.json({ data: result.rows[0], message: 'Solo debe ingresar el código del Change Request si se trata de requerimientos del mismo tipo caso contrario dejar vacío ese campo.' });
                    }else{                        
                        if(project_chgreq_code != '' ){ 
                             result = await pool.query('SELECT count(*) qty FROM public.ssi_quotation \
                                                        WHERE upper(project_code) = upper($1)\
                                                          AND upper(project_chgreq_code) = upper($2)\
                                                          AND project_type = $3', [project_code, project_chgreq_code, project_type]);                        
                        }
                    }
                }
            }
            console.log("Result:", result.rows[0].qty)   
            if( result.rows[0].qty == 0){
                console.log("Entro aqui--------")
                try {
                    const result2 = await pool.query('INSERT INTO public.ssi_quotation( client, responsible, date, status, total_effort, project_code, project_type,link_jira,project_chgreq_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [
                        client,
                        responsible,
                        date,
                        status,
                        total_effort,
                        project_code,
                        project_type,
                        link_jira,
                        project_chgreq_code
                    ]);
        
                    res.json({ data: result2.rows[0], message: 'Cotizacion registrada correctamente' });
        
                } catch (error) {
                    next(error);
                }
            }else{
                //console.log("Entro------------------",  result.rows[0].qty)
                res.json({ data: result.rows[0], message: 'Ya existe un registro para este requerimiento: ' + project_code});
            }
        }else{
            //console.log("Entro old rec------------------",  result.rows[0].qty)
            res.json({ data: result.rows[0], message: 'Ya existe un registro para este requerimiento en el sistema antiguo: ' + project_code});
        }
    } catch (error) {
        next(error);
    }

}

const updatessiQuotation = async (req, res, next) => {
    const { id_quotation, id_order, client, responsible, date, status, total_effort, project_type, link_jira, project_chgreq_code } = req.body;

    try {
        const result = await pool.query('UPDATE public.ssi_quotation \
                                         SET id_order = $2,\
                                            client = $3,\
                                            responsible = $4,\
                                            date = $5,\
                                            status = $6,\
                                            total_effort = $7,\
                                            project_type = $8,\
                                            link_jira = $9,\
                                            project_chgreq_code = $10\
                                        WHERE id_quotation = $1 RETURNING *', [id_quotation, id_order, client, responsible, date, status, total_effort, project_type, link_jira, project_chgreq_code]);

        res.json({ data: result.rows[0], message: 'Cotizacion actualizada correctamente' });

    } catch (error) {
        next(error);
        // res.json({ error: error.message }); //esto solo en desarrollo en produccion un 500
    }
}

const insertResourceDetail = async (req, res, next) => {
    //const {id} = req.params;
    console.log('Data recibida', req.body)
    const { id_quotation, id_order, client, responsible, date, status, total_effort, project_type, project_code, link_jira, project_chgreq_code, Campos } = req.body;
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
                                         project_code = $9, \
                                         link_jira = $10,\
                                         project_chgreq_code = $11\
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
                                                project_chgreq_code
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

            /*const resultins = await pool.query('INSERT INTO public.ssi_resources_permissions(id_resource,year,month,week,days,state,rec_date)\
                                                VALUES (id_resource,year,month,week,days,state,rec_date) RETURNING *', [
                                                    detalle[index].id_resource, 
                                                    detalle[index].year, 
                                                    detalle[index].month, 
                                                    detalle[index].week, 
                                                    detalle[index].days, 
                                                    detalle[index].state
                                            ]);*/
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
        const result = await pool.query("SELECT id_resource, year, month, week,\
                                                ROUND(hoursassigned/8,3) AS daysassigned, hoursassigned,\
                                                ROUND(hoursassigned_f/8,3) AS daysassignedfcast,  hoursassigned_f AS hoursassignedfcast,\
                                                daysVacation daysVacation, ROUND(daysVacation*8,3) hoursVacation,\
                                                totaldaysnotassigned - daysVacation totaldaysnotassigned, totalhoursnotassigned - ROUND(daysVacation*8,3) totalhoursnotassigned,\
                                                totaleffortHoursResource\
                                        FROM\
                                        (	SELECT id_resource, year, month, week,\
                                                ROUND(COALESCE((SELECT sum(effort) FROM public.ssi_resource_allocation\
                                                WHERE id_resource = ra.id_resource AND year = ra.year AND month = ra.month AND week =  ra.week AND state = 'ASGND'	GROUP BY id_resource, year, month, week),0),3) hoursassigned,\
                                                ROUND(COALESCE((SELECT sum(effort) FROM public.ssi_resource_allocation WHERE id_resource = ra.id_resource AND year = ra.year AND month = ra.month AND week = ra.week AND state = 'FCAST' GROUP BY id_resource, year, month, week),0),3) hoursassigned_f,\
                                                ROUND(COALESCE((SELECT count(day) FROM PUBLIC.ssi_resources_permissions WHERE id_resource = ra.id_resource and year = ra.year AND month = ra.month AND week = ra.week),0),0) daysVacation,\
                                                ROUND(COALESCE((SELECT DISTINCT labourdaysinweek - sum(effort)/8 FROM public.ssi_dim_date WHERE year = ra.year AND month = ra.month AND weekofyear =  ra.week AND isweekday = true),0),3) totaldaysnotassigned,\
                                                ROUND(COALESCE((SELECT DISTINCT labourhoursinweek- sum(effort) FROM public.ssi_dim_date WHERE year = ra.year AND month = ra.month AND weekofyear =  ra.week AND isweekday = true),0),3) totalhoursnotassigned,\
                                                sum(ra.effort) totaleffortHoursResource\
                                            FROM public.ssi_resource_allocation ra\
                                            WHERE id_resource = $1 AND year = $2 AND month = $3 AND week = $4\
                                            GROUP BY id_resource, year, month, week\
                                        ) r;", [presource, pyear, pmonth, pweek])
        console.log('parametros',req.params)
        if(result.rows.length === 0){
            const resultn = await pool.query("SELECT null id_resource, year, month, week, 0 daysassigned, hoursassigned, 0 daysassignedfcast, 0 hoursassignedfcast,\
                                                    daysVacation, (daysVacation*8) hoursVacation, (labourdaysinweek*8 - daysVacation) totaldaysnotassigned, (labourdaysinweek*8  - daysVacation*8)  totalhoursnotassigned,	totaleffortHoursResource\
                                            FROM\
                                            (	SELECT DISTINCT labourdaysinweek, null id_resource, year, month, weekofyear week, 0 hoursassigned, 0 hoursassigned_f,\
                                                       ROUND(COALESCE((SELECT count(day) FROM PUBLIC.ssi_resources_permissions WHERE id_resource = $1 and year = d.year AND month = d.month AND week = d.weekofyear),0),0) daysVacation,\
                                                       0 totaleffortHoursResource\
                                                FROM public.ssi_dim_date d\
                                                WHERE year = $2 AND month = $3 AND weekofyear = $4 AND isweekday = true\
                                                GROUP BY labourdaysinweek, year, month, weekofyear, isweekday\
                                            ) r;", [presource, pyear, pmonth, pweek])
                
            //res.json({data:resultn.rows, message: 'El usuario no tiene horas registradas'});
            res.json(resultn.rows);
            //console.log('---',resultn)
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
    //console.log('search---------', req.body)
    
    const { client,responsible,project_code,project_type,status,date_start,date_end,ordenarPor,total_effort} = req.body;

    let sql = "SELECT id_quotation, id_order, client, responsible, date,\
                    (SELECT description FROM PUBLIC.ssi_catalog WHERE cod_value = q.status and cod_entity = 'REQUIREMENT') status, \
                    total_effort, project_code, link_jira,\
                    (SELECT description FROM PUBLIC.ssi_catalog WHERE cod_value = q.project_type and cod_entity = 'PROJECT_TYPE') project_type, \
                    CASE WHEN COALESCE((SELECT sum(ra.effort) FROM public.ssi_resource_allocation ra\
                               WHERE id_quotation = q.id_quotation\
                                AND state != 'ASGND'\
                               GROUP BY id_quotation),0) > 0\
	                     THEN 'EN PROGRESO' ELSE '' END inProgress,\
                    project_chgreq_code\
                FROM PUBLIC.ssi_quotation q\
                WHERE 1=1";
    
    if(total_effort != ''){
        sql = sql + " AND total_effort = '" + total_effort + "'";
    }
    if(client != ''){
        sql = sql + " AND client = '" + client + "'";
    }
    if(responsible != ''){
        sql = sql + " AND responsible = '" + responsible + "'";
    }   
    if(project_code != ''){
        sql = sql + " AND project_code like '" + project_code + "%'";
    }
    if(project_type != ''){
        sql = sql + " AND project_type = '" + project_type + "'";
    }
    if(status != ''){
        sql = sql + " AND status = '" + status + "'";
    }        
    if(date_start != '' && date_end != ''){
        sql = sql + " AND date BETWEEN '"+ date_start + "' AND '" + date_end + "'"; 
    }
       
    if (ordenarPor == 'Fecha Ascendente') {
        sql = sql + " ORDER BY date ASC";
    } else if (ordenarPor == 'Fecha Descendente') {
        sql = sql + " ORDER BY date DESC";
    } else{
        sql = sql + " ORDER BY date DESC";
    } 

    
    try {
        //console.log('-------------SQL:', sql);   

        const result = await pool.query(sql)
        //console.log('query');
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
