export const LANGUAGE_MAP = {
  actionscript: 'actionscript3',
  applescript: 'applescript',
  'c++': 'cpp',
  coldfusion: 'coldfusion',
  csharp: 'c#',
  css: 'css',
  delphi: 'delphi',
  diff: 'diff',
  erlang: 'erl',
  groovy: 'groovy',
  java: 'java',
  javafx: 'javafx',
  javascript: 'js',
  perl: 'perl',
  php: 'php',
  plaintext: 'text',
  powershell: 'powershell',
  python: 'py',
  ruby: 'ruby',
  sass: 'sass',
  scala: 'scala',
  shell: 'bash',
  sql: 'sql',
  visualbasic: 'vb',
  xml: 'xml',
};

export type LanguageMapKeys = keyof typeof LANGUAGE_MAP;

export const supportedLanguages = (Object.keys(LANGUAGE_MAP) as Array<
  LanguageMapKeys
>).map((name) => LANGUAGE_MAP[name]);

export function mapCodeLanguage(language: LanguageMapKeys): string {
  return LANGUAGE_MAP[language] || language.toLowerCase();
}
