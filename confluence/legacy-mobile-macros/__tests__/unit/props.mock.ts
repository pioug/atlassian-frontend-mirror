import EventEmitter from 'events';

export const createPromise = () => {
  return {
    submit: () => new Promise((resolve) => resolve()),
  };
};

export const eventDispatcher = new EventEmitter();

export const macroComponentProps = {
  macroWhitelist: [],
  extension: {
    extensionKey: 'jira',
    extensionType: 'com.atlassian.confluence.macro.core',
    localId: 'c145e554-f571-4208-a0f1-2170e1987722',
  },
  eventDispatcher,
  createPromise,
};

export const macrosTestProps = {
  default: {
    macroName: 'Default macro',
    extensionKey: 'defaultMacro',
    iconUrl: undefined,
    errorMessage: undefined,
    loading: false,
    action: '', // seems like action is symbol type
    secondaryAction: '',
  },
  loading: {
    macroName: 'Loading macro',
    extensionKey: 'loadingMacro',
    iconUrl: undefined,
    errorMessage: undefined,
    loading: true,
    action: '',
    secondaryAction: '',
  },
  error: {
    macroName: 'Error macro',
    extensionKey: 'errorMacro',
    iconUrl: undefined,
    errorMessage: 'Test error',
    loading: false,
    action: '',
    secondaryAction: '',
  },
  loadingError: {
    macroName: 'Error macro',
    extensionKey: 'errorMacro',
    iconUrl: undefined,
    errorMessage: 'Test loading error',
    loading: true,
    action: '',
    secondaryAction: '',
  },
};
