const { Router } = require('express');

const { getAllssiClients, getAllssiResources, getAllssiCatalogProjectType, getAllssiCatalogRequirement, getAllssiCatalogResource, getAllWeeksByYear, getAllMonths, getAllYears,updatessiQuotation, createssiQuotation, insertResourceDetail, updateResourceDetail, getResourceAllocationDetail, getLabourDaysInformation, getResourceDetailByQuotationId, getInformationByFilters } = require('../controllers/ssiCotizacionLectura.controller');
const { getAllssiCotizacion, createssiCotizacion, getssiCotizacion, updatessiCotizacion, updatessiCotizacionStatus, deletessiCotizacion, getCantQuotation, getQuotationOne } = require('../controllers/ssiCotizacion.controller');
const { getAllssiCotizacionDetalle, createssiCotizacionDetalle, getssiCotizacionDetalle, deletessiCotizacionDetalle, updatessiCotizacionDetalle } = require('../controllers/ssiCotizacionDetalle.controller');
const { getAllssiCotizacionDetalleLog, createssiCotizacionDetalleLog, getssiCotizacionDetalleLog, deletessiCotizacionDetalleLog } = require('../controllers/ssiCotizacionDetalleLog.controller');
const { getAllssiCotizacionVista, getssiCotizacionVista } = require('../controllers/ssiCotizacionVista.controller');
const { getAllssiRol } = require('../controllers/ssiRoles.controller');

const { SendEmail } = require('../controllers/ssiSendEmail');
const { APIJiraAsses, APIJiraExec } = require('../controllers/APIJira');


const pool = require('../db');

const router = Router();

// router.get('/tasks', async(req, res) =>{
//     const result = await pool.query('SELECT NOW()');
//     res.json(result.rows[0].now)
// });

router.get('/ssiCotizacion', getAllssiCotizacion);

router.get('/ssiCotizacion/:id', getssiCotizacion);

router.post('/ssiCotizacion', createssiCotizacion);

router.put('/ssiCotizacion/:id', updatessiCotizacion);

router.put('/ssiCotizacionStatus/:id', updatessiCotizacionStatus);

router.delete('/ssiCotizacion/:id', deletessiCotizacion);

router.get('/ssiCantQuotation', getCantQuotation);

router.get('/ssiQuotationOne/:id', getQuotationOne);


// ROUTES DE COTIZACION-DETALLE
router.get('/ssiCotizacionDetalle', getAllssiCotizacionDetalle);

router.get('/ssiCotizacionDetalle/:id', getssiCotizacionDetalle);

router.post('/ssiCotizacionDetalle', createssiCotizacionDetalle);

router.put('/ssiCotizacionDetalle/:id', updatessiCotizacionDetalle);

router.delete('/ssiCotizacionDetalle/:id', deletessiCotizacionDetalle);


// ROUTES DE COTIZACION-DETALLE-LOG
router.get('/ssiCotizacionDetalleLog', getAllssiCotizacionDetalleLog);

router.get('/ssiCotizacionDetalleLog/:id', getssiCotizacionDetalleLog);

router.post('/ssiCotizacionDetalleLog', createssiCotizacionDetalleLog);

router.delete('/ssiCotizacionDetalleLog/:id', deletessiCotizacionDetalleLog);

// ROUTES DE COTIZACION VISTA
router.get('/ssiCotizacionVista', getAllssiCotizacionVista);

router.get('/ssiCotizacionVista/:id', getssiCotizacionVista);

// ROUTES DE ROL
router.get('/ssiCotizacionRol', getAllssiRol)

// ROUTES DE LECTURA (/ssiCotizacionLectura)
router.get('/ssiCotizacionClients', getAllssiClients)
router.get('/ssiCotizacionResources', getAllssiResources)
router.get('/ssiCotizacionCatProjectType', getAllssiCatalogProjectType)
router.get('/ssiCotizacionCatRequirement', getAllssiCatalogRequirement)
router.get('/ssiCotizacionCatResource', getAllssiCatalogResource)
//cotizacion
router.post('/ssiCotizacionCreatesQuotation', createssiQuotation)
router.post('/ssiCotizacionUpdatessiQuotation', updatessiQuotation)
//detalle
router.post('/ssiCotizacion/InsertResourceDetail', insertResourceDetail)
router.post('/ssiCotizacion/UpdateResourceDetail', updateResourceDetail)
router.get('/ssiCotizacionGetResourceByQuotationId/:pidquotation', getResourceDetailByQuotationId)
router.get('/ssiCotizacionGetResourceAllocationDetail/:presource/:pyear/:pmonth/:pweek', getResourceAllocationDetail)

//Date
router.get('/ssiCotizacionGetLabourDaysInformation/:pyear/:pmonth/:pweek', getLabourDaysInformation)
router.get('/ssiCotizacionGetWeeksOfyear/:pyear/:pmonth', getAllWeeksByYear) 
router.get('/ssiCotizacionGetMonths/:pyear', getAllMonths)
router.get('/ssiCotizacionGetYears', getAllYears);

//Filters
router.get('/ssiCotizacionGetInformationByFilters/:pclient/:presponsible/:pprojectcode/:pprojectctype/:pstatus/:pstartdate/:penddate/:porderfield/:pdesasc', getInformationByFilters)
router.post('/ssiCotizacionGetInformationByFilters/', getInformationByFilters)

//SenEmail
router.post('/sedEmail', SendEmail)

//Jira
router.post('/APIJiraAsses', APIJiraAsses);
router.post('/APIJiraExec', APIJiraExec);

module.exports = router;