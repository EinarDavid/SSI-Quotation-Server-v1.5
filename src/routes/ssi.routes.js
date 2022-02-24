const { Router } = require('express');

const { getAllssiCotizacion, createssiCotizacion, getssiCotizacion, updatessiCotizacion } = require('../controllers/ssiCotizacion.controller');
const { getAllssiCotizacionDetalle, createssiCotizacionDetalle, getssiCotizacionDetalle, deletessiCotizacionDetalle, updatessiCotizacionDetalle } = require('../controllers/ssiCotizacionDetalle.controller');
const { getAllssiCotizacionDetalleLog, createssiCotizacionDetalleLog, getssiCotizacionDetalleLog, deletessiCotizacionDetalleLog } = require('../controllers/ssiCotizacionDetalleLog.controller');

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

module.exports = router;