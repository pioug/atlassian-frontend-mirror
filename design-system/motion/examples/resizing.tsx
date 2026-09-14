/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { JiraSoftwareIcon } from '@atlaskit/logo/jira-software-icon';
import { BitbucketIcon, ConfluenceIcon, OpsgenieIcon, StatuspageIcon } from '@atlaskit/logo';
import Motion from '@atlaskit/motion/entering/motion';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import { useResizing } from '@atlaskit/motion/use-resizing';
import { token } from '@atlaskit/tokens';

import { Centered } from './utils/containers';

const styles = cssMap({
	buttonContainer: {
		marginBlockEnd: token('space.300'),
		textAlign: 'center',
	},
	horizontalContainer: {
		display: 'inline-flex',
		alignItems: 'center',
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'hidden',
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	verticalContainer: {
		display: 'inline-flex',
		alignItems: 'stretch',
		flexDirection: 'column',
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'hidden',
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	sectionHeading: {
		marginBlockEnd: token('space.150'),
		marginBlockStart: token('space.300'),
		textAlign: 'center',
	},
	gridContainer: {
		display: 'inline-block',
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'hidden',
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	gridInner: {
		display: 'inline-grid',
		gap: token('space.100'),
	},
	item: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		fontWeight: token('font.weight.medium'),
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	entering: {
		animationDuration: token('motion.duration.short'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: token('motion.keyframe.fade.in'),
	},
});

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraSoftwareIcon size="small" />, 'Jira'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

export default (): JSX.Element => {
	const [widthNum, setWidthNum] = useState(1);
	const [heightNum, setHeightNum] = useState(1);
	const [bothNum, setBothNum] = useState(1);

	const resizingWidthProps = useResizing({
		dimension: 'width',
		duration: token('motion.duration.short'),
		easing: token('motion.easing.out.practical'),
	});

	const resizingHeightProps = useResizing({
		dimension: 'height',
		duration: token('motion.duration.short'),
		easing: token('motion.easing.out.practical'),
	});

	const resizingBothProps = useResizing({
		dimension: 'both',
		duration: token('motion.duration.short'),
		easing: token('motion.easing.out.practical'),
	});

	return (
		<div>
			{/* Width example */}
			<div css={styles.sectionHeading}>
				<Heading size="xsmall">Resizing width</Heading>
			</div>
			<div css={styles.buttonContainer}>
				{[1, 2, 3, 4, 5].map((number) => (
					<Button
						testId={`width-button--${number}`}
						key={number}
						isSelected={widthNum === number}
						onClick={() => {
							setWidthNum(number);
						}}
					>
						{number}
					</Button>
				))}
			</div>

			<Centered>
				<div data-testid="menu-width" {...resizingWidthProps} css={styles.horizontalContainer}>
					<StaggeredEntrance columns={widthNum}>
						{Array(widthNum)
							.fill(undefined)
							.map((_, index) => (
								<Motion key={index} xcss={styles.item} enteringAnimationXcss={styles.entering}>
									{logos[index][0]}
									<span>{logos[index][1]}</span>
								</Motion>
							))}
					</StaggeredEntrance>
				</div>
			</Centered>

			{/* Height example */}
			<div css={styles.sectionHeading}>
				<Heading size="xsmall">Resizing height</Heading>
			</div>
			<div css={styles.buttonContainer}>
				{[1, 2, 3, 4, 5].map((number) => (
					<Button
						testId={`height-button--${number}`}
						key={number}
						isSelected={heightNum === number}
						onClick={() => {
							setHeightNum(number);
						}}
					>
						{number}
					</Button>
				))}
			</div>

			<Centered>
				<div data-testid="menu-height" {...resizingHeightProps} css={styles.verticalContainer}>
					<StaggeredEntrance columns={1}>
						{Array(heightNum)
							.fill(undefined)
							.map((_, index) => (
								<Motion key={index} xcss={styles.item} enteringAnimationXcss={styles.entering}>
									{logos[index][0]}
									<span>{logos[index][1]}</span>
								</Motion>
							))}
					</StaggeredEntrance>
				</div>
			</Centered>

			{/* Both example - grid grows in both width (columns) and height (rows) simultaneously */}
			<div css={styles.sectionHeading}>
				<Heading size="xsmall">Resizing both</Heading>
			</div>
			<div css={styles.buttonContainer}>
				{[1, 2, 3, 4, 5].map((number) => (
					<Button
						testId={`both-button--${number}`}
						key={number}
						isSelected={bothNum === number}
						onClick={() => {
							setBothNum(number);
						}}
					>
						{number}
					</Button>
				))}
			</div>

			<Centered>
				<div data-testid="menu-both" {...resizingBothProps} css={styles.gridContainer}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
					<div css={styles.gridInner} style={{ gridTemplateColumns: `repeat(${bothNum}, auto)` }}>
						<StaggeredEntrance columns={bothNum}>
							{Array(bothNum * bothNum)
								.fill(undefined)
								.map((_, index) => (
									<Motion key={index} xcss={styles.item} enteringAnimationXcss={styles.entering}>
										{logos[index % logos.length][0]}
										<span>{logos[index % logos.length][1]}</span>
									</Motion>
								))}
						</StaggeredEntrance>
					</div>
				</div>
			</Centered>
		</div>
	);
};
