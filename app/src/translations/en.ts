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
  baby: {
    settings: 'Settings',
    recent: {
      eliminations: 'Recent Eliminations',
      feedings: 'Recent Feedings',
      sleep: 'Recent Sleep',
      viewAll: 'View All',
      noData: {
        eliminations: 'No eliminations recorded',
        feedings: 'No feedings recorded',
        sleep: 'No sleep sessions recorded'
      }
    },
    details: {
      weight: 'Weight',
      amount: 'Amount',
      quality: 'Quality'
    }
  },
  newBaby: {
    title: 'Add New Baby',
    fields: {
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender'
    },
    genderOptions: {
      girl: 'Girl',
      boy: 'Boy'
    },
    submit: 'Add Baby',
    errors: {
      allFieldsRequired: 'All fields are required'
    }
  },
  register: {
    title: 'Create your account',
    fields: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email address',
      password: 'Password',
      phone: 'Phone',
      optional: '(optional)'
    },
    placeholders: {
      firstName: 'Enter your first name',
      lastName: 'Enter your last name',
      email: 'Enter your email',
      password: 'Enter your password',
      phone: 'Enter your phone number'
    },
    submit: 'Sign up',
    errors: {
      requiredFields: 'Please fill in all required fields',
      emailExists: 'An account with this email already exists',
      generic: 'Something went wrong. Please try again.'
    }
  },
  modal: {
    track: 'Track',
    actions: {
      cancel: 'Cancel',
      save: 'Save'
    },
    close: 'close'
  },
  // Add more translation categories as needed
};

export type TranslationKeys = typeof en; 