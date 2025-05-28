/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/glyph/add';
import Tooltip from '@atlaskit/tooltip';

const Icon = () => (
	<Tooltip content="Inner tooltip" position="right" testId="inner-nesting-tooltip">
		<AddIcon label="inner" size="small" testId="icon" />
	</Tooltip>
);

export default function NestingExample() {
	return (
		<Tooltip content="Outer tooltip" testId="outer-nesting-tooltip">
			{(tooltipProps) => (
				<Button iconAfter={Icon} {...tooltipProps}>
					Hover over me or my icon
				</Button>
			)}
		</Tooltip>
	);
}
