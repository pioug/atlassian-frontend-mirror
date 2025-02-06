/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useIntl } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import { type ThemeColorModes, token, useThemeObserver } from '@atlaskit/tokens';
import { Tab, TabList } from '@atlaskit/tabs';
import { Box, Flex, xcss, Stack } from '@atlaskit/primitives';
import { IconButton } from '@atlaskit/button/new';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Heading from '@atlaskit/heading';
import { useModal } from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import ChevronLeftIcon from '@atlaskit/icon/utility/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';
import { ResourcedEmoji } from '@atlaskit/emoji/element';

import { messages } from '../../shared/i18n';
import { Counter } from '../Counter';
import { type ReactionSummary } from '../../types';

const REACTIONS_CONTAINER_WIDTH = 56;
const REACTION_CONTAINER_HEIGHT = 40;

type containerEdgeAngleType = {
	rightEdge: number;
	leftEdge: number;
};

const containerEdgeAngle: containerEdgeAngleType = {
	rightEdge: 270,
	leftEdge: 90,
};

const fadedCss = (edge: keyof containerEdgeAngleType, theme?: ThemeColorModes) =>
	css({
		content: '""',
		position: 'absolute',
		left: '0px',
		top: '0px',
		width: `${REACTIONS_CONTAINER_WIDTH}px`,
		height: `${REACTION_CONTAINER_HEIGHT}px`,
		zIndex: 0,
		background:
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			theme === 'dark'
				? `linear-gradient(${containerEdgeAngle[edge]}deg, rgba(34, 39, 43, 0.95) 40.23%, rgba(34, 39, 43, 0.55) 58.33%, rgba(34, 39, 43, 0) 77.49%)`
				: `linear-gradient(${containerEdgeAngle[edge]}deg, rgba(255, 255, 255, 0.95) 40.23%, rgba(255, 255, 255, 0.55) 58.33%, rgba(255, 255, 255, 0) 77.49%)`,
	});

const customTabListStyles = css({
	overflow: 'auto',
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'div[role=tablist]': {
		flexGrow: 1,
		// paddingInline exists to maintain styling prior to @atlaskit/tabs update that removed baked in horizontal padding
		paddingInline: token('space.100', '8px'),
	},
});

const customTabWrapper = (theme?: ThemeColorModes) =>
	css({
		flexShrink: 0,
		display: 'flex',
		flexDirection: 'column',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: `${REACTIONS_CONTAINER_WIDTH}px`,
		boxSizing: 'border-box',
		position: 'relative',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> div': {
			minWidth: `${REACTIONS_CONTAINER_WIDTH}px`,
			minHeight: `${REACTION_CONTAINER_HEIGHT}px`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
			padding: '0px !important',
			alignItems: 'center',
			justifyContent: 'center',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > span': {
			minHeight: '16px',
			minWidth: '16px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'&.disabled:after': fadedCss('rightEdge', theme),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		'&.disabled + &.disabled:after': fadedCss('leftEdge', theme),
	});

const firstElement = css({
	paddingLeft: token('space.200', '16px'),
});

const fullWidthStyle = xcss({
	width: '100%',
	padding: 'space.300',
	paddingBlockEnd: 'space.400',
});

const emojiStyles = xcss({
	transformOrigin: 'center center 0',
	paddingInlineStart: 'space.100',
	paddingBlock: 'space.050',
	paddingInlineEnd: 'space.050',
});

const counterStyle = xcss({
	marginTop: 'space.025',
});

interface ReactionsDialogModalHeaderProps {
	totalReactionsCount: number;
	handlePreviousPage: () => void;
	handleNextPage: () => void;
	currentPage: number;
	maxPages: number;
	emojiProvider: Promise<EmojiProvider>;
	selectedEmojiId: string;
	currentReactions: ReactionSummary[];
}

type ReactionsTabsProps = Pick<
	ReactionsDialogModalHeaderProps,
	'currentReactions' | 'emojiProvider' | 'selectedEmojiId'
>;

const ReactionsTabs = ({
	currentReactions,
	emojiProvider,
	selectedEmojiId,
}: ReactionsTabsProps) => {
	const { colorMode } = useThemeObserver();
	return (
		<div css={customTabListStyles} id="reactions-dialog-tabs-list">
			<TabList>
				{currentReactions.map((reaction, index) => {
					const emojiId = { id: reaction.emojiId, shortName: '' };

					return (
						<div
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							css={[customTabWrapper(colorMode), index === 0 ? firstElement : []]}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className="reaction-elements"
							key={reaction.emojiId}
							data-testid={emojiId?.id}
						>
							<Tab>
								<Flex justifyContent="center" alignItems="center" direction="row">
									<Box xcss={emojiStyles}>
										<ResourcedEmoji
											emojiProvider={emojiProvider}
											emojiId={emojiId}
											fitToHeight={16}
											showTooltip
										/>
									</Box>
									<Box xcss={counterStyle}>
										<Counter value={reaction.count} />
									</Box>
								</Flex>
							</Tab>
						</div>
					);
				})}
			</TabList>
		</div>
	);
};

export const ReactionsDialogHeader = ({
	totalReactionsCount,
	handlePreviousPage,
	handleNextPage,
	currentPage,
	maxPages,
	currentReactions,
	emojiProvider,
	selectedEmojiId,
}: ReactionsDialogModalHeaderProps) => {
	const { titleId } = useModal();
	const intl = useIntl();

	const isSinglePage = maxPages === 1;
	const isOnFirstPage = currentPage === 1;
	const isOnLastPage = currentPage === maxPages;

	return (
		<Stack>
			<Flex
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				xcss={fullWidthStyle}
			>
				<Heading size="medium" id={titleId}>
					{intl.formatMessage(messages.reactionsCount, {
						count: totalReactionsCount,
					})}
				</Heading>
				{!isSinglePage && (
					<Flex alignItems="center" gap="space.100">
						<Tooltip
							content={intl.formatMessage(messages.leftNavigateLabel)}
							canAppear={() => !isOnFirstPage}
						>
							{(tooltipProps) => (
								<IconButton
									{...tooltipProps}
									isDisabled={isOnFirstPage}
									onClick={handlePreviousPage}
									icon={ChevronLeftIcon}
									label={intl.formatMessage(messages.leftNavigateLabel)}
								/>
							)}
						</Tooltip>
						<Tooltip
							content={intl.formatMessage(messages.rightNavigateLabel)}
							canAppear={() => !isOnLastPage}
						>
							{(tooltipProps) => (
								<IconButton
									{...tooltipProps}
									onClick={handleNextPage}
									isDisabled={isOnLastPage}
									icon={ChevronRightIcon}
									label={intl.formatMessage(messages.rightNavigateLabel)}
								/>
							)}
						</Tooltip>
					</Flex>
				)}
			</Flex>
			<ReactionsTabs
				currentReactions={currentReactions}
				emojiProvider={emojiProvider}
				selectedEmojiId={selectedEmojiId}
			/>
		</Stack>
	);
};
