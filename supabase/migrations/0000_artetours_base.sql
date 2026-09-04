CREATE SCHEMA IF NOT EXISTS artetours;
SET search_path TO artetours;

-- ============================================================  
-- ============================================================  
--                    ARTETOURS  
--       SISTEMA DE GESTIÓN TURÍSTICA  
--             BASE DE DATOS POSTGRESQL  
-- ============================================================  
-- ============================================================

-- ============================================================  
-- 0. LIMPIEZA OPCIONAL  
-- ============================================================  
-- DESCOMENTA ESTAS LÍNEAS SOLAMENTE SI QUIERES ELIMINAR  
-- UNA BASE DE DATOS ARTETOURS ANTERIOR.  
--  
-- ADVERTENCIA:  
-- ESTO ELIMINARÁ TODAS LAS TABLAS, DATOS Y TIPOS DEL ESQUEMA.  
--  
-- DROP SCHEMA IF EXISTS artetours CASCADE;  
-- CREATE SCHEMA artetours;  
-- SET search_path TO artetours;

-- ============================================================  
-- 1. TIPOS ENUM  
-- ============================================================

CREATE TYPE estado_usuario AS ENUM (  
    'ACTIVO',  
    'INACTIVO',  
    'BLOQUEADO'  
);

CREATE TYPE estado_tour AS ENUM (  
    'BORRADOR',  
    'ACTIVO',  
    'INACTIVO'  
);

CREATE TYPE estado_salida AS ENUM (  
    'PROGRAMADA',  
    'DISPONIBLE',  
    'COMPLETA',  
    'CANCELADA',  
    'FINALIZADA'  
);

CREATE TYPE estado_reserva AS ENUM (  
    'PENDIENTE',  
    'CONFIRMADA',  
    'CANCELADA',  
    'COMPLETADA'  
);

CREATE TYPE estado_venta AS ENUM (  
    'PENDIENTE',  
    'PARCIAL',  
    'PAGADA',  
    'CANCELADA'  
);

CREATE TYPE estado_factura AS ENUM (  
    'PENDIENTE',  
    'EMITIDA',  
    'ANULADA'  
);

CREATE TYPE tipo_documento AS ENUM (  
    'CC',  
    'CE',  
    'PASAPORTE',  
    'TI',  
    'PEP',  
    'PPT'  
);

CREATE TYPE genero AS ENUM (  
    'MASCULINO',  
    'FEMENINO',  
    'NO_BINARIO',  
    'OTRO',  
    'PREFIERE_NO_DECIR'  
);

CREATE TYPE tipo_token AS ENUM (  
    'VERIFICACION_EMAIL',  
    'RECUPERACION_PASSWORD'  
);

-- ============================================================  
-- 2. TABLA: USUARIOS  
-- ============================================================

CREATE TABLE usuarios (  
    id_usuario BIGINT GENERATED ALWAYS AS IDENTITY,

    nombre VARCHAR(100) NOT NULL,  
    apellido VARCHAR(100) NOT NULL,

    correo VARCHAR(150) NOT NULL,  
    telefono VARCHAR(30),

    password_hash TEXT NOT NULL,

    estado estado_usuario NOT NULL DEFAULT 'ACTIVO',

    correo_verificado BOOLEAN NOT NULL DEFAULT FALSE,

    ultimo_acceso TIMESTAMPTZ,

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuarios  
        PRIMARY KEY (id_usuario),

    CONSTRAINT uq_usuarios_correo  
        UNIQUE (correo),

    CONSTRAINT chk_usuarios_correo  
        CHECK (correo = LOWER(correo))  
);

-- ============================================================  
-- 3. TABLA: ROLES  
-- ============================================================

CREATE TABLE roles (  
    id_rol BIGINT GENERATED ALWAYS AS IDENTITY,

    nombre VARCHAR(50) NOT NULL,

    descripcion VARCHAR(255),

    CONSTRAINT pk_roles  
        PRIMARY KEY (id_rol),

    CONSTRAINT uq_roles_nombre  
        UNIQUE (nombre)  
);

-- ============================================================  
-- 4. TABLA: PERMISOS  
-- ============================================================

CREATE TABLE permisos (  
    id_permiso BIGINT GENERATED ALWAYS AS IDENTITY,

    nombre VARCHAR(100) NOT NULL,

    descripcion VARCHAR(255),

    CONSTRAINT pk_permisos  
        PRIMARY KEY (id_permiso),

    CONSTRAINT uq_permisos_nombre  
        UNIQUE (nombre)  
);

-- ============================================================  
-- 5. TABLA INTERMEDIA: USUARIO_ROLES  
-- RELACIÓN N:M  
-- ============================================================

CREATE TABLE usuario_roles (  
    id_usuario BIGINT NOT NULL,

    id_rol BIGINT NOT NULL,

    CONSTRAINT pk_usuario_roles  
        PRIMARY KEY (id_usuario, id_rol),

    CONSTRAINT fk_usuario_roles_usuario  
        FOREIGN KEY (id_usuario)  
        REFERENCES usuarios(id_usuario)  
        ON DELETE CASCADE,

    CONSTRAINT fk_usuario_roles_rol  
        FOREIGN KEY (id_rol)  
        REFERENCES roles(id_rol)  
        ON DELETE CASCADE  
);

-- ============================================================  
-- 6. TABLA INTERMEDIA: ROL_PERMISOS  
-- RELACIÓN N:M  
-- ============================================================

CREATE TABLE rol_permisos (  
    id_rol BIGINT NOT NULL,

    id_permiso BIGINT NOT NULL,

    CONSTRAINT pk_rol_permisos  
        PRIMARY KEY (id_rol, id_permiso),

    CONSTRAINT fk_rol_permisos_rol  
        FOREIGN KEY (id_rol)  
        REFERENCES roles(id_rol)  
        ON DELETE CASCADE,

    CONSTRAINT fk_rol_permisos_permiso  
        FOREIGN KEY (id_permiso)  
        REFERENCES permisos(id_permiso)  
        ON DELETE CASCADE  
);

-- ============================================================  
-- 7. TABLA: TURISTAS  
-- ============================================================

CREATE TABLE turistas (  
    id_turista BIGINT NOT NULL,

    tipo_documento tipo_documento NOT NULL,

    numero_documento VARCHAR(30) NOT NULL,

    fecha_nacimiento DATE,

    genero genero,

    nacionalidad VARCHAR(100),

    pais_residencia VARCHAR(100),

    ciudad_residencia VARCHAR(100),

    direccion VARCHAR(255),

    contacto_emergencia_nombre VARCHAR(150),

    contacto_emergencia_telefono VARCHAR(30),

    contacto_emergencia_parentesco VARCHAR(50),

    preferencias TEXT,

    observaciones TEXT,

    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_turistas  
        PRIMARY KEY (id_turista),

    CONSTRAINT fk_turistas_usuario  
        FOREIGN KEY (id_turista)  
        REFERENCES usuarios(id_usuario)  
        ON DELETE CASCADE,

    CONSTRAINT uq_turistas_documento  
        UNIQUE (tipo_documento, numero_documento),

    CONSTRAINT chk_turistas_fecha_nacimiento  
        CHECK (  
            fecha_nacimiento IS NULL  
            OR fecha_nacimiento <= CURRENT_DATE  
        )  
);

-- ============================================================  
-- 8. TABLA: GUIAS  
-- ============================================================

CREATE TABLE guias (  
    id_guia BIGINT NOT NULL,

    tipo_documento tipo_documento NOT NULL,

    numero_documento VARCHAR(30) NOT NULL,

    fecha_nacimiento DATE,

    genero genero,

    nacionalidad VARCHAR(100),

    pais_residencia VARCHAR(100),

    ciudad_residencia VARCHAR(100),

    direccion VARCHAR(255),

    especialidad VARCHAR(150),

    biografia TEXT,

    experiencia_anios INTEGER,

    certificaciones TEXT,

    foto_url TEXT,

    disponibilidad BOOLEAN NOT NULL DEFAULT TRUE,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_guias  
        PRIMARY KEY (id_guia),

    CONSTRAINT fk_guias_usuario  
        FOREIGN KEY (id_guia)  
        REFERENCES usuarios(id_usuario)  
        ON DELETE CASCADE,

    CONSTRAINT uq_guias_documento  
        UNIQUE (tipo_documento, numero_documento),

    CONSTRAINT chk_guias_experiencia  
        CHECK (  
            experiencia_anios IS NULL  
            OR experiencia_anios >= 0  
        ),

    CONSTRAINT chk_guias_fecha_nacimiento  
        CHECK (  
            fecha_nacimiento IS NULL  
            OR fecha_nacimiento <= CURRENT_DATE  
        )  
);

-- ============================================================  
-- 9. TABLA: IDIOMAS  
-- ============================================================

CREATE TABLE idiomas (  
    id_idioma BIGINT GENERATED ALWAYS AS IDENTITY,

    nombre VARCHAR(100) NOT NULL,

    CONSTRAINT pk_idiomas  
        PRIMARY KEY (id_idioma),

    CONSTRAINT uq_idiomas_nombre  
        UNIQUE (nombre)  
);

-- ============================================================  
-- 10. TABLA INTERMEDIA: GUIA_IDIOMAS  
-- RELACIÓN N:M  
-- ============================================================

CREATE TABLE guia_idiomas (  
    id_guia BIGINT NOT NULL,

    id_idioma BIGINT NOT NULL,

    nivel VARCHAR(50),

    CONSTRAINT pk_guia_idiomas  
        PRIMARY KEY (id_guia, id_idioma),

    CONSTRAINT fk_guia_idiomas_guia  
        FOREIGN KEY (id_guia)  
        REFERENCES guias(id_guia)  
        ON DELETE CASCADE,

    CONSTRAINT fk_guia_idiomas_idioma  
        FOREIGN KEY (id_idioma)  
        REFERENCES idiomas(id_idioma)  
        ON DELETE CASCADE  
);

-- ============================================================  
-- 11. TABLA: CERTIFICACIONES  
-- ============================================================

CREATE TABLE certificaciones (  
    id_certificacion BIGINT GENERATED ALWAYS AS IDENTITY,

    nombre VARCHAR(150) NOT NULL,

    entidad_emisora VARCHAR(150),

    CONSTRAINT pk_certificaciones  
        PRIMARY KEY (id_certificacion),

    CONSTRAINT uq_certificaciones_nombre  
        UNIQUE (nombre)  
);

-- ============================================================  
-- 12. TABLA INTERMEDIA: GUIA_CERTIFICACIONES  
-- RELACIÓN N:M  
-- ============================================================

CREATE TABLE guia_certificaciones (  
    id_guia BIGINT NOT NULL,

    id_certificacion BIGINT NOT NULL,

    fecha_obtencion DATE,

    fecha_vencimiento DATE,

    numero_certificado VARCHAR(100),

    CONSTRAINT pk_guia_certificaciones  
        PRIMARY KEY (id_guia, id_certificacion),

    CONSTRAINT fk_guia_certificaciones_guia  
        FOREIGN KEY (id_guia)  
        REFERENCES guias(id_guia)  
        ON DELETE CASCADE,

    CONSTRAINT fk_guia_certificaciones_certificacion  
        FOREIGN KEY (id_certificacion)  
        REFERENCES certificaciones(id_certificacion)  
        ON DELETE CASCADE,

    CONSTRAINT chk_certificacion_fechas  
        CHECK (  
            fecha_vencimiento IS NULL  
            OR fecha_obtencion IS NULL  
            OR fecha_vencimiento >= fecha_obtencion  
        )  
);

-- ============================================================  
-- 13. TABLA: CATEGORIAS_TOUR  
-- ============================================================

CREATE TABLE categorias_tour (  
    id_categoria BIGINT GENERATED ALWAYS AS IDENTITY,

    nombre VARCHAR(100) NOT NULL,

    descripcion VARCHAR(255),

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_categorias_tour  
        PRIMARY KEY (id_categoria),

    CONSTRAINT uq_categorias_tour_nombre  
        UNIQUE (nombre)  
);

-- ============================================================  
-- 14. TABLA: TOURS  
-- ============================================================

CREATE TABLE tours (  
    id_tour BIGINT GENERATED ALWAYS AS IDENTITY,

    id_categoria BIGINT NOT NULL,

    nombre VARCHAR(150) NOT NULL,

    descripcion TEXT NOT NULL,

    duracion_horas NUMERIC(5,2) NOT NULL,

    precio_base NUMERIC(12,2) NOT NULL,

    punto_encuentro VARCHAR(255) NOT NULL,

    destino VARCHAR(255),

    latitud NUMERIC(9,6),

    longitud NUMERIC(9,6),

    dificultad VARCHAR(50),

    edad_minima INTEGER,

    edad_maxima INTEGER,

    capacidad_maxima INTEGER,

    incluye TEXT,

    no_incluye TEXT,

    recomendaciones TEXT,

    politica_cancelacion TEXT,

    estado estado_tour NOT NULL DEFAULT 'BORRADOR',

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_tours  
        PRIMARY KEY (id_tour),

    CONSTRAINT fk_tours_categoria  
        FOREIGN KEY (id_categoria)  
        REFERENCES categorias_tour(id_categoria)  
        ON DELETE RESTRICT,

    CONSTRAINT chk_tours_duracion  
        CHECK (duracion_horas > 0),

    CONSTRAINT chk_tours_precio  
        CHECK (precio_base >= 0),

    CONSTRAINT chk_tours_edad_minima  
        CHECK (  
            edad_minima IS NULL  
            OR edad_minima >= 0  
        ),

    CONSTRAINT chk_tours_edad_maxima  
        CHECK (  
            edad_maxima IS NULL  
            OR edad_minima IS NULL  
            OR edad_maxima >= edad_minima  
        ),

    CONSTRAINT chk_tours_capacidad  
        CHECK (  
            capacidad_maxima IS NULL  
            OR capacidad_maxima > 0  
        ),

    CONSTRAINT chk_tours_latitud  
        CHECK (  
            latitud IS NULL  
            OR latitud BETWEEN -90 AND 90  
        ),

    CONSTRAINT chk_tours_longitud  
        CHECK (  
            longitud IS NULL  
            OR longitud BETWEEN -180 AND 180  
        )  
);

-- ============================================================  
-- 15. TABLA: TOUR_REQUISITOS  
-- ============================================================

CREATE TABLE tour_requisitos (  
    id_requisito BIGINT GENERATED ALWAYS AS IDENTITY,

    id_tour BIGINT NOT NULL,

    descripcion VARCHAR(255) NOT NULL,

    CONSTRAINT pk_tour_requisitos  
        PRIMARY KEY (id_requisito),

    CONSTRAINT fk_tour_requisitos_tour  
        FOREIGN KEY (id_tour)  
        REFERENCES tours(id_tour)  
        ON DELETE CASCADE,

    CONSTRAINT uq_tour_requisito  
        UNIQUE (id_tour, descripcion)  
);

-- ============================================================  
-- 16. TABLA: TOUR_IMAGENES  
-- ============================================================

CREATE TABLE tour_imagenes (  
    id_imagen BIGINT GENERATED ALWAYS AS IDENTITY,

    id_tour BIGINT NOT NULL,

    url TEXT NOT NULL,

    titulo VARCHAR(150),

    descripcion VARCHAR(255),

    principal BOOLEAN NOT NULL DEFAULT FALSE,

    orden INTEGER NOT NULL DEFAULT 1,

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_tour_imagenes  
        PRIMARY KEY (id_imagen),

    CONSTRAINT fk_tour_imagenes_tour  
        FOREIGN KEY (id_tour)  
        REFERENCES tours(id_tour)  
        ON DELETE CASCADE,

    CONSTRAINT chk_tour_imagenes_orden  
        CHECK (orden > 0)  
);

-- ============================================================  
-- 17. TABLA: SALIDAS_TOUR  
-- ============================================================

CREATE TABLE salidas_tour (  
    id_salida BIGINT GENERATED ALWAYS AS IDENTITY,

    id_tour BIGINT NOT NULL,

    id_guia BIGINT,

    fecha_salida DATE NOT NULL,

    hora_salida TIME NOT NULL,

    hora_finalizacion TIME,

    cupo_maximo INTEGER NOT NULL,

    cupos_disponibles INTEGER NOT NULL,

    estado estado_salida NOT NULL DEFAULT 'PROGRAMADA',

    observaciones TEXT,

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_salidas_tour  
        PRIMARY KEY (id_salida),

    CONSTRAINT fk_salidas_tour_tour  
        FOREIGN KEY (id_tour)  
        REFERENCES tours(id_tour)  
        ON DELETE RESTRICT,

    CONSTRAINT fk_salidas_tour_guia  
        FOREIGN KEY (id_guia)  
        REFERENCES guias(id_guia)  
        ON DELETE SET NULL,

    CONSTRAINT uq_salida_tour_fecha_hora  
        UNIQUE (  
            id_tour,  
            fecha_salida,  
            hora_salida  
        ),

    CONSTRAINT chk_salida_cupo_maximo  
        CHECK (cupo_maximo > 0),

    CONSTRAINT chk_salida_cupos_disponibles  
        CHECK (  
            cupos_disponibles >= 0  
            AND cupos_disponibles <= cupo_maximo  
        ),

    CONSTRAINT chk_salida_horas  
        CHECK (  
            hora_finalizacion IS NULL  
            OR hora_finalizacion > hora_salida  
        )  
);

-- ============================================================  
-- 18. TABLA: RESERVAS  
-- ============================================================

CREATE TABLE reservas (  
    id_reserva BIGINT GENERATED ALWAYS AS IDENTITY,

    codigo_reserva VARCHAR(30) NOT NULL,

    id_turista BIGINT NOT NULL,

    id_salida BIGINT NOT NULL,

    cantidad_adultos INTEGER NOT NULL DEFAULT 1,

    cantidad_ninos INTEGER NOT NULL DEFAULT 0,

    precio_unitario NUMERIC(12,2) NOT NULL,

    descuento NUMERIC(12,2) NOT NULL DEFAULT 0,

    subtotal NUMERIC(12,2) NOT NULL,

    total NUMERIC(12,2) NOT NULL,

    estado estado_reserva NOT NULL DEFAULT 'PENDIENTE',

    fecha_reserva TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_cancelacion TIMESTAMPTZ,

    motivo_cancelacion TEXT,

    observaciones TEXT,

    CONSTRAINT pk_reservas  
        PRIMARY KEY (id_reserva),

    CONSTRAINT uq_reservas_codigo  
        UNIQUE (codigo_reserva),

    CONSTRAINT fk_reservas_turista  
        FOREIGN KEY (id_turista)  
        REFERENCES turistas(id_turista)  
        ON DELETE RESTRICT,

    CONSTRAINT fk_reservas_salida  
        FOREIGN KEY (id_salida)  
        REFERENCES salidas_tour(id_salida)  
        ON DELETE RESTRICT,

    CONSTRAINT chk_reservas_adultos  
        CHECK (cantidad_adultos >= 0),

    CONSTRAINT chk_reservas_ninos  
        CHECK (cantidad_ninos >= 0),

    CONSTRAINT chk_reservas_personas  
        CHECK (  
            cantidad_adultos + cantidad_ninos > 0  
        ),

    CONSTRAINT chk_reservas_precio  
        CHECK (precio_unitario >= 0),

    CONSTRAINT chk_reservas_descuento  
        CHECK (descuento >= 0),

    CONSTRAINT chk_reservas_subtotal  
        CHECK (subtotal >= 0),

    CONSTRAINT chk_reservas_total  
        CHECK (total >= 0),

    CONSTRAINT chk_reservas_cancelacion  
        CHECK (  
            estado <> 'CANCELADA'  
            OR fecha_cancelacion IS NOT NULL  
        )  
);

-- ============================================================  
-- 19. TABLA: RESERVA_PARTICIPANTES  
-- ============================================================

CREATE TABLE reserva_participantes (  
    id_participante BIGINT GENERATED ALWAYS AS IDENTITY,

    id_reserva BIGINT NOT NULL,

    nombres VARCHAR(100) NOT NULL,

    apellidos VARCHAR(100) NOT NULL,

    tipo_documento tipo_documento,

    numero_documento VARCHAR(30),

    fecha_nacimiento DATE,

    nacionalidad VARCHAR(100),

    es_titular BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT pk_reserva_participantes  
        PRIMARY KEY (id_participante),

    CONSTRAINT fk_reserva_participantes_reserva  
        FOREIGN KEY (id_reserva)  
        REFERENCES reservas(id_reserva)  
        ON DELETE CASCADE,

    CONSTRAINT chk_participante_fecha_nacimiento  
        CHECK (  
            fecha_nacimiento IS NULL  
            OR fecha_nacimiento <= CURRENT_DATE  
        )  
);

-- ============================================================  
-- 20. TABLA: GRUPOS  
-- ============================================================

CREATE TABLE grupos (  
    id_grupo BIGINT GENERATED ALWAYS AS IDENTITY,

    nombre VARCHAR(150) NOT NULL,

    descripcion TEXT,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_grupos  
        PRIMARY KEY (id_grupo)  
);

-- ============================================================  
-- 21. TABLA INTERMEDIA: GRUPO_TURISTAS  
-- ============================================================

CREATE TABLE grupo_turistas (  
    id_grupo BIGINT NOT NULL,

    id_turista BIGINT NOT NULL,

    fecha_asignacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_grupo_turistas  
        PRIMARY KEY (id_grupo, id_turista),

    CONSTRAINT fk_grupo_turistas_grupo  
        FOREIGN KEY (id_grupo)  
        REFERENCES grupos(id_grupo)  
        ON DELETE CASCADE,

    CONSTRAINT fk_grupo_turistas_turista  
        FOREIGN KEY (id_turista)  
        REFERENCES turistas(id_turista)  
        ON DELETE CASCADE  
);

-- ============================================================  
-- 22. TABLA INTERMEDIA: GRUPO_TOURS  
-- ============================================================

CREATE TABLE grupo_tours (  
    id_grupo BIGINT NOT NULL,

    id_salida BIGINT NOT NULL,

    fecha_asignacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_grupo_tours  
        PRIMARY KEY (id_grupo, id_salida),

    CONSTRAINT fk_grupo_tours_grupo  
        FOREIGN KEY (id_grupo)  
        REFERENCES grupos(id_grupo)  
        ON DELETE CASCADE,

    CONSTRAINT fk_grupo_tours_salida  
        FOREIGN KEY (id_salida)  
        REFERENCES salidas_tour(id_salida)  
        ON DELETE CASCADE  
);

-- ============================================================  
-- 23. TABLA: METODOS_PAGO  
-- ============================================================

CREATE TABLE metodos_pago (  
    id_metodo_pago BIGINT GENERATED ALWAYS AS IDENTITY,

    nombre VARCHAR(50) NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_metodos_pago  
        PRIMARY KEY (id_metodo_pago),

    CONSTRAINT uq_metodos_pago_nombre  
        UNIQUE (nombre)  
);

-- ============================================================  
-- 24. TABLA: VENTAS  
-- ============================================================

CREATE TABLE ventas (  
    id_venta BIGINT GENERATED ALWAYS AS IDENTITY,

    id_reserva BIGINT NOT NULL,

    numero_venta VARCHAR(30) NOT NULL,

    subtotal NUMERIC(12,2) NOT NULL,

    impuestos NUMERIC(12,2) NOT NULL DEFAULT 0,

    descuento NUMERIC(12,2) NOT NULL DEFAULT 0,

    total NUMERIC(12,2) NOT NULL,

    estado estado_venta NOT NULL DEFAULT 'PENDIENTE',

    fecha_venta TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_ventas  
        PRIMARY KEY (id_venta),

    CONSTRAINT uq_ventas_reserva  
        UNIQUE (id_reserva),

    CONSTRAINT uq_ventas_numero  
        UNIQUE (numero_venta),

    CONSTRAINT fk_ventas_reserva  
        FOREIGN KEY (id_reserva)  
        REFERENCES reservas(id_reserva)  
        ON DELETE RESTRICT,

    CONSTRAINT chk_ventas_subtotal  
        CHECK (subtotal >= 0),

    CONSTRAINT chk_ventas_impuestos  
        CHECK (impuestos >= 0),

    CONSTRAINT chk_ventas_descuento  
        CHECK (descuento >= 0),

    CONSTRAINT chk_ventas_total  
        CHECK (total >= 0)  
);

-- ============================================================  
-- 25. TABLA: ABONOS  
-- ============================================================

CREATE TABLE abonos (  
    id_abono BIGINT GENERATED ALWAYS AS IDENTITY,

    id_venta BIGINT NOT NULL,

    id_metodo_pago BIGINT NOT NULL,

    monto NUMERIC(12,2) NOT NULL,

    referencia VARCHAR(100),

    comprobante_url TEXT,

    fecha_abono TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    observaciones TEXT,

    CONSTRAINT pk_abonos  
        PRIMARY KEY (id_abono),

    CONSTRAINT fk_abonos_venta  
        FOREIGN KEY (id_venta)  
        REFERENCES ventas(id_venta)  
        ON DELETE RESTRICT,

    CONSTRAINT fk_abonos_metodo_pago  
        FOREIGN KEY (id_metodo_pago)  
        REFERENCES metodos_pago(id_metodo_pago)  
        ON DELETE RESTRICT,

    CONSTRAINT chk_abonos_monto  
        CHECK (monto > 0)  
);

-- ============================================================  
-- 26. TABLA: FACTURAS  
-- ============================================================

CREATE TABLE facturas (  
    id_factura BIGINT GENERATED ALWAYS AS IDENTITY,

    id_venta BIGINT NOT NULL,

    numero_factura VARCHAR(50) NOT NULL,

    nombre_cliente VARCHAR(200) NOT NULL,

    tipo_documento tipo_documento NOT NULL,

    numero_documento VARCHAR(30) NOT NULL,

    direccion_cliente VARCHAR(255),

    correo_cliente VARCHAR(150),

    subtotal NUMERIC(12,2) NOT NULL,

    impuestos NUMERIC(12,2) NOT NULL DEFAULT 0,

    total NUMERIC(12,2) NOT NULL,

    estado estado_factura NOT NULL DEFAULT 'PENDIENTE',

    fecha_emision TIMESTAMPTZ,

    observaciones TEXT,

    CONSTRAINT pk_facturas  
        PRIMARY KEY (id_factura),

    CONSTRAINT uq_facturas_venta  
        UNIQUE (id_venta),

    CONSTRAINT uq_facturas_numero  
        UNIQUE (numero_factura),

    CONSTRAINT fk_facturas_venta  
        FOREIGN KEY (id_venta)  
        REFERENCES ventas(id_venta)  
        ON DELETE RESTRICT,

    CONSTRAINT chk_facturas_subtotal  
        CHECK (subtotal >= 0),

    CONSTRAINT chk_facturas_impuestos  
        CHECK (impuestos >= 0),

    CONSTRAINT chk_facturas_total  
        CHECK (total >= 0)  
);

-- ============================================================  
-- 27. TABLA: RESENAS_TOUR  
-- ============================================================

CREATE TABLE resenas_tour (  
    id_resena BIGINT GENERATED ALWAYS AS IDENTITY,

    id_turista BIGINT NOT NULL,

    id_tour BIGINT NOT NULL,

    id_reserva BIGINT,

    calificacion INTEGER NOT NULL,

    comentario TEXT,

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_resenas_tour  
        PRIMARY KEY (id_resena),

    CONSTRAINT fk_resenas_tour_turista  
        FOREIGN KEY (id_turista)  
        REFERENCES turistas(id_turista)  
        ON DELETE CASCADE,

    CONSTRAINT fk_resenas_tour_tour  
        FOREIGN KEY (id_tour)  
        REFERENCES tours(id_tour)  
        ON DELETE CASCADE,

    CONSTRAINT fk_resenas_tour_reserva  
        FOREIGN KEY (id_reserva)  
        REFERENCES reservas(id_reserva)  
        ON DELETE SET NULL,

    CONSTRAINT chk_resenas_tour_calificacion  
        CHECK (calificacion BETWEEN 1 AND 5),

    CONSTRAINT uq_resena_turista_tour  
        UNIQUE (id_turista, id_tour)  
);

-- ============================================================  
-- 28. TABLA: RESENAS_GUIA  
-- ============================================================

CREATE TABLE resenas_guia (  
    id_resena BIGINT GENERATED ALWAYS AS IDENTITY,

    id_turista BIGINT NOT NULL,

    id_guia BIGINT NOT NULL,

    calificacion INTEGER NOT NULL,

    comentario TEXT,

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_resenas_guia  
        PRIMARY KEY (id_resena),

    CONSTRAINT fk_resenas_guia_turista  
        FOREIGN KEY (id_turista)  
        REFERENCES turistas(id_turista)  
        ON DELETE CASCADE,

    CONSTRAINT fk_resenas_guia_guia  
        FOREIGN KEY (id_guia)  
        REFERENCES guias(id_guia)  
        ON DELETE CASCADE,

    CONSTRAINT chk_resenas_guia_calificacion  
        CHECK (calificacion BETWEEN 1 AND 5),

    CONSTRAINT uq_resena_turista_guia  
        UNIQUE (id_turista, id_guia)  
);

-- ============================================================  
-- 29. TABLA: GUIAS_FAVORITOS  
-- ============================================================

CREATE TABLE guias_favoritos (  
    id_turista BIGINT NOT NULL,

    id_guia BIGINT NOT NULL,

    fecha_agregado TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_guias_favoritos  
        PRIMARY KEY (id_turista, id_guia),

    CONSTRAINT fk_guias_favoritos_turista  
        FOREIGN KEY (id_turista)  
        REFERENCES turistas(id_turista)  
        ON DELETE CASCADE,

    CONSTRAINT fk_guias_favoritos_guia  
        FOREIGN KEY (id_guia)  
        REFERENCES guias(id_guia)  
        ON DELETE CASCADE  
);

-- ============================================================  
-- 30. TABLA: PUBLICIDAD  
-- ============================================================

CREATE TABLE publicidad (  
    id_publicidad BIGINT GENERATED ALWAYS AS IDENTITY,

    titulo VARCHAR(150) NOT NULL,

    descripcion TEXT,

    imagen_url TEXT,

    enlace TEXT,

    fecha_inicio DATE NOT NULL,

    fecha_fin DATE NOT NULL,

    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_publicidad  
        PRIMARY KEY (id_publicidad),

    CONSTRAINT chk_publicidad_fechas  
        CHECK (fecha_fin >= fecha_inicio)  
);

-- ============================================================  
-- 31. TABLA: TOKENS_USUARIO  
-- ============================================================

CREATE TABLE tokens_usuario (  
    id_token BIGINT GENERATED ALWAYS AS IDENTITY,

    id_usuario BIGINT NOT NULL,

    tipo tipo_token NOT NULL,

    token TEXT NOT NULL,

    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_expiracion TIMESTAMPTZ NOT NULL,

    usado BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT pk_tokens_usuario  
        PRIMARY KEY (id_token),

    CONSTRAINT fk_tokens_usuario  
        FOREIGN KEY (id_usuario)  
        REFERENCES usuarios(id_usuario)  
        ON DELETE CASCADE,

    CONSTRAINT uq_tokens_token  
        UNIQUE (token),

    CONSTRAINT chk_tokens_fecha  
        CHECK (fecha_expiracion > fecha_creacion)  
);

-- ============================================================  
-- 32. ÍNDICES  
-- ============================================================

CREATE INDEX idx_usuarios_estado  
ON usuarios(estado);

CREATE INDEX idx_usuarios_nombre  
ON usuarios(apellido, nombre);

CREATE INDEX idx_turistas_nacionalidad  
ON turistas(nacionalidad);

CREATE INDEX idx_turistas_ciudad  
ON turistas(ciudad_residencia);

CREATE INDEX idx_guias_activo  
ON guias(activo);

CREATE INDEX idx_guias_disponibilidad  
ON guias(disponibilidad);

CREATE INDEX idx_tours_categoria  
ON tours(id_categoria);

CREATE INDEX idx_tours_estado  
ON tours(estado);

CREATE INDEX idx_tours_nombre  
ON tours(nombre);

CREATE INDEX idx_salidas_tour_tour  
ON salidas_tour(id_tour);

CREATE INDEX idx_salidas_tour_guia  
ON salidas_tour(id_guia);

CREATE INDEX idx_salidas_tour_fecha  
ON salidas_tour(fecha_salida);

CREATE INDEX idx_salidas_tour_estado  
ON salidas_tour(estado);

CREATE INDEX idx_reservas_turista  
ON reservas(id_turista);

CREATE INDEX idx_reservas_salida  
ON reservas(id_salida);

CREATE INDEX idx_reservas_estado  
ON reservas(estado);

CREATE INDEX idx_reservas_fecha  
ON reservas(fecha_reserva);

CREATE INDEX idx_participantes_reserva  
ON reserva_participantes(id_reserva);

CREATE INDEX idx_ventas_estado  
ON ventas(estado);

CREATE INDEX idx_abonos_venta  
ON abonos(id_venta);

CREATE INDEX idx_facturas_estado  
ON facturas(estado);

CREATE INDEX idx_resenas_tour_tour  
ON resenas_tour(id_tour);

CREATE INDEX idx_resenas_guia_guia  
ON resenas_guia(id_guia);

CREATE INDEX idx_publicidad_fechas  
ON publicidad(fecha_inicio, fecha_fin);

CREATE INDEX idx_tokens_usuario  
ON tokens_usuario(id_usuario);

CREATE INDEX idx_tokens_expiracion  
ON tokens_usuario(fecha_expiracion);

-- ============================================================  
-- 33. TRIGGER PARA ACTUALIZAR FECHA DE MODIFICACIÓN  
-- ============================================================

CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()  
RETURNS TRIGGER  
LANGUAGE plpgsql  
AS $$  
BEGIN  
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;

    RETURN NEW;  
END;  
$$;

CREATE TRIGGER trg_usuarios_fecha_actualizacion  
BEFORE UPDATE ON usuarios  
FOR EACH ROW  
EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_tours_fecha_actualizacion  
BEFORE UPDATE ON tours  
FOR EACH ROW  
EXECUTE FUNCTION actualizar_fecha_modificacion();

-- ============================================================  
-- 34. FUNCIÓN PARA ACTUALIZAR CUPOS  
-- ============================================================

CREATE OR REPLACE FUNCTION actualizar_cupos_salida()  
RETURNS TRIGGER  
LANGUAGE plpgsql  
AS $$  
DECLARE  
    diferencia INTEGER;  
BEGIN

    IF TG_OP = 'INSERT' THEN

        IF NEW.estado IN ('PENDIENTE', 'CONFIRMADA') THEN

            UPDATE salidas_tour  
            SET cupos_disponibles =  
                cupos_disponibles  
                -  
                (NEW.cantidad_adultos + NEW.cantidad_ninos)

            WHERE id_salida = NEW.id_salida  
            AND cupos_disponibles >=  
                (NEW.cantidad_adultos + NEW.cantidad_ninos);

            IF NOT FOUND THEN  
                RAISE EXCEPTION  
                'No hay suficientes cupos disponibles para la salida %',  
                NEW.id_salida;  
            END IF;

        END IF;

        RETURN NEW;

    END IF;

    IF TG_OP = 'UPDATE' THEN

        IF OLD.estado NOT IN ('CANCELADA')  
           AND NEW.estado = 'CANCELADA' THEN

            UPDATE salidas_tour  
            SET cupos_disponibles =  
                cupos_disponibles  
                +  
                (OLD.cantidad_adultos + OLD.cantidad_ninos)

            WHERE id_salida = OLD.id_salida;

        END IF;

        IF OLD.estado = 'CANCELADA'  
           AND NEW.estado IN ('PENDIENTE', 'CONFIRMADA') THEN

            UPDATE salidas_tour  
            SET cupos_disponibles =  
                cupos_disponibles  
                -  
                (NEW.cantidad_adultos + NEW.cantidad_ninos)

            WHERE id_salida = NEW.id_salida  
            AND cupos_disponibles >=  
                (NEW.cantidad_adultos + NEW.cantidad_ninos);

            IF NOT FOUND THEN  
                RAISE EXCEPTION  
                'No hay suficientes cupos disponibles para la salida %',  
                NEW.id_salida;  
            END IF;

        END IF;

        RETURN NEW;

    END IF;

    IF TG_OP = 'DELETE' THEN

        IF OLD.estado IN ('PENDIENTE', 'CONFIRMADA') THEN

            UPDATE salidas_tour  
            SET cupos_disponibles =  
                cupos_disponibles  
                +  
                (OLD.cantidad_adultos + OLD.cantidad_ninos)

            WHERE id_salida = OLD.id_salida;

        END IF;

        RETURN OLD;

    END IF;

    RETURN NULL;

END;  
$$;

CREATE TRIGGER trg_actualizar_cupos_reserva  
AFTER INSERT OR UPDATE OR DELETE  
ON reservas  
FOR EACH ROW  
EXECUTE FUNCTION actualizar_cupos_salida();

-- ============================================================  
-- 35. FUNCIÓN PARA ACTUALIZAR ESTADO DE SALIDA  
-- ============================================================

CREATE OR REPLACE FUNCTION actualizar_estado_salida()  
RETURNS TRIGGER  
LANGUAGE plpgsql  
AS $$  
BEGIN

    IF NEW.cupos_disponibles = 0 THEN

        NEW.estado = 'COMPLETA';

    ELSIF NEW.cupos_disponibles > 0  
          AND NEW.estado = 'COMPLETA' THEN

        NEW.estado = 'DISPONIBLE';

    END IF;

    RETURN NEW;

END;  
$$;

CREATE TRIGGER trg_estado_salida  
BEFORE UPDATE OF cupos_disponibles  
ON salidas_tour  
FOR EACH ROW  
EXECUTE FUNCTION actualizar_estado_salida();

-- ============================================================  
-- 36. DATOS INICIALES: ROLES  
-- ============================================================

INSERT INTO roles (  
    nombre,  
    descripcion  
)  
VALUES  
(  
    'ADMINISTRADOR',  
    'Gestiona completamente el sistema'  
),  
(  
    'GUIA',  
    'Gestiona su información y actividades como guía turístico'  
),  
(  
    'TURISTA',  
    'Consulta tours, realiza reservas y califica experiencias'  
);

-- ============================================================  
-- 37. DATOS INICIALES: PERMISOS  
-- ============================================================

INSERT INTO permisos (  
    nombre,  
    descripcion  
)  
VALUES  
('GESTIONAR_USUARIOS', 'Crear, editar y gestionar usuarios'),  
('GESTIONAR_ROLES', 'Gestionar roles y permisos'),  
('GESTIONAR_GUIAS', 'Crear y gestionar guías'),  
('GESTIONAR_TURISTAS', 'Gestionar turistas'),  
('GESTIONAR_CATEGORIAS', 'Gestionar categorías de tours'),  
('GESTIONAR_TOURS', 'Crear, editar y eliminar tours'),  
('GESTIONAR_SALIDAS', 'Gestionar fechas y cupos'),  
('GESTIONAR_RESERVAS', 'Gestionar reservas'),  
('GESTIONAR_VENTAS', 'Gestionar ventas'),  
('GESTIONAR_PAGOS', 'Gestionar abonos y pagos'),  
('GESTIONAR_FACTURAS', 'Gestionar facturación'),  
('GESTIONAR_PUBLICIDAD', 'Gestionar publicidad'),  
('VER_REPORTES', 'Consultar reportes'),  
('CREAR_RESERVA', 'Crear reservas'),  
('CREAR_RESENA', 'Crear reseñas'),  
('GESTIONAR_FAVORITOS', 'Gestionar guías favoritos');

-- ============================================================  
-- 38. ASIGNAR TODOS LOS PERMISOS AL ADMINISTRADOR  
-- ============================================================

INSERT INTO rol_permisos (  
    id_rol,  
    id_permiso  
)  
SELECT  
    r.id_rol,  
    p.id_permiso  
FROM roles r  
CROSS JOIN permisos p  
WHERE r.nombre = 'ADMINISTRADOR';

-- ============================================================  
-- 39. USUARIOS DE PRUEBA  
-- ============================================================

INSERT INTO usuarios (  
    nombre,  
    apellido,  
    correo,  
    telefono,  
    password_hash,  
    estado,  
    correo_verificado  
)  
VALUES  
(  
    'Carlos',  
    'Administrador',  
    'admin@artetours.com',  
    '3001112233',  
    '$2a$11$HASH_DE_PRUEBA_ADMIN',  
    'ACTIVO',  
    TRUE  
),  
(  
    'Juan',  
    'Pérez',  
    'juan.guia@artetours.com',  
    '3012223344',  
    '$2a$11$HASH_DE_PRUEBA_GUIA',  
    'ACTIVO',  
    TRUE  
),  
(  
    'María',  
    'Gómez',  
    'maria.turista@gmail.com',  
    '3023334455',  
    '$2a$11$HASH_DE_PRUEBA_TURISTA',  
    'ACTIVO',  
    TRUE  
),  
(  
    'Andrés',  
    'Rodríguez',  
    'andres.turista@gmail.com',  
    '3034445566',  
    '$2a$11$HASH_DE_PRUEBA_TURISTA_2',  
    'ACTIVO',  
    TRUE  
);

-- ============================================================  
-- 40. ASIGNAR ROLES  
-- ============================================================

INSERT INTO usuario_roles (  
    id_usuario,  
    id_rol  
)  
SELECT  
    u.id_usuario,  
    r.id_rol  
FROM usuarios u  
CROSS JOIN roles r  
WHERE  
(  
    u.correo = 'admin@artetours.com'  
    AND r.nombre = 'ADMINISTRADOR'  
)  
OR  
(  
    u.correo = 'juan.guia@artetours.com'  
    AND r.nombre = 'GUIA'  
)  
OR  
(  
    u.correo IN (  
        'maria.turista@gmail.com',  
        'andres.turista@gmail.com'  
    )  
    AND r.nombre = 'TURISTA'  
);

-- ============================================================  
-- 41. PERFIL DEL GUÍA  
-- ============================================================

INSERT INTO guias (  
    id_guia,  
    tipo_documento,  
    numero_documento,  
    fecha_nacimiento,  
    genero,  
    nacionalidad,  
    pais_residencia,  
    ciudad_residencia,  
    direccion,  
    especialidad,  
    biografia,  
    experiencia_anios,  
    foto_url  
)  
SELECT  
    id_usuario,  
    'CC',  
    '1030000001',  
    '1990-04-15',  
    'MASCULINO',  
    'Colombiana',  
    'Colombia',  
    'Medellín',  
    'Carrera 50 # 10-20',  
    'Turismo cultural e histórico',  
    'Guía especializado en experiencias culturales, históricas y de arte urbano en Medellín.',  
    8,  
    'https://ejemplo.com/artetours/guias/juan-perez.jpg'  
FROM usuarios  
WHERE correo = 'juan.guia@artetours.com';

-- ============================================================  
-- 42. PERFILES DE TURISTAS  
-- ============================================================

INSERT INTO turistas (  
    id_turista,  
    tipo_documento,  
    numero_documento,  
    fecha_nacimiento,  
    genero,  
    nacionalidad,  
    pais_residencia,  
    ciudad_residencia,  
    direccion,  
    contacto_emergencia_nombre,  
    contacto_emergencia_telefono,  
    contacto_emergencia_parentesco,  
    preferencias,  
    observaciones  
)  
SELECT  
    id_usuario,  
    'CC',  
    '1001001001',  
    '1995-08-20',  
    'FEMENINO',  
    'Colombiana',  
    'Colombia',  
    'Medellín',  
    'Carrera 45 # 20-30',  
    'Laura Gómez',  
    '3005556677',  
    'Hermana',  
    'Cultura, gastronomía, fotografía y arte urbano',  
    'Prefiere tours en horas de la mañana.'  
FROM usuarios  
WHERE correo = 'maria.turista@gmail.com';

INSERT INTO turistas (  
    id_turista,  
    tipo_documento,  
    numero_documento,  
    fecha_nacimiento,  
    genero,  
    nacionalidad,  
    pais_residencia,  
    ciudad_residencia,  
    direccion,  
    contacto_emergencia_nombre,  
    contacto_emergencia_telefono,  
    contacto_emergencia_parentesco,  
    preferencias  
)  
SELECT  
    id_usuario,  
    'CC',  
    '1002002002',  
    '1992-02-10',  
    'MASCULINO',  
    'Colombiana',  
    'Colombia',  
    'Bogotá',  
    'Calle 80 # 20-40',  
    'Carlos Rodríguez',  
    '3017778899',  
    'Padre',  
    'Naturaleza, aventura y senderismo'  
FROM usuarios  
WHERE correo = 'andres.turista@gmail.com';

-- ============================================================  
-- 43. IDIOMAS  
-- ============================================================

INSERT INTO idiomas (  
    nombre  
)  
VALUES  
('ESPAÑOL'),  
('INGLÉS'),  
('FRANCÉS'),  
('PORTUGUÉS'),  
('ALEMÁN');

-- ============================================================  
-- 44. IDIOMAS DEL GUÍA  
-- ============================================================

INSERT INTO guia_idiomas (  
    id_guia,  
    id_idioma,  
    nivel  
)  
SELECT  
    g.id_guia,  
    i.id_idioma,  
    'NATIVO'  
FROM guias g  
CROSS JOIN idiomas i  
WHERE  
    g.numero_documento = '1030000001'  
    AND i.nombre = 'ESPAÑOL';

INSERT INTO guia_idiomas (  
    id_guia,  
    id_idioma,  
    nivel  
)  
SELECT  
    g.id_guia,  
    i.id_idioma,  
    'AVANZADO'  
FROM guias g  
CROSS JOIN idiomas i  
WHERE  
    g.numero_documento = '1030000001'  
    AND i.nombre = 'INGLÉS';

-- ============================================================  
-- 45. CERTIFICACIONES  
-- ============================================================

INSERT INTO certificaciones (  
    nombre,  
    entidad_emisora  
)  
VALUES  
(  
    'Guianza Turística',  
    'SENA'  
),  
(  
    'Primeros Auxilios',  
    'Cruz Roja Colombiana'  
),  
(  
    'Turismo Cultural',  
    'Ministerio de Comercio, Industria y Turismo'  
);

-- ============================================================  
-- 46. CERTIFICACIÓN DEL GUÍA  
-- ============================================================

INSERT INTO guia_certificaciones (  
    id_guia,  
    id_certificacion,  
    fecha_obtencion,  
    numero_certificado  
)  
SELECT  
    g.id_guia,  
    c.id_certificacion,  
    '2020-05-10',  
    'CERT-GUIA-001'  
FROM guias g  
CROSS JOIN certificaciones c  
WHERE  
    g.numero_documento = '1030000001'  
    AND c.nombre = 'Guianza Turística';

-- ============================================================  
-- 47. CATEGORÍAS DE TOURS  
-- ============================================================

INSERT INTO categorias_tour (  
    nombre,  
    descripcion  
)  
VALUES  
(  
    'Cultura',  
    'Experiencias culturales y expresiones tradicionales'  
),  
(  
    'Historia',  
    'Recorridos por lugares históricos'  
),  
(  
    'Gastronomía',  
    'Experiencias gastronómicas'  
),  
(  
    'Aventura',  
    'Actividades de aventura y naturaleza'  
),  
(  
    'Arte',  
    'Recorridos relacionados con arte y expresiones urbanas'  
);

-- ============================================================  
-- 48. TOURS  
-- ============================================================

INSERT INTO tours (  
    id_categoria,  
    nombre,  
    descripcion,  
    duracion_horas,  
    precio_base,  
    punto_encuentro,  
    destino,  
    latitud,  
    longitud,  
    dificultad,  
    edad_minima,  
    edad_maxima,  
    capacidad_maxima,  
    incluye,  
    no_incluye,  
    recomendaciones,  
    politica_cancelacion,  
    estado  
)  
SELECT  
    c.id_categoria,  
    'Tour Comuna 13',  
    'Recorrido cultural por la Comuna 13 de Medellín, conociendo su historia, arte urbano, transformación social y cultura.',  
    3.50,  
    80000,  
    'Estación San Javier',  
    'Comuna 13 - Medellín',  
    6.2564,  
    -75.6132,  
    'FÁCIL',  
    8,  
    NULL,  
    20,  
    'Guía turístico, recorrido cultural y acompañamiento.',  
    'Alimentación y gastos personales.',  
    'Usar ropa cómoda, llevar hidratación y protección solar.',  
    'Cancelación gratuita hasta 24 horas antes del tour.',  
    'ACTIVO'  
FROM categorias_tour c  
WHERE c.nombre = 'Cultura';

INSERT INTO tours (  
    id_categoria,  
    nombre,  
    descripcion,  
    duracion_horas,  
    precio_base,  
    punto_encuentro,  
    destino,  
    latitud,  
    longitud,  
    dificultad,  
    edad_minima,  
    capacidad_maxima,  
    incluye,  
    no_incluye,  
    recomendaciones,  
    politica_cancelacion,  
    estado  
)  
SELECT  
    c.id_categoria,  
    'Tour Centro Histórico de Medellín',  
    'Recorrido por los principales lugares históricos y culturales del centro de Medellín.',  
    3.00,  
    70000,  
    'Plaza Botero',  
    'Centro de Medellín',  
    6.2518,  
    -75.5636,  
    'FÁCIL',  
    5,  
    15,  
    'Guía turístico y recorrido histórico.',  
    'Alimentación y compras personales.',  
    'Usar ropa cómoda y llevar hidratación.',  
    'Cancelación gratuita hasta 24 horas antes.',  
    'ACTIVO'  
FROM categorias_tour c  
WHERE c.nombre = 'Historia';

INSERT INTO tours (  
    id_categoria,  
    nombre,  
    descripcion,  
    duracion_horas,  
    precio_base,  
    punto_encuentro,  
    destino,  
    latitud,  
    longitud,  
    dificultad,  
    edad_minima,  
    capacidad_maxima,  
    incluye,  
    no_incluye,  
    recomendaciones,  
    politica_cancelacion,  
    estado  
)  
SELECT  
    c.id_categoria,  
    'Experiencia Gastronómica Paisa',  
    'Experiencia para conocer los sabores tradicionales de Antioquia.',  
    4.00,  
    120000,  
    'Parque Lleras',  
    'El Poblado - Medellín',  
    6.2088,  
    -75.5677,  
    'FÁCIL',  
    12,  
    12,  
    'Degustaciones incluidas y acompañamiento de guía.',  
    'Bebidas alcohólicas y gastos adicionales.',  
    'Informar previamente sobre alergias alimentarias.',  
    'Cancelación gratuita hasta 48 horas antes.',  
    'ACTIVO'  
FROM categorias_tour c  
WHERE c.nombre = 'Gastronomía';

-- ============================================================  
-- 49. REQUISITOS  
-- ============================================================

INSERT INTO tour_requisitos (  
    id_tour,  
    descripcion  
)  
SELECT  
    id_tour,  
    'Llevar documento de identidad'  
FROM tours  
WHERE nombre = 'Tour Comuna 13';

INSERT INTO tour_requisitos (  
    id_tour,  
    descripcion  
)  
SELECT  
    id_tour,  
    'Usar ropa y calzado cómodo'  
FROM tours  
WHERE nombre = 'Tour Comuna 13';

INSERT INTO tour_requisitos (  
    id_tour,  
    descripcion  
)  
SELECT  
    id_tour,  
    'Llevar hidratación'  
FROM tours  
WHERE nombre = 'Tour Comuna 13';

-- ============================================================  
-- 50. IMÁGENES  
-- ============================================================

INSERT INTO tour_imagenes (  
    id_tour,  
    url,  
    titulo,  
    descripcion,  
    principal,  
    orden  
)  
SELECT  
    id_tour,  
    'https://ejemplo.com/artetours/comuna13-1.jpg',  
    'Arte urbano de la Comuna 13',  
    'Mural representativo de la Comuna 13.',  
    TRUE,  
    1  
FROM tours  
WHERE nombre = 'Tour Comuna 13';

INSERT INTO tour_imagenes (  
    id_tour,  
    url,  
    titulo,  
    descripcion,  
    principal,  
    orden  
)  
SELECT  
    id_tour,  
    'https://ejemplo.com/artetours/comuna13-2.jpg',  
    'Recorrido por la Comuna 13',  
    'Imagen de un recorrido turístico.',  
    FALSE,  
    2  
FROM tours  
WHERE nombre = 'Tour Comuna 13';

-- ============================================================  
-- 51. SALIDAS  
-- ============================================================

INSERT INTO salidas_tour (  
    id_tour,  
    id_guia,  
    fecha_salida,  
    hora_salida,  
    hora_finalizacion,  
    cupo_maximo,  
    cupos_disponibles,  
    estado  
)  
SELECT  
    t.id_tour,  
    g.id_guia,  
    CURRENT_DATE + 10,  
    '09:00:00',  
    '12:30:00',  
    20,  
    20,  
    'DISPONIBLE'  
FROM tours t  
CROSS JOIN guias g  
WHERE  
    t.nombre = 'Tour Comuna 13'  
    AND g.numero_documento = '1030000001';

INSERT INTO salidas_tour (  
    id_tour,  
    id_guia,  
    fecha_salida,  
    hora_salida,  
    hora_finalizacion,  
    cupo_maximo,  
    cupos_disponibles,  
    estado  
)  
SELECT  
    t.id_tour,  
    g.id_guia,  
    CURRENT_DATE + 20,  
    '10:00:00',  
    '13:00:00',  
    15,  
    15,  
    'DISPONIBLE'  
FROM tours t  
CROSS JOIN guias g  
WHERE  
    t.nombre = 'Tour Centro Histórico de Medellín'  
    AND g.numero_documento = '1030000001';

-- ============================================================  
-- 52. MÉTODOS DE PAGO  
-- ============================================================

INSERT INTO metodos_pago (  
    nombre  
)  
VALUES  
('EFECTIVO'),  
('TRANSFERENCIA'),  
('TARJETA_CREDITO'),  
('TARJETA_DEBITO'),  
('PSE');

-- ============================================================  
-- 53. RESERVA DE PRUEBA  
-- ============================================================

INSERT INTO reservas (  
    codigo_reserva,  
    id_turista,  
    id_salida,  
    cantidad_adultos,  
    cantidad_ninos,  
    precio_unitario,  
    descuento,  
    subtotal,  
    total,  
    estado,  
    observaciones  
)  
SELECT  
    'RES-000001',  
    t.id_turista,  
    s.id_salida,  
    2,  
    0,  
    80000,  
    0,  
    160000,  
    160000,  
    'CONFIRMADA',  
    'Reserva de prueba para dos adultos.'  
FROM turistas t  
CROSS JOIN salidas_tour s  
WHERE  
    t.numero_documento = '1001001001'  
    AND s.id_salida = (  
        SELECT MIN(id_salida)  
        FROM salidas_tour  
    );

-- ============================================================  
-- 54. PARTICIPANTES DE LA RESERVA  
-- ============================================================

INSERT INTO reserva_participantes (  
    id_reserva,  
    nombres,  
    apellidos,  
    tipo_documento,  
    numero_documento,  
    fecha_nacimiento,  
    nacionalidad,  
    es_titular  
)  
SELECT  
    r.id_reserva,  
    'María',  
    'Gómez',  
    'CC',  
    '1001001001',  
    '1995-08-20',  
    'Colombiana',  
    TRUE  
FROM reservas r  
WHERE r.codigo_reserva = 'RES-000001';

INSERT INTO reserva_participantes (  
    id_reserva,  
    nombres,  
    apellidos,  
    tipo_documento,  
    numero_documento,  
    fecha_nacimiento,  
    nacionalidad,  
    es_titular  
)  
SELECT  
    r.id_reserva,  
    'Laura',  
    'Gómez',  
    'CC',  
    '1001001003',  
    '1996-03-15',  
    'Colombiana',  
    FALSE  
FROM reservas r  
WHERE r.codigo_reserva = 'RES-000001';

-- ============================================================  
-- 55. VENTA  
-- ============================================================

INSERT INTO ventas (  
    id_reserva,  
    numero_venta,  
    subtotal,  
    impuestos,  
    descuento,  
    total,  
    estado  
)  
SELECT  
    id_reserva,  
    'VT-000001',  
    160000,  
    0,  
    0,  
    160000,  
    'PARCIAL'  
FROM reservas  
WHERE codigo_reserva = 'RES-000001';

-- ============================================================  
-- 56. ABONO  
-- ============================================================

INSERT INTO abonos (  
    id_venta,  
    id_metodo_pago,  
    monto,  
    referencia,  
    comprobante_url,  
    observaciones  
)  
SELECT  
    v.id_venta,  
    m.id_metodo_pago,  
    80000,  
    'TRX-DEMO-0001',  
    'https://ejemplo.com/comprobantes/trx-demo-0001.jpg',  
    'Abono inicial de la reserva.'  
FROM ventas v  
CROSS JOIN metodos_pago m  
WHERE  
    v.numero_venta = 'VT-000001'  
    AND m.nombre = 'TRANSFERENCIA';

-- ============================================================  
-- 57. FACTURA  
-- ============================================================

INSERT INTO facturas (  
    id_venta,  
    numero_factura,  
    nombre_cliente,  
    tipo_documento,  
    numero_documento,  
    direccion_cliente,  
    correo_cliente,  
    subtotal,  
    impuestos,  
    total,  
    estado,  
    fecha_emision  
)  
SELECT  
    v.id_venta,  
    'FAC-000001',  
    u.nombre || ' ' || u.apellido,  
    t.tipo_documento,  
    t.numero_documento,  
    t.direccion,  
    u.correo,  
    v.subtotal,  
    v.impuestos,  
    v.total,  
    'EMITIDA',  
    CURRENT_TIMESTAMP  
FROM ventas v  
INNER JOIN reservas r  
    ON v.id_reserva = r.id_reserva  
INNER JOIN turistas t  
    ON r.id_turista = t.id_turista  
INNER JOIN usuarios u  
    ON t.id_turista = u.id_usuario  
WHERE v.numero_venta = 'VT-000001';

-- ============================================================  
-- 58. RESEÑA DEL TOUR  
-- ============================================================

INSERT INTO resenas_tour (  
    id_turista,  
    id_tour,  
    id_reserva,  
    calificacion,  
    comentario  
)  
SELECT  
    r.id_turista,  
    s.id_tour,  
    r.id_reserva,  
    5,  
    'Excelente experiencia. El recorrido fue muy interesante y el guía explicó todo muy bien.'  
FROM reservas r  
INNER JOIN salidas_tour s  
    ON r.id_salida = s.id_salida  
WHERE r.codigo_reserva = 'RES-000001';

-- ============================================================  
-- 59. RESEÑA DEL GUÍA  
-- ============================================================

INSERT INTO resenas_guia (  
    id_turista,  
    id_guia,  
    calificacion,  
    comentario  
)  
SELECT  
    t.id_turista,  
    s.id_guia,  
    5,  
    'Excelente guía, muy amable y conocedor de la historia de Medellín.'  
FROM reservas r  
INNER JOIN turistas t  
    ON r.id_turista = t.id_turista  
INNER JOIN salidas_tour s  
    ON r.id_salida = s.id_salida  
WHERE r.codigo_reserva = 'RES-000001';

-- ============================================================  
-- 60. GUÍA FAVORITO  
-- ============================================================

INSERT INTO guias_favoritos (  
    id_turista,  
    id_guia  
)  
SELECT  
    t.id_turista,  
    g.id_guia  
FROM turistas t  
CROSS JOIN guias g  
WHERE  
    t.numero_documento = '1001001001'  
    AND g.numero_documento = '1030000001';

-- ============================================================  
-- 61. PUBLICIDAD  
-- ============================================================

INSERT INTO publicidad (  
    titulo,  
    descripcion,  
    imagen_url,  
    enlace,  
    fecha_inicio,  
    fecha_fin,  
    activo  
)  
VALUES  
(  
    'Descubre Medellín con ArteTours',  
    'Vive experiencias únicas y conoce los lugares más representativos de Medellín.',  
    'https://ejemplo.com/artetours/publicidad-medellin.jpg',  
    'https://artetours.com',  
    CURRENT_DATE,  
    CURRENT_DATE + 30,  
    TRUE  
);

-- ============================================================  
-- 62. CONSULTAS DE VALIDACIÓN  
-- ============================================================

-- ------------------------------------------------------------  
-- USUARIOS Y ROLES  
-- ------------------------------------------------------------

SELECT  
    u.id_usuario,  
    u.nombre,  
    u.apellido,  
    u.correo,  
    r.nombre AS rol  
FROM usuarios u  
INNER JOIN usuario_roles ur  
    ON u.id_usuario = ur.id_usuario  
INNER JOIN roles r  
    ON ur.id_rol = r.id_rol  
ORDER BY u.id_usuario;

-- ------------------------------------------------------------  
-- INFORMACIÓN COMPLETA DE TURISTAS  
-- ------------------------------------------------------------

SELECT  
    u.id_usuario,  
    u.nombre,  
    u.apellido,  
    u.correo,  
    u.telefono,  
    t.tipo_documento,  
    t.numero_documento,  
    t.fecha_nacimiento,  
    t.genero,  
    t.nacionalidad,  
    t.pais_residencia,  
    t.ciudad_residencia,  
    t.direccion,  
    t.contacto_emergencia_nombre,  
    t.contacto_emergencia_telefono,  
    t.contacto_emergencia_parentesco,  
    t.preferencias  
FROM usuarios u  
INNER JOIN turistas t  
    ON u.id_usuario = t.id_turista  
ORDER BY u.apellido;

-- ------------------------------------------------------------  
-- GUÍAS  
-- ------------------------------------------------------------

SELECT  
    u.id_usuario,  
    u.nombre,  
    u.apellido,  
    u.correo,  
    g.especialidad,  
    g.experiencia_anios,  
    g.disponibilidad,  
    g.activo  
FROM usuarios u  
INNER JOIN guias g  
    ON u.id_usuario = g.id_guia  
ORDER BY u.apellido;

-- ------------------------------------------------------------  
-- TOURS  
-- ------------------------------------------------------------

SELECT  
    t.id_tour,  
    t.nombre AS tour,  
    c.nombre AS categoria,  
    t.precio_base,  
    t.duracion_horas,  
    t.punto_encuentro,  
    t.destino,  
    t.estado  
FROM tours t  
INNER JOIN categorias_tour c  
    ON t.id_categoria = c.id_categoria  
ORDER BY t.nombre;

-- ------------------------------------------------------------  
-- SALIDAS DISPONIBLES  
-- ------------------------------------------------------------

SELECT  
    s.id_salida,  
    t.nombre AS tour,  
    s.fecha_salida,  
    s.hora_salida,  
    s.cupo_maximo,  
    s.cupos_disponibles,  
    s.estado  
FROM salidas_tour s  
INNER JOIN tours t  
    ON s.id_tour = t.id_tour  
WHERE s.estado IN (  
    'PROGRAMADA',  
    'DISPONIBLE'  
)  
ORDER BY s.fecha_salida;

-- ------------------------------------------------------------  
-- RESERVAS  
-- ------------------------------------------------------------

SELECT  
    r.codigo_reserva,

    u.nombre || ' ' || u.apellido AS turista,

    t.nombre AS tour,

    s.fecha_salida,

    r.cantidad_adultos,

    r.cantidad_ninos,

    r.total,

    r.estado

FROM reservas r

INNER JOIN turistas tu  
    ON r.id_turista = tu.id_turista

INNER JOIN usuarios u  
    ON tu.id_turista = u.id_usuario

INNER JOIN salidas_tour s  
    ON r.id_salida = s.id_salida

INNER JOIN tours t  
    ON s.id_tour = t.id_tour

ORDER BY r.fecha_reserva;

-- ------------------------------------------------------------  
-- PARTICIPANTES DE RESERVAS  
-- ------------------------------------------------------------

SELECT  
    r.codigo_reserva,

    rp.nombres,

    rp.apellidos,

    rp.tipo_documento,

    rp.numero_documento,

    rp.es_titular

FROM reserva_participantes rp

INNER JOIN reservas r  
    ON rp.id_reserva = r.id_reserva

ORDER BY r.codigo_reserva;

-- ------------------------------------------------------------  
-- VENTAS Y SALDOS  
-- ------------------------------------------------------------

SELECT

    v.numero_venta,

    v.total,

    COALESCE(  
        SUM(a.monto),  
        0  
    ) AS total_abonado,

    v.total  
    -  
    COALESCE(  
        SUM(a.monto),  
        0  
    ) AS saldo_pendiente,

    v.estado

FROM ventas v

LEFT JOIN abonos a

    ON v.id_venta = a.id_venta

GROUP BY

    v.id_venta,

    v.numero_venta,

    v.total,

    v.estado;

-- ------------------------------------------------------------  
-- PROMEDIO DE CALIFICACIONES DE TOURS  
-- ------------------------------------------------------------

SELECT

    t.nombre AS tour,

    ROUND(  
        AVG(r.calificacion),  
        2  
    ) AS promedio_calificacion,

    COUNT(  
        r.id_resena  
    ) AS cantidad_resenas

FROM tours t

LEFT JOIN resenas_tour r

    ON t.id_tour = r.id_tour

GROUP BY

    t.id_tour,

    t.nombre

ORDER BY

    promedio_calificacion DESC NULLS LAST;

-- ------------------------------------------------------------  
-- PROMEDIO DE CALIFICACIONES DE GUÍAS  
-- ------------------------------------------------------------

SELECT

    u.nombre || ' ' || u.apellido AS guia,

    ROUND(  
        AVG(r.calificacion),  
        2  
    ) AS promedio_calificacion,

    COUNT(  
        r.id_resena  
    ) AS cantidad_resenas

FROM guias g

INNER JOIN usuarios u

    ON g.id_guia = u.id_usuario

LEFT JOIN resenas_guia r

    ON g.id_guia = r.id_guia

GROUP BY

    g.id_guia,

    u.nombre,

    u.apellido

ORDER BY

    promedio_calificacion DESC NULLS LAST;

-- ------------------------------------------------------------  
-- CUPOS DE SALIDAS  
-- ------------------------------------------------------------

SELECT

    s.id_salida,

    t.nombre AS tour,

    s.fecha_salida,

    s.cupo_maximo,

    s.cupos_disponibles,

    s.cupo_maximo  
    -  
    s.cupos_disponibles AS cupos_ocupados,

    ROUND(  
        (  
            (  
                s.cupo_maximo  
                -  
                s.cupos_disponibles  
            )::NUMERIC  
            /  
            s.cupo_maximo  
        ) * 100,  
        2  
    ) AS porcentaje_ocupacion

FROM salidas_tour s

INNER JOIN tours t

    ON s.id_tour = t.id_tour

ORDER BY s.fecha_salida;

-- ============================================================  
-- FIN DEL SCRIPT  
-- ============================================================  

