CREATE DATABASE ssidb;

CREATE TABLE ssiCotizacion(
    id_ssiCotizacion SERIAL PRIMARY KEY,
    numero_cotizacion INT UNIQUE,
    cliente VARCHAR(255),
    responsable VARCHAR(255),
    fecha VARCHAR(255),
    total_horas INT,
    estado VARCHAR(20),
);

CREATE TABLE ssiCotizacionDetalle(
    id_ssiCotizacionDetalle SERIAL PRIMARY KEY,
    id_ssiCotizacion INT,
    rol VARCHAR(255),
    horas INT,
    estadoActivo VARCHAR(20),
);


CREATE TABLE ssiCotizacionDetalleLog(
    id_ssiCotizacionDetalleLog SERIAL PRIMARY KEY,
    id_ssiCotizacion INT,
    rol VARCHAR(255),
    horas INT,
    estado VARCHAR(255)
);

-- \l >Comando para ver las bases de datos registradas
-- \c NAMEDB >Cambia de base da datos

-- Query`s
-- SELECT * FROM NAMETABLE;  > Seleccionar todo de la tabla
SELECT * FROM ssiCotizacionDetalle, ssiCotizacion WHERE id_ssicotizacion = 1;

SELECT *
FROM ssiCotizacion S JOIN ssiCotizacionDetalle D ON S.id_ssicotizacion = D.id_ssicotizacion
WHERE D.id_ssiCotizacion = 1;


-- Seleccionar la cotizacion y el detalle de uno solo
SELECT *
FROM ssiCotizacion S JOIN ssiCotizacionDetalle D ON S.numero_cotizacion = D.id_ssicotizacion
WHERE D.id_ssiCotizacion = 1021; 

SELECT *
FROM ssiCotizacion S JOIN ssiCotizacionDetalle D ON S.numero_cotizacion = D.id_ssicotizacion
JOIN ssiCotizacionDetalleLog H ON H.id_ssiCotizacion = D.id_ssicotizacion
WHERE D.id_ssiCotizacion = 1021;

SELECT S.id_ssicotizacion, numero_cotizacion, rol 
FROM ssiCotizacion S, ssiCotizacionDetalle D 
WHERE S.id_ssicotizacion = D.id_ssicotizacion;

SELECT S.id_ssicotizacion, D.id_ssicotizacion, numero_cotizacion, cliente, responsable, fecha, rol, horas 
FROM ssiCotizacion S, ssiCotizacionDetalle D 
WHERE S.id_ssicotizacion = 1 and D.id_ssicotizacion = 1;

SELECT S.id_ssicotizacion, D.id_ssicotizacion, numero_cotizacion, rol, horas
FROM ssiCotizacion S JOIN ssiCotizacionDetalle D ON S.id_ssicotizacion = D.id_ssicotizacion
WHERE D.id_ssiCotizacion = 1;


-- ALTER TABLE ssiCotizacionDetalle RENAME COLUMN id_cotizacion TO id_ssicotizacion; >Cambiar el nombre de una Columna en una tabla

-- DELETE
DELETE FROM ssiCotizacion WHERE id_ssicotizacion = 7;

ALTER TABLE ssiCotizacionDetalleLog
ADD horas INT;

ALTER TABLE ssiCotizacionDetalleLog
DROP COLUMN horas;
