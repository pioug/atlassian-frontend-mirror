/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json
import type { MarkSerializer, MarkSerializerOpts } from './interfaces';
import alignment from './marks/alignment';
import backgroundColor from './marks/background-color';
import code from './marks/code';
import em from './marks/em';
import indentation from './marks/indentation';
import link from './marks/link';
import strike from './marks/strike';
import strong from './marks/strong';
import subsup from './marks/subsup';
import textColor from './marks/text-color';
import underline from './marks/underline';

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
	backgroundColor,
	underline,
};
