import { MarkSerializer, MarkSerializerOpts } from './interfaces';

import code from './marks/code';
import em from './marks/em';
import link from './marks/link';
import strike from './marks/strike';
import strong from './marks/strong';
import subsup from './marks/subsup';
import textColor from './marks/text-color';
import underline from './marks/underline';
import indentation from './marks/indentation';
import alignment from './marks/alignment';

const doNotMark = ({ text }: MarkSerializerOpts): string => text;

export const markSerializers: { [key: string]: MarkSerializer } = {
  action: doNotMark,
  alignment,
  annotation: doNotMark,
  breakout: doNotMark,
  code,
  em,
  indentation,
  link,
  strike,
  strong,
  subsup,
  textColor,
  underline,
};
