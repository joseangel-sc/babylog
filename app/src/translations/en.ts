export const en = {
  common: {
    welcome: 'Welcome',
    loading: 'Loading...',
    error: 'An error occurred',
    save: 'Save',
    cancel: 'Cancel',
    logout: 'Logout',
    born: 'Born',
  },
  auth: {
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    loginTitle: 'Login',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginButton: 'Login',
    errors: {
      credentialsRequired: 'Email and password are required',
      invalidCredentials: 'Invalid credentials'
    }
  },
  dashboard: {
    title: 'My Babies',
    addBaby: 'Add Baby',
    noBabies: 'No babies added yet.',
  },
  // Add more translation categories as needed
};

export type TranslationKeys = typeof en; 