/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Expand from '@atlaskit/icon/glyph/arrow-down';
import Question from '@atlaskit/icon/glyph/question';

import Button from '../src';

const narrowWrapperStyles = css({
	width: '190px',
	margin: '10px',
	padding: '10px',
	border: '1px solid red',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
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
