// Allowlist of { macroKey: parameterName[] } for analytics logging
export const ALLOWED_LOGGED_MACRO_PARAMS: Record<string, Array<string>> = {
  children: [
    'all',
    'first',
    'depth',
    'style',
    'excerptType',
    'sort',
    'reverse',
  ],
  'recently-updated': [
    'width',
    'types',
    'max',
    'theme',
    'showProfilePic',
    'hideHeading',
  ],
  excerpt: ['hidden'],
};

export const ALLOWED_PARAM_TYPES = ['enum', 'number', 'boolean'];
