interface Languages {
  zh: string;
  cs: string;
  da: string;
  nl: string;
  en: string;
  en_GB: string;
  et: string;
  fi: string;
  fr: string;
  de: string;
  hu: string;
  is: string;
  it: string;
  ja: string;
  ko: string;
  nb: string;
  pl: string;
  pt_BR: string;
  pt_PT: string;
  ro: string;
  ru: string;
  sk: string;
  es: string;
  sv: string;
}

export type LanguageCode = keyof Languages;

const langs: Languages = {
  zh: 'Chinese',
  cs: 'Czech',
  da: 'Danish',
  nl: 'Dutch',
  en: 'English',
  en_GB: 'English (United Kingdom)',
  et: 'Estonian',
  fi: 'Finnish',
  fr: 'French',
  de: 'German',
  hu: 'Hungarian',
  is: 'Icelandic',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  nb: 'Norwegian Bokmål',
  pl: 'Polish',
  pt_BR: 'Portuguese (Brazil)',
  pt_PT: 'Portuguese (Portugal)',
  ro: 'Romanian',
  ru: 'Russian',
  sk: 'Slovak',
  es: 'Spanish',
  sv: 'Swedish',
};

export default {
  ...langs,
};
