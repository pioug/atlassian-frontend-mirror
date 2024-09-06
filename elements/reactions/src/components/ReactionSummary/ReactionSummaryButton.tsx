import React, { forwardRef, useMemo } from 'react';
import { useIntl } from 'react-intl-next';
import { ResourcedEmoji } from '@atlaskit/emoji';
import { Inline, xcss, Box } from '@atlaskit/primitives';
import { messages } from '../../shared/i18n';
import { type ReactionSummary } from '../../types';
import { Counter } from '../Counter';
import { ReactionButton } from '../Reaction';
import { type ReactionsProps } from '../Reactions/Reactions';

const emojiStyle = xcss({
	transformOrigin: 'center center 0',
	lineHeight: '12px',
});

const buttonStyle = xcss({
	paddingTop: 'space.050',
	paddingRight: 'space.050',
	paddingBottom: 'space.050',
	paddingLeft: 'space.100',
});

const opaqueBackgroundStyles = xcss({
	backgroundColor: 'elevation.surface',
	':hover': {
		backgroundColor: 'elevation.surface.hovered',
	},
	':active': {
		backgroundColor: 'elevation.surface.pressed',
	},
});

const containerStyle = xcss({
	position: 'relative',
});

const hideBorderStyle = xcss({
	border: 'none',
});

interface ReactionSummaryButtonProps extends Pick<ReactionsProps, 'emojiProvider' | 'reactions'> {
	/**
	 * event handler when the summary button is clicked to view all reactions
	 */
	onClick: () => void;

	/**
	 * The number of emojis to show in the summary button
	 */
	emojisToShow?: number;

	/**
	 * Optional prop for using an opaque button background instead of a transparent background
	 */
	showOpaqueBackground?: boolean;

	/**
	 * Optional prop for applying subtle styling to reaction summary button
	 */
	subtleReactionsSummaryAndPicker?: boolean;
}

/**
 * Test id for summary reaction wrapper button
 */
export const RENDER_SUMMARY_BUTTON_TESTID = 'reaction-summary-button';

/**
 * Test id for emojis displayed inside summary button. All emoji's in the summary button will have this test id
 */
export const RENDER_SUMMARY_EMOJI_TESTID = 'summary-emoji-display';

// forwardRef is used here so that the parent popup component can properly interact with the button
export const ReactionSummaryButton = forwardRef(
	(
		{
			emojiProvider,
			reactions = [],
			emojisToShow = 3,
			onClick,
			showOpaqueBackground = false,
			subtleReactionsSummaryAndPicker = false,
		}: ReactionSummaryButtonProps,
		ref: React.Ref<HTMLDivElement>,
	) => {
		const intl = useIntl();

		// Helper function to sort reactions by count and return top N
		const getTopReactions = (reactions: ReactionSummary[], topN: number): ReactionSummary[] => {
			return [...reactions].sort((a, b) => b.count - a.count).slice(0, topN);
		};

		const totalReactionsCount = useMemo(() => {
			return reactions.reduce((accum: number, current: ReactionSummary) => {
				return (accum += current?.count || 0);
			}, 0);
		}, [reactions]);

		const topReactions = useMemo(
			() => getTopReactions(reactions, emojisToShow),
			[emojisToShow, reactions],
		);

		const buttonStyles = showOpaqueBackground ? [opaqueBackgroundStyles] : [];

		const subtleSummaryStyles = subtleReactionsSummaryAndPicker ? [hideBorderStyle] : [];

		return (
			<Box xcss={containerStyle} ref={ref}>
				<ReactionButton
					onClick={onClick}
					testId={RENDER_SUMMARY_BUTTON_TESTID}
					ariaLabel={intl.formatMessage(messages.summary)}
					additionalStyles={[...buttonStyles, ...subtleSummaryStyles]}
				>
					<Inline space="space.050" xcss={buttonStyle}>
						{topReactions.map((reaction) => (
							<Box xcss={emojiStyle} testId={RENDER_SUMMARY_EMOJI_TESTID}>
								<ResourcedEmoji
									key={reaction.emojiId}
									emojiProvider={emojiProvider}
									emojiId={{ id: reaction.emojiId, shortName: '' }}
									fitToHeight={16}
								/>
							</Box>
						))}
					</Inline>
					<Counter value={totalReactionsCount} />
				</ReactionButton>
			</Box>
		);
	},
);
