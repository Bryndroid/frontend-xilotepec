export const UsuariosModel = {
    obtenerUsuarios: () => {
        return [
            {
                id: '1',
                nombre: 'Andre',
                correo: 'andre@udb.com',
                rol: 'Administrador',
                estado: 'Activo'
            },
            {
                id: '10',
                nombre: 'Nemesio Oseguera Cervantes',
                correo: 'MR230054@udb.com',
                rol: 'Publicista',
                estado: 'Activo'
            },
            {
                id: '85',
                nombre: 'Bryan',
                correo: 'bryan@udb.com',
                rol: 'Gerente',
                estado: 'Inactivo'
            },
        ];
    }
};