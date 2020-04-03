import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';
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
} from '@atlaskit/adf-schema';

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

export const styles = `
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
`;

const ALLOWED_COLORS = new Set([
  'blue',
  'red',
  'yellow',
  'green',
  'purple',
  'neutral',
]);

export default function status({ attrs, text }: NodeSerializerOpts) {
  const color = ALLOWED_COLORS.has(attrs.color) ? attrs.color : 'neutral';
  return createTag('span', { class: createClassName(`status-${color}`) }, text);
}
