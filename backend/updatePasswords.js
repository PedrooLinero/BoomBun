const bcrypt = require('bcrypt');
const Usuario = require('./models/usuario'); // Ajusta la ruta a tu modelo
const saltRounds = 10;

async function updatePasswords() {
    try {
        const usuarios = await Usuario.findAll();
        for (let usuario of usuarios) {
            // Verifica si la contraseña no está hasheada (no comienza con $2b$)
            if (!usuario.Contraseña.startsWith('$2b$')) {
                const hashedPassword = await bcrypt.hash(usuario.Contraseña, saltRounds);
                await Usuario.update(
                    { Contraseña: hashedPassword },
                    { where: { ID_Usuario: usuario.ID_Usuario } }
                );
                console.log(`Contraseña actualizada para ${usuario.Correo}`);
            }
        }
        console.log('Todas las contraseñas han sido actualizadas.');
    } catch (error) {
        console.error('Error al actualizar contraseñas:', error);
    }
}

updatePasswords();