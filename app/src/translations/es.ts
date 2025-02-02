import type { TranslationKeys } from './types';

export const es: TranslationKeys = {
  common: {
    welcome: 'Bienvenido',
    loading: 'Cargando...',
    error: 'Se produjo un error',
    save: 'Guardar',
    cancel: 'Cancelar',
    logout: 'Cerrar sesión',
    born: 'Nacido',
  },
  auth: {
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    loginTitle: 'Iniciar sesión',
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña',
    loginButton: 'Iniciar sesión',
    errors: {
      credentialsRequired: 'El correo electrónico y la contraseña son requeridos',
      invalidCredentials: 'Credenciales inválidas'
    }
  },
  dashboard: {
    title: 'Mis Bebés',
    addBaby: 'Agregar Bebé',
    noBabies: 'Aún no hay bebés agregados.',
  },
  // Add more translation categories as needed
}; 