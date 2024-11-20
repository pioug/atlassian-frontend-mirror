/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/glyph/add';
import Tooltip from '@atlaskit/tooltip';

const Icon = () => (
	<Tooltip content="Inner tooltip" position="right" testId="inner-nesting-tooltip">
		<AddIcon label="inner" size="small" testId="icon" />
	</Tooltip>
);

function Example() {
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

export default () => <Example />;
