import React from 'react';

import { xcss, Stack, Box } from '@atlaskit/primitives';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';

const expanderStyles = xcss({
	width: '100%',
});

const containerStyles = xcss({
	transition: `max-height 0.3s`,
});

type ExpanderProps = {
	isExpanded: boolean;
	testId?: string;
	children: React.ReactNode;
};

const Expander = ({ children, isExpanded, testId }: ExpanderProps) => {
	// Need to always render the ExpanderInternal otherwise the
	// reveal transition doesn't happen. We can't use CSS animation for
	// the the reveal because we don't know the height of the content.

	return (
		<Box
			xcss={containerStyles}
			style={{
				maxHeight: isExpanded ? 150 : 0,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flex: '1 1 100%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				minWidth: 0,
			}}
			aria-hidden={!isExpanded}
			testId={testId && `${testId}-expander`}
		>
			<ExitingPersistence appear>
				{isExpanded && (
					<FadeIn>
						{(props) => (
							<Box xcss={expanderStyles} {...props}>
								<Stack space="space.100">{children}</Stack>
							</Box>
						)}
					</FadeIn>
				)}
			</ExitingPersistence>
		</Box>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Expander;
