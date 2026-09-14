import { normaliseLineBreaks } from './normaliseLineBreaks';

export const lineCount = (text: string): number => normaliseLineBreaks(text).split(/\n/).length;
