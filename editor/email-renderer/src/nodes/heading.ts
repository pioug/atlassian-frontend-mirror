import { headingSizes } from '@atlaskit/theme/typography';
import { N800 } from '@atlaskit/adf-schema';
import type { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { applyMarks } from '../apply-marks';
import { createClassName } from '../styles/util';

const commonStyle = `
font-style: inherit;
color: ${N800};
font-weight: 600;
margin-bottom: 0;
`;

const rounder = (value: number) => value.toFixed(2);

export const styles = `
.${createClassName('h1')} {
  ${commonStyle}
  font-size: ${headingSizes.h800.size}px;
  line-height: ${rounder(headingSizes.h800.lineHeight / headingSizes.h800.size)};
  margin-top: 40px;
  letter-spacing: -0.01em;
}
.${createClassName('h2')} {
  ${commonStyle}
  font-size: ${headingSizes.h700.size}px;
  line-height: ${rounder(headingSizes.h700.lineHeight / headingSizes.h700.size)};
  margin-top: 36px;
  font-weight: 500;
  letter-spacing: -0.01em;
}
.${createClassName('h3')} {
  ${commonStyle}
  font-size: ${headingSizes.h600.size}px;
  line-height: ${rounder(headingSizes.h600.lineHeight / headingSizes.h600.size)};
  font-weight: 500;
  letter-spacing: -0.008em;
}
.${createClassName('h4')} {
  ${commonStyle}
  font-size: ${headingSizes.h500.size}px;
  line-height: ${rounder(headingSizes.h500.lineHeight / headingSizes.h500.size)};
  margin-top: 20px;
  letter-spacing: -0.006em;
}
.${createClassName('h5')} {
  ${commonStyle}
  font-size: ${headingSizes.h400.size}px;
  line-height: ${rounder(headingSizes.h400.lineHeight / headingSizes.h400.size)};
  margin-top: 20px;
  letter-spacing: -0.003em;
}
.${createClassName('h6')} {
  ${commonStyle}
  font-size: ${headingSizes.h300.size}px;
  line-height: ${rounder(headingSizes.h300.lineHeight / headingSizes.h300.size)};
  text-transform: uppercase;
  margin-top: 16px;
}
`;

export default function heading({ attrs, marks, text, context }: NodeSerializerOpts) {
	const tagName = `h${attrs.level}`;

	const headingTag = createTag(tagName, { class: createClassName(tagName) }, text);
	return applyMarks(marks, headingTag, context);
}
