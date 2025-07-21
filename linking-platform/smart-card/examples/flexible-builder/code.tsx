import React, { useMemo } from 'react';

import { withErrorBoundary } from 'react-error-boundary';

import { CodeBlock } from '@atlaskit/code';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import { toComponentProps, toObjectString } from '../utils/common';

import { type BlockTemplate, type FlexibleTemplate } from './types';

const codeStyles = xcss({
	display: 'inline-grid',
	tabSize: 2,
});

const toBlockCode = (blockTemplate: BlockTemplate): string => {
	const { name, ...props } = blockTemplate;
	const str = toComponentProps(props, '\n\t\t');
	return `<${name}${str} />`;
};

const Code = ({ template }: { template: FlexibleTemplate }) => {
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
		<Box xcss={codeStyles}>
			<CodeBlock language="jsx" text={text} />
		</Box>
	);
};

export default withErrorBoundary(Code, {
	fallback: <CodeBlock language="jsx" text="// Error!" />,
});
