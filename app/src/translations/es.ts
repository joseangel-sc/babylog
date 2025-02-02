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
  tracking: {
    when: 'Cuándo',
    type: 'Tipo',
    notes: 'Notas',
    notesPlaceholder: 'Agregar notas adicionales...',
    elimination: {
      title: 'Eliminación',
      weight: 'Peso (g)',
      types: {
        wet: 'Mojado',
        dirty: 'Sucio',
        both: 'Ambos'
      }
    },
    feeding: {
      title: 'Alimentación',
      amount: 'Cantidad (ml)',
      types: {
        breast: 'Pecho',
        bottle: 'Biberón',
        formula: 'Fórmula'
      }
    },
    sleep: {
      title: 'Sueño',
      quality: 'Calidad',
      types: {
        nap: 'Siesta',
        night: 'Sueño Nocturno'
      }
    }
  },
  baby: {
    settings: 'Configuración',
    recent: {
      eliminations: 'Eliminaciones Recientes',
      feedings: 'Alimentaciones Recientes',
      sleep: 'Sueño Reciente',
      viewAll: 'Ver Todo',
      noData: {
        eliminations: 'No hay eliminaciones registradas',
        feedings: 'No hay alimentaciones registradas',
        sleep: 'No hay sesiones de sueño registradas'
      }
    },
    details: {
      weight: 'Peso',
      amount: 'Cantidad',
      quality: 'Calidad'
    }
  },
  newBaby: {
    title: 'Agregar Nuevo Bebé',
    fields: {
      firstName: 'Nombre',
      lastName: 'Apellido',
      dateOfBirth: 'Fecha de Nacimiento',
      gender: 'Género'
    },
    genderOptions: {
      girl: 'Niña',
      boy: 'Niño'
    },
    submit: 'Agregar Bebé',
    errors: {
      allFieldsRequired: 'Todos los campos son requeridos'
    }
  },
  register: {
    title: 'Crear tu cuenta',
    fields: {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo electrónico',
      password: 'Contraseña',
      phone: 'Teléfono',
      optional: '(opcional)'
    },
    placeholders: {
      firstName: 'Ingresa tu nombre',
      lastName: 'Ingresa tu apellido',
      email: 'Ingresa tu correo electrónico',
      password: 'Ingresa tu contraseña',
      phone: 'Ingresa tu número de teléfono'
    },
    submit: 'Registrarse',
    errors: {
      requiredFields: 'Por favor completa todos los campos requeridos',
      emailExists: 'Ya existe una cuenta con este correo electrónico',
      generic: 'Algo salió mal. Por favor intenta de nuevo.'
    }
  },
  // Add more translation categories as needed
}; 