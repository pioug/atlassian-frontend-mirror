/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import TableTree, { Header, Headers, Rows } from '../src';

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'svg, span': {
		animationDuration: '0s',
		animationTimingFunction: 'step-end',
	},
});

export default () => (
	<div css={animationStyles}>
		<TableTree>
			<Headers>
				<Header width={200}>Title</Header>
				<Header width={120}>Numbering</Header>
			</Headers>
			<Rows items={undefined} render={() => null} />
		</TableTree>
	</div>
);
