/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { FadeIn, StaggeredEntrance, useResizingHeight } from '@atlaskit/motion';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import { Centered } from './utils';

const buttonContainerStyles = css({
	textAlign: 'center',
});

const menuStyles = css({
	width: '100%',
	maxWidth: '500px',
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	marginBlockEnd: '56px',
	marginBlockStart: token('space.300', '24px'),
	paddingBlockEnd: token('space.100', '8px'),
});

const itemStyles = css({
	display: 'flex',
	fontWeight: token('font.weight.medium', '500'),
	paddingBlockEnd: token('space.200', '16px'),
	paddingBlockStart: token('space.200', '16px'),
	paddingInlineEnd: token('space.200', '16px'),
	paddingInlineStart: token('space.200', '16px'),
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	}
});

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

export default (): JSX.Element => {
	const [num, setNum] = useState(1);

	return (
		<div>
			<div css={buttonContainerStyles}>
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
				<div data-testid="menu" {...useResizingHeight()} css={menuStyles}>
					<Label htmlFor="resize-text">Resize</Label>
					<Textfield id="resize-text" readOnly value={searchTerm[`s${num}`]} />
					<StaggeredEntrance columns={1}>
						{Array(num)
							.fill(undefined)
							.map((_, index) => (
								<FadeIn key={index}>
									{(motion) => (
										<div
											css={itemStyles}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
											className={motion.className}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
											style={motion.style}
											ref={motion.ref}
										>
											{logos[index][0]}
											<Heading as="h3" size="small">
												{logos[index][1]}
											</Heading>
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
