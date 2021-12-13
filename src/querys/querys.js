const Usuarios = `SELECT a.id, nombre, correo, contraseña, estado, rol FROM dbo.Usuario as a 
INNER JOIN dbo.Usuario_perfil as b
on a.id = b.id_usuario
INNER JOIN dbo.Rol as c
on c.id = b.id_perfil`;

const Rol = `SELECT * FROM dbo.Rol`;

const Report = `SELECT * FROM dbo.Reporte`;

const ReportRol = `SELECT * FROM dbo.Perfil_reporte`;

const User = `SELECT * FROM dbo.Usuario`;

const UserRol = `SELECT * FROM dbo.Usuario_perfil`;

module.exports = {
    Usuarios, Rol, Report, ReportRol, User, UserRol
}