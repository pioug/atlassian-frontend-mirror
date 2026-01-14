import { type NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { N30, N50, N800 } from '@atlaskit/adf-schema';
import { createClassName } from '../styles/util';

const className = createClassName('inlineExtension');

export const styles: string = `
.${className}-inner {
  background-color: ${N30};
  border: 3px solid ${N30};
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  color: ${N800},
}
.${className}-outer {
  border: 1px solid ${N50};
  border-style: dashed;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  display: inline-block;
}
`;

export default function inlineExtension({ attrs }: NodeSerializerOpts): string {
	const isRedaction = attrs.extensionKey === 'redaction';
	// redaction extension wants to skip generic extension styling https://atlassian.slack.com/archives/C03QXBHB7GC/p1740471786226069?thread_ts=1740051744.345479&cid=C03QXBHB7GC
	const classNameFinal = className + (isRedaction ? '-redaction' : '');
	const inner = createTag(
		'span',
		{ class: classNameFinal + '-inner' },
		`&nbsp;${isRedaction ? '████' : attrs.extensionKey}&nbsp;`,
	);
	return createTag('span', { class: classNameFinal + '-outer' }, inner);
}
