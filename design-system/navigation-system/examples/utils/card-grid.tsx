/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import IssuesIcon from '@atlaskit/icon/core/bug';
import ReportsIcon from '@atlaskit/icon/core/chart-bar';
import ProjectIcon from '@atlaskit/icon/core/project';
import StarIcon from '@atlaskit/icon/core/star-starred';
import { Inline, Text } from '@atlaskit/primitives/compiled';
import { SimpleTag as Tag } from '@atlaskit/tag';
import { token } from '@atlaskit/tokens';

const gridStyles = cssMap({
	root: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
		gap: token('space.300'),
		marginBlockStart: token('space.400'),
	},
});

const cardStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.large'),
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		gap: token('space.150'),
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: token('elevation.shadow.raised'),
		},
	},
});

const cardTypes = [
	{ icon: ProjectIcon, title: 'Project', type: 'Project', color: 'blue' },
	{ icon: IssuesIcon, title: 'Issue', type: 'Bug', color: 'red' },
	{ icon: ReportsIcon, title: 'Report', type: 'Analytics', color: 'green' },
	{ icon: StarIcon, title: 'Feature', type: 'Enhancement', color: 'purple' },
];

// Generates a "seemingly random" number between 1 and 30, deterministically based on the seed
function getRandomNumber(seed: number) {
	const x = Math.sin(seed * 12.9898) * 43758.5453;
	return Math.floor((x - Math.floor(x)) * 30) + 1;
}

/**
 * A grid of cards, used for simulating a large, complex page.
 */
export function CardGrid(): JSX.Element {
	return (
		<div css={gridStyles.root}>
			{Array.from({ length: 100 }, (_, i) => {
				const cardType = cardTypes[i % cardTypes.length];
				const IconComponent = cardType.icon;

				return (
					<div key={i} css={cardStyles.root}>
						<Inline alignBlock="center" space="space.150">
							<IconComponent label="" />
							<Heading size="small">
								{cardType.title} #{i + 1}
							</Heading>
						</Inline>
						<Text color="color.text.subtlest">
							This is a sample {cardType.title.toLowerCase()} card with some content to test the
							performance of View Transitions API with lots of DOM elements. The animation should
							remain smooth even with many cards present.
						</Text>
						<Inline alignBlock="center" spread="space-between">
							<Tag text={cardType.type} />
							<Text size="small" color="color.text.subtle">
								Updated {getRandomNumber(i)} days ago
							</Text>
						</Inline>
					</div>
				);
			})}
		</div>
	);
}
