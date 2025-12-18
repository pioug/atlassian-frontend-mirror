/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import Expand from '@atlaskit/icon/core/arrow-down';
import Question from '@atlaskit/icon/core/question-circle';
import { token } from '@atlaskit/tokens';

const narrowWrapperStyles = css({
	width: '190px',
	margin: '10px',
	padding: '10px',
	border: `${token('border.width')} solid red`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > *': {
		marginBlockEnd: '10px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:last-child': {
			marginBlockEnd: 0,
		},
	},
});

export default () => (
	<div css={narrowWrapperStyles}>
		<div>
			<Button appearance="primary">I am wider than my parent</Button>
		</div>
		<div>
			<Button appearance="primary" iconBefore={<Question label="" />}>
				I am wider than my parent
			</Button>
		</div>
		<div>
			<Button appearance="primary" iconAfter={<Expand label="" />}>
				I am wider than my parent
			</Button>
		</div>
	</div>
);
