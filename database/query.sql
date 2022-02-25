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

CREATE TABLE ssi_quotation(
    id_quotation SERIAL NOT NULL,
    id_order CHARACTER VARYING (20),
    client CHARACTER VARYING (50),
    responsible CHARACTER VARYING (100),
    date DATE,
    status CHARACTER VARYING (20),
    total_effort NUMERIC (20, 2),
     PRIMARY KEY (id_quotation)
);

CREATE TABLE ssi_quotation_detail (
    id_quotation_detail SERIAL NOT NULL,
    id_quotation INTEGER,
    role CHARACTER VARYING (30),
    effort NUMERIC (20, 2),
    PRIMARY KEY (id_quotation_detail)
);


CREATE TABLE public."ssi_quotation"
(
   "id_quotation"    SERIAL NOT NULL,
   "id_order"        CHARACTER VARYING (20),
   "client"          CHARACTER VARYING (50),
   "responsible"     CHARACTER VARYING (100),
   "date"            DATE,
   "status"          CHARACTER VARYING (20),
   "total_effort"    NUMERIC (20, 2),
   "project_code"    CHARACTER VARYING (30),
   PRIMARY KEY ("id_quotation")
);

CREATE TABLE public."ssi_quotation_detail"
(
   "id_quotation_detail"    SERIAL NOT NULL,
   "id_quotation"           INTEGER,
   "role"                   CHARACTER VARYING (30),
   "effort"                 NUMERIC (20, 2),
   PRIMARY KEY ("id_quotation_detail")
);

-- CREATE TABLE public."ssi_quotation_detail"
-- (
--    "id_quotation_detail"    SERIAL NOT NULL,
--    "id_order"               CHARACTER VARYING (20),
--    "role"                   CHARACTER VARYING (30),
--    "effort"                 NUMERIC (20, 2),
--    PRIMARY KEY ("id_quotation_detail")
-- );

CREATE TABLE public."ssi_quotation_vista"
(
   "id_quotation_vista"     SERIAL NOT NULL,
   "sale_order"             CHARACTER VARYING (20),
   "effort"                 NUMERIC (20, 2),
   "portfolio"              CHARACTER VARYING (100),
   "state"                  CHARACTER VARYING (20),
   "login"                  CHARACTER VARYING (100),
   "project_code"           CHARACTER VARYING (30),
   "partner_name"           CHARACTER VARYING (50),
   PRIMARY KEY ("id_quotation_vista")
);