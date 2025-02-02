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
  tracking: {
    when: 'When',
    type: 'Type',
    notes: 'Notes',
    notesPlaceholder: 'Add any additional notes...',
    elimination: {
      title: 'Elimination',
      weight: 'Weight (g)',
      types: {
        wet: 'Wet',
        dirty: 'Dirty',
        both: 'Both'
      }
    },
    feeding: {
      title: 'Feeding',
      amount: 'Amount (ml)',
      types: {
        breast: 'Breast',
        bottle: 'Bottle',
        formula: 'Formula'
      }
    },
    sleep: {
      title: 'Sleep',
      quality: 'Quality',
      types: {
        nap: 'Nap',
        night: 'Night Sleep'
      }
    }
  },
  // Add more translation categories as needed
};

export type TranslationKeys = typeof en; 