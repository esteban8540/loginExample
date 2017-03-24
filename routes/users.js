var express = require('express');
var router = express.Router();


var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var session = require("express-session");
var bcrytp = require("bcrypt-nodejs");
var usuarioModel = require("../models/usuarios");


router.post("/singUp", function (req, res) {
  var usuario = req.body;
  var usuarioPromise = new usuarioModel.usuarios({ correo: usuario.correo }).fetch();
  return usuarioPromise.then(
    function (modelo) {
      if (modelo) {
        res.render("index", { error: "el usuario existe" });
      } else {
        usuario.clave = bcrytp.hashSync(usuario.clave);
        var modeloUsuario = new UserModel.usuarios(
          {
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            clave: usuario.clave
          }
        );
        modeloUsuario.save().then(
          function (modelo) {
            res.render("index", { error: "el usuario fue creado" });
          }
        );
      }
    }
  )
});

module.exports = router;
