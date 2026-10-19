/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import IconButton from '@atlaskit/button/icon/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
import ShareIcon from '@atlaskit/icon/core/share';
import StoryIcon from '@atlaskit/icon/core/story';
import Image from '@atlaskit/image/image';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { MetricText } from '@atlaskit/primitives/compiled/metric-text';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import coreDesign from '../assets/core-design.jpg';

const articleStyles = cssMap({
	root: {
		maxWidth: '760px',
		marginInline: 'auto',
		// borderRadius: token('radius.large'),
		// boxShadow: token('elevation.shadow.raised'),
	},
});

const quoteStyles = cssMap({
	figure: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
	},
	pullText: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
		// The CSS reset adds literal quotation marks to every blockquote. The pull quote uses the icon
		// instead, so turn the reset's marks off here.
		'&::before': {
			content: 'none',
		},
		'&::after': {
			content: 'none',
		},
	},
	mark: {
		display: 'flex',
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
		borderRadius: token('radius.full'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	inline: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
		paddingInlineStart: token('space.300'),
		borderInlineStartWidth: token('border.width.selected'),
		borderInlineStartStyle: 'solid',
		borderInlineStartColor: token('color.border.brand'),
	},
	inlineCaption: {
		paddingBlockStart: token('space.100'),
		paddingInlineStart: token('space.300'),
	},
	pull: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
		borderBlockWidth: token('border.width'),
		borderBlockStyle: 'solid',
		borderBlockColor: token('color.border'),
		textAlign: 'center',
	},
});

const stats: { value: string; label: string; detail: string }[] = [
	{
		value: '63%',
		label: 'of routine drafting handed to AI',
		detail: 'Up 18 points since the first quarter',
	},
	{
		value: '4.2×',
		label: 'faster from question to first answer',
		detail: 'Median across 40 partner teams',
	},
	{
		value: '1,280',
		label: 'decisions with a linked source',
		detail: 'Every summary traceable to its inputs',
	},
	{
		value: '92%',
		label: 'of suggestions reviewed before shipping',
		detail: 'People stay accountable for the result',
	},
];

const statStyles = cssMap({
	figure: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
	},
	grid: {
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	},
	stat: {
		paddingBlockStart: token('space.200'),
		borderBlockStartWidth: token('border.width.selected'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border.bold'),
	},
});

/**
 * Shared article content for custom theme examples.
 */
export function EditorialBrief(): React.JSX.Element {
	return (
		<article>
			<Box padding="space.500" xcss={articleStyles.root}>
				<Stack space="space.400">
					<Stack space="space.gap.large">
						<Heading size="xxlarge">
							Intelligence is most useful when it stays connected to intent
						</Heading>
						<Text as="p" color="color.text.subtle">
							By the Applied Intelligence Group · 9 min read · October 2026
						</Text>
					</Stack>

					<Stack space="space.gap.xlarge">
						<Heading size="xlarge">The question behind the model</Heading>
						<Text as="p">
							AI systems are becoming remarkably capable at producing language, images, plans, and
							software. Capability alone, however, does not tell us whether a system is useful. The
							more important question is whether the system helps a person hold on to the thread of
							their own work: the constraints they have noticed, the trade-offs they are willing to
							make, and the people who will live with the result.
						</Text>
						<Text as="p">
							We think the next generation of AI should make context easier to recover rather than
							easier to discard. It should be able to summarize a week of decisions without
							flattening the disagreement that made those decisions meaningful. It should make a
							draft easier to begin, while leaving the author enough room to recognize their own
							voice in the finished work.
						</Text>
					</Stack>

					<Stack space="space.gap.xlarge">
						<Heading size="large">AI works best as a collaborator</Heading>
						<Text as="p">
							The promise of automation is often described as a handoff: a person supplies an
							instruction, a machine completes a task, and the work disappears from view. That model
							is appealing because it is simple, but it is not how consequential work is done.
							Important work changes as evidence arrives. It benefits from a second question, a
							revised assumption, and a teammate who can explain why a seemingly small detail
							matters.
						</Text>
						<Text as="p">
							A collaborative system can participate in that motion. It can collect the loose ends
							of a project, propose a starting point, and surface patterns that would have been
							expensive to find manually. The person remains responsible for direction; the system
							makes the space of possible directions easier to see.
						</Text>
					</Stack>

					<Box as="figure" xcss={quoteStyles.figure}>
						<Box as="blockquote" xcss={quoteStyles.inline}>
							<Text as="p" size="large">
								Good AI does not replace judgement. It gives judgement a better view of the work.
							</Text>
						</Box>
						<Box as="figcaption" xcss={quoteStyles.inlineCaption}>
							<Text size="small" color="color.text.subtle">
								— <cite>Design principles for applied intelligence</cite>
							</Text>
						</Box>
					</Box>

					<Stack space="space.gap.xlarge">
						<Heading size="medium">Shared context is a capability</Heading>
						<Text as="p">
							Most teams do not lack information; they lack a reliable way to connect it. The brief
							lives in one place, the customer detail in another, and the reasoning behind a
							decision in a conversation that happened three months ago. AI can help assemble those
							fragments into a useful working picture, but it has to make its sources and
							uncertainty visible. A fluent answer without a traceable path is only a polished
							guess.
						</Text>
						<Text as="p">
							That is why interface design matters as much as model design. A useful system shows
							where an idea came from, offers a way to correct it, and treats a person’s edits as
							signal rather than failure. It should make a team more aligned without making every
							conversation sound the same.
						</Text>
					</Stack>

					<Box as="figure" xcss={statStyles.figure}>
						<Stack space="space.gap.xlarge">
							<Box as="figcaption">
								<Text size="small" weight="semibold" color="color.text.subtle">
									By the numbers: six months with our design partners (illustrative)
								</Text>
							</Box>
							<Grid gap="space.gap.xxlarge" xcss={statStyles.grid}>
								{stats.map((stat) => (
									<Box key={stat.label} xcss={statStyles.stat}>
										<Stack space="space.gap.xsmall">
											<MetricText size="large">{stat.value}</MetricText>
											<Text weight="medium">{stat.label}</Text>
											<Text size="small" color="color.text.subtle">
												{stat.detail}
											</Text>
										</Stack>
									</Box>
								))}
							</Grid>
						</Stack>
					</Box>

					<Box as="figure" xcss={quoteStyles.pull}>
						<Stack space="space.gap.xlarge" alignInline="center">
							<Box xcss={quoteStyles.mark}>
								<QuotationMarkIcon label="" color={token('color.icon.subtle')} />
							</Box>
							<Box as="blockquote" xcss={quoteStyles.pullText}>
								<Heading as="div" size="large">
									An intelligent tool earns trust by making the next thoughtful action easier, not
									by making thought invisible.
								</Heading>
							</Box>
							<Box as="figcaption">
								<Text size="small" color="color.text.subtle">
									Mara Okafor, Head of Applied Intelligence
								</Text>
							</Box>
						</Stack>
					</Box>

					<Stack space="space.gap.large">
						<Heading size="small">Solid foundations make generous products</Heading>
						<Text as="p">
							The systems behind an AI experience are easy to overlook when they work well. They are
							the evaluation loops that catch a regression before it reaches a customer, the
							permissions model that keeps sensitive context in the right hands, and the
							infrastructure that lets a team improve a feature without rebuilding the world around
							it. Reliability is not separate from creativity; it is what lets people experiment
							without fearing that every experiment will become an incident.
						</Text>
					</Stack>

					<Stack space="space.gap.large">
						<Heading size="xsmall">Learning by doing, and showing the work</Heading>
						<Text as="p">
							The most honest way to understand an AI system is to put it in the hands of people who
							have real work to finish. Their corrections reveal what a benchmark cannot: which
							moments feel effortless, where a suggestion carries the wrong assumption, and what a
							team needs to stay accountable for its own decisions. Product use is not merely a
							destination for research. It is one of the ways research learns.
						</Text>
					</Stack>

					<Stack space="space.gap.medium">
						<Heading size="xxsmall">An invitation</Heading>
						<Text as="p" color="color.text.subtle">
							Bring a difficult, unfinished question. The best collaboration begins before anyone
							pretends to know the answer.
						</Text>
					</Stack>

					<Inline alignBlock="center" space="space.gap.medium">
						<IconButton icon={ShareIcon} label="Share article" />
						<IconButton icon={StoryIcon} label="Save for later" />
					</Inline>
					<Image src={coreDesign} alt="Core design" />
				</Stack>
			</Box>
		</article>
	);
}
