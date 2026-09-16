import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import type { NodeSerializerOpts } from '../interfaces';
import {
	B50,
	B500,
	R50,
	R500,
	Y75,
	N800,
	G50,
	G500,
	P50,
	P500,
	N40,
	N500,
	T200,
	M200,
	L200,
	Orange200,
} from '@atlaskit/adf-schema/colors';

const commonStyle = `
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  box-sizing: border-box;
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  max-width: 100%;
  text-transform: uppercase;
  vertical-align: baseline;
  padding: 2px 4px 3px 4px;
`;

export const styles: string = `
.${createClassName('status-blue')} {
  ${commonStyle}
  background-color: ${B50};
  color: ${B500};
}
.${createClassName('status-red')} {
  ${commonStyle}
  background-color: ${R50};
  color: ${R500};
}
.${createClassName('status-yellow')} {
  ${commonStyle}
  background-color: ${Y75};
  color: ${N800};
}
.${createClassName('status-green')} {
  ${commonStyle}
  background-color: ${G50};
  color: ${G500};
}
.${createClassName('status-purple')} {
  ${commonStyle}
  background-color: ${P50};
  color: ${P500};
}
.${createClassName('status-neutral')} {
  ${commonStyle}
  background-color: ${N40};
  color: ${N500};
}
/* Teal — color.background.accent.teal.subtler on color.text.accent.teal.bolder */
.${createClassName('status-b3f5ff')} {
  ${commonStyle}
  background-color: ${T200};
  color: #164555;
}
/* Green — reuses the legacy \`green\` declarations rather than introducing a second, near-identical
   green, so the two render identically */
.${createClassName('status-abf5d1')} {
  ${commonStyle}
  background-color: ${G50};
  color: ${G500};
}
/* Lime — a hue with no legacy name, so it takes its own tokens:
   color.background.accent.lime.subtler on color.text.accent.lime.bolder */
.${createClassName('status-d3f1a7')} {
  ${commonStyle}
  background-color: ${L200};
  color: #37471F;
}
/* Yellow — reuses the legacy \`yellow\` declarations rather than introducing a second,
   near-identical yellow, so the two render identically */
.${createClassName('status-fff0b3')} {
  ${commonStyle}
  background-color: ${Y75};
  color: ${N800};
}
/* Orange — a hue with no legacy name, so it takes its own tokens:
   color.background.accent.orange.subtler on color.text.accent.orange.bolder */
.${createClassName('status-fce4a6')} {
  ${commonStyle}
  background-color: ${Orange200};
  color: #693200;
}
/* Magenta — color.background.accent.magenta.subtler on color.text.accent.magenta.bolder */
.${createClassName('status-fdd0ec')} {
  ${commonStyle}
  background-color: ${M200};
  color: #50253F;
}
`;

/** Exported for tests: lets them cross-check every allowed colour against the stylesheet. */
export const ALLOWED_COLORS: ReadonlySet<string> = new Set([
	'neutral',
	'blue',
	'red',
	'yellow',
	'green',
	'purple',
	'#B3F5FF',
	'#ABF5D1',
	'#D3F1A7',
	'#FFF0B3',
	'#FCE4A6',
	'#FDD0EC',
]);

const normalizeColor = (color: string): string =>
	color.startsWith('#') ? color.toUpperCase() : color;

export default function status({ attrs, text }: NodeSerializerOpts): string {
	const color = normalizeColor(attrs.color ?? '');
	const slug = ALLOWED_COLORS.has(color) ? color.replace('#', '').toLowerCase() : 'neutral';
	return createTag('span', { class: createClassName(`status-${slug}`) }, text);
}
