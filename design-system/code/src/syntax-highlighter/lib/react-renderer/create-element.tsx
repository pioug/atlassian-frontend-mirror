import React, { type ReactNode } from 'react';

import CodeBidiWarning from '../../../bidi-warning';
import codeBidiWarningDecorator from '../../../bidi-warning/bidi-warning-decorator';
import { type CodeBidiWarningConfig, type RefractorNode } from '../../types';

import createChildren from './create-children';

function createClassNameString(classNames: string[] | undefined) {
	return classNames ? classNames.join(' ') : '';
}

// NOTE: This is a function call rather than a React component because, for
// unknown reasons, it appears to be more performant. We tried and measured both
// and this stacks up better than as a memoised React component. Something to look
// into in the future.
export default function createElement({
	node,
	codeBidiWarningConfig,
	key,
}: {
	node: RefractorNode;
	codeBidiWarningConfig: CodeBidiWarningConfig;
	key: string;
}): ReactNode {
	if (node.type === 'text') {
		const { value } = node;
		// occasionally a numeric value is passed when the type is text
		const textValue = `${value}`;
		if (codeBidiWarningConfig.codeBidiWarnings) {
			const decorated = codeBidiWarningDecorator(textValue, ({ bidiCharacter, index }) => (
				<CodeBidiWarning
					bidiCharacter={bidiCharacter}
					key={index}
					label={codeBidiWarningConfig.codeBidiWarningLabel}
					tooltipEnabled={codeBidiWarningConfig.codeBidiWarningTooltipEnabled}
				/>
			));
			return decorated;
		}
		return textValue;
	} else {
		const { properties, tagName } = node;

		const childrenCreator = createChildren(codeBidiWarningConfig);

		const props: React.HTMLProps<HTMLElement> = {
			...properties,
			className: createClassNameString(properties.className),
		};

		const children = childrenCreator(node.children);

		return React.createElement(
			tagName,
			{
				key,
				...props,
			},
			children,
		);
	}
}
