/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import FocusRing from '@atlaskit/focus-ring';
import { Label } from '@atlaskit/form';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { FadeIn, StaggeredEntrance, useResizingHeight } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Centered } from '../utils';

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraSoftwareIcon size="small" />, 'Jira Software'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

const searchTerm: { [key: string]: string } = {
	s1: 'dev',
	s2: 'design',
	s3: 'software',
	s4: 'ops',
	s5: 'all',
};

const containerStyles = css({
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginInlineEnd: token('space.025', '2px'),
	},
});

const centeredContainerStyles = css({
	width: '100%',
	maxWidth: '500px',
	borderRadius: '3px',
	boxShadow: token('elevation.shadow.overlay'),
	marginBlockEnd: token('space.800', '56px'),
	paddingBlockEnd: token('space.100', '8px'),
});

const logoContainerStyles = css({
	display: 'flex',
	fontSize: '16px',
	fontWeight: token('font.weight.medium', '500'),
	paddingBlockEnd: token('space.200', '16px'),
	paddingBlockStart: token('space.200', '16px'),
	paddingInlineEnd: token('space.200', '16px'),
	paddingInlineStart: token('space.200', '16px'),
	'&:hover': {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
});

const headerStyles = css({
	fontWeight: 300,
	marginBlockEnd: token('space.0', '0px'),
	marginBlockStart: token('space.0', '0px'),
	marginInlineEnd: token('space.0', '0px'),
	marginInlineStart: token('space.100', '8px'),
});

const inputContainerStyles = css({
	marginBlockStart: token('space.300', '24px'),
	textAlign: 'start',
});

const MotionResizeHeightExample = () => {
	const [num, setNum] = useState(1);

	return (
		<div>
			<div css={containerStyles}>
				{[1, 2, 3, 4, 5].map((number) => (
					<Button
						testId={`button--${number}`}
						key={number}
						isSelected={num === number}
						onClick={() => {
							setNum(number);
						}}
					>
						{number}
					</Button>
				))}
			</div>

			<Centered>
				<div data-testid="menu" {...useResizingHeight()} css={containerStyles}>
					<div css={inputContainerStyles}>
						<Label htmlFor="input-options">Motion options</Label>
						<FocusRing isInset>
							<input
								id="input-options"
								type="text"
								readOnly
								value={searchTerm[`s${num}`]}
								css={centeredContainerStyles}
							/>
						</FocusRing>
					</div>
					<StaggeredEntrance columns={1}>
						{Array(num)
							.fill(undefined)
							.map((_, index) => (
								<FadeIn key={index}>
									{(motion) => (
										<div
											ref={motion.ref}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
											className={motion.className}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
											style={motion.style}
											css={logoContainerStyles}
										>
											{logos[index][0]}
											<h3 css={headerStyles}>{logos[index][1]}</h3>
										</div>
									)}
								</FadeIn>
							))}
					</StaggeredEntrance>
				</div>
			</Centered>
		</div>
	);
};

export default MotionResizeHeightExample;
