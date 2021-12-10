const router = require("express").Router();
const passport = require("passport");
const multer = require("multer");
const controladorRegistros = require("../controllers/controlador-registro-tesis");
const controladorConsultasTesis = require("../controllers/controlador-peticion-tesis");
const controladorConsultaHistorial = require("../controllers/controlador-peticion-historial");
const controladorUsuarios = require("../controllers/controlador-usuarios");
const uuid = require("uuid");

router.get("/", (req, res, next) => {
  res.render("index");
});

// Ruta para buscar tesis según los filtros enviados
router.post("/tesis", async (req, res, next) => {
  const resultados = await controladorConsultasTesis.procesarSolicitudTesis(
    req.body
  );
  res.send(resultados);
});

router.get("/tesis/:id", async (req, res, next) => {
  const result = await controladorConsultasTesis.obtenerInformacionTesis({
    numero: req.params.id,
  });
  res.send(result[0]);
});

router.get("/tesis", async (req, res, next) => {
  const resultados = await controladorConsultasTesis.procesarSolicitudTesis(
    req.body
  );
  res.send(resultados);
});

router.get("/view/tesis", async (req, res, next) => {
  const idUsuario = req.session.passport?.user;
  res.render("consultas_tesis", {idUsuario: idUsuario});
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/signin", (req, res, next) => {
  res.render("signin");
});

router.post(
  "/signin",
  passport.authenticate("local-signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

const storage = multer.diskStorage({
  destination: "./public/propuestas",
  filename: function (req, file, done) {
    done("", file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.get("/propuestas", (req, res, next) => {
  res.render("formulario_propuesta", { success: "", status: "" });
});

router.post("/propuestas", upload.single("archivo"), async (req, res, next) => {
  const result = await controladorRegistros.registrarPropuesta(
    req.body,
    req.file.originalname
  );
  if (result === false) {
    res.render("formulario_propuesta", {
      success: "La tesis ya existe",
      status: "danger",
    });
  } else {
    res.render("formulario_propuesta", {
      success: "Propuesta enviada correctamente",
      status: "success",
    });
  }
});

router.use((req, res, next) => {
  isAuthenticated(req, res, next);
});

router.get("/profile", async (req, res, next) => {
  const idUsuario = req.session.passport.user;
  const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
  res.render("profile", { tipoUsuario: usuario.type });
});

router.get("/docente/historial/:id", async (req, res, next) => {
  const result = await controladorConsultaHistorial.buscarTesisProfesor({
    numero: req.params.id,
  });
  res.send(result[0]);
});

router.get("/docente/historial", async (req, res, next) => {
  const idUsuario = req.session.passport.user;
  const usuario = await controladorUsuarios.obtenerUsuario(idUsuario);
  if (usuario.type === "docente") {
    const tesisRelacionadas =
      await controladorConsultaHistorial.buscarTesisProfesor({
        directores: usuario.email,
        sinodales: usuario.email,
      });
    res.render("tabla_historial", { tesis: tesisRelacionadas });
  } else {
    res.redirect("/profile");
  }
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
