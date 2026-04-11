/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { FadeIn, StaggeredEntrance } from '@atlaskit/motion';
import { useResizingWidth } from '@atlaskit/motion/resizing-width';
import { token } from '@atlaskit/tokens';

import { Centered } from './utils';

const buttonContainerStyles = css({
	marginBlockEnd: token('space.300'),
	textAlign: 'center',
});

const containerStyles = css({
	display: 'inline-flex',
	alignItems: 'center',
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	overflow: 'hidden',
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.200'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const itemStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	fontWeight: token('font.weight.medium'),
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.200'),
	paddingInlineStart: token('space.200'),
});

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraSoftwareIcon size="small" />, 'Jira'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

export default (): JSX.Element => {
	const [num, setNum] = useState(1);
	const resizingWidthProps = useResizingWidth({
		duration: token('motion.duration.short'),
		easing: token('motion.easing.out.practical'),
	});

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
				<div data-testid="menu" {...resizingWidthProps} css={containerStyles}>
					<StaggeredEntrance columns={num}>
						{Array(num)
							.fill(undefined)
							.map((_, index) => (
								<FadeIn key={index}>
									{(motion) => (
										<div
											css={itemStyles}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
											className={motion.className}
											style={motion.style}
											ref={motion.ref}
										>
											{logos[index][0]}
											<span>{logos[index][1]}</span>
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
