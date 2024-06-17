/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import React, { useMemo } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { CodeBlock } from '@atlaskit/code';
import { type BlockTemplate, type FlexibleTemplate } from './types';
import { toComponentProps, toObjectString } from '../utils/common';

const codeStyles = css({
	display: 'inline-grid',
	tabSize: 2,
});

const toBlockCode = (blockTemplate: BlockTemplate): string => {
	const { name, ...props } = blockTemplate;
	const str = toComponentProps(props, '\n\t\t');
	return `<${name}${str} />`;
};

const Code: React.FC<{ template: FlexibleTemplate }> = ({ template }) => {
	const text = useMemo(() => {
		const { appearance, ...optionalCardProps } = template.cardProps || {};
		const propCode = toComponentProps(optionalCardProps || {});
		const uiCode = template.ui ? `\n\tui={${toObjectString(template.ui)}}` : '';

		if (template.blocks && template.blocks.length > 0) {
			const blockCode = template.blocks.map((block) => toBlockCode(block)).join('\n\t');
			return `<Card appearance="${appearance}"${propCode}${uiCode}>\n\t${blockCode}\n</Card>`;
		} else {
			return `<Card appearance="${appearance}"${propCode}${uiCode} />`;
		}
	}, [template]);

	return (
		<div css={codeStyles}>
			<CodeBlock language="jsx" text={text} />
		</div>
	);
};

export default withErrorBoundary(Code, {
	fallback: <CodeBlock language="jsx" text="// Error!" />,
});
