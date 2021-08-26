export const DEFAULT_LANGUAGE = 'c';

/*
 * Primarily used for the header in the viewer. Based on the language name, render the appropriate header name
 * i.e .py file would be 'python', whilse .msg would be 'email'
 */
export function getFormat(language: string, ext: string | undefined) {
  // some formats have a language we pickfor the code block component,
  // but this may be a bit vague, so we can override here where needed
  switch (ext) {
    case 'csv':
    case 'log':
      return ext;
    default:
      // default value to show is just show language
      // uncapitalised as mediatypes such as doc/audio are also uncapitalised for headers
      return language;
  }
}

export const lineCount = (text: string) =>
  normaliseLineBreaks(text).split(/\n/).length;

export const normaliseLineBreaks = (text: string) =>
  text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
