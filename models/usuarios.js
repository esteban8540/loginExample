var baseDatos = require("../config/dbLogin.js").baseDatos;
var usuarios = baseDatos.Model.extend(
    {
        tableName: 'usuarios_tb',
        idAttribute: 'codUsuario'

    }


);

module.exports = {usuarios: usuarios};
