/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import Button from '@atlaskit/button';
import { css, cssMap, jsx } from '@atlaskit/css';
import { SpotlightCard } from '@atlaskit/onboarding';
import { Box } from '@atlaskit/primitives/compiled';
import { ProgressIndicator } from '@atlaskit/progress-indicator';
import { token } from '@atlaskit/tokens';

const wrapperStyles = css({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
});

const headingStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
});

const taglineStyles = css({
	paddingBlockEnd: token('space.200', '16px'),
});

const optionStyles = cssMap({
	root: {
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
	},
});

const Option = ({ children }: { children: ReactNode }) => (
	<Box xcss={optionStyles.root}>{children}</Box>
);
const NewUser = () => (
	<div css={wrapperStyles}>
		<div>
			<div css={headingStyles}>
				<h2>Welcome to Jira</h2>
				<ProgressIndicator values={[1, 2, 3]} selectedIndex={0} />
			</div>
			<p css={taglineStyles}>Tell us about your team so we can personalise your project for you</p>
			<SpotlightCard heading="Why are you trying Jira Software?" isFlat headingLevel={2}>
				<Option>
					<Button>Learn about Agile</Button>
				</Option>
				<Option>
					<Button>Explore the product</Button>
				</Option>
				<Option>
					<Button>Setting it up for my team</Button>
				</Option>
			</SpotlightCard>
		</div>
	</div>
);

export default NewUser;
