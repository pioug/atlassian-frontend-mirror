/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';
import { useIntl } from 'react-intl-next';
import { jsx, css, cssMap } from '@compiled/react';

import { token, useThemeObserver } from '@atlaskit/tokens';
import { CloseButton, type OnCloseHandler } from '@atlaskit/modal-dialog';
import { Tab, TabList } from '@atlaskit/tabs';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives/compiled';
import { IconButton } from '@atlaskit/button/new';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Heading from '@atlaskit/heading';
import { useModal } from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import CrossIcon from '@atlaskit/icon/core/cross';
import { ResourcedEmoji } from '@atlaskit/emoji/element';
import { fg } from '@atlaskit/platform-feature-flags';

import { messages } from '../shared/i18n';
import { Counter } from './Counter';
import { type ReactionSummary } from '../types';
import { RESOURCED_EMOJI_COMPACT_HEIGHT } from '../shared/constants';

const styles = cssMap({
	leftNavigationStyle: {
		marginTop: token('space.050'),
		alignSelf: 'self-start',
		paddingLeft: token('space.200'),
		paddingBottom: token('space.150'),
	},

	rightNavigationStyle: {
		marginTop: token('space.050'),
		alignSelf: 'self-start',
		marginLeft: 'auto',
		marginRight: token('space.100'),
	},

	fullWidthStyle: {
		width: '100%',
		paddingTop: token('space.300'),
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
		paddingBlockEnd: token('space.400'),
	},

	emoji: {
		transformOrigin: 'center center 0',
		paddingInlineStart: token('space.100'),
		paddingBlock: token('space.050'),
		paddingInlineEnd: token('space.050'),
	},

	counterStyle: {
		marginTop: token('space.025'),
	},
});

const REACTIONS_CONTAINER_WIDTH = 56;
const REACTION_CONTAINER_HEIGHT = 40;

const customTabListStyles = css({
	overflow: 'auto',
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'div[role=tablist]': {
		flexGrow: 1,
		// paddingInline exists to maintain styling prior to @atlaskit/tabs update that removed baked in horizontal padding
		paddingInline: token('space.100', '8px'),
		// we add our own border bottom below since tablist border is not full width
		'&::before': {
			backgroundColor: 'transparent',
		},
	},
	width: '100%',
	alignItems: 'flex-start',
	borderBottom: `1px solid ${token('color.border', '#EBECF0')}`,
});

const customTabWrapper = cssMap({
	base: {
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.disabled::after': {
			content: '""',
			position: 'absolute',
			left: '0px',
			top: '0px',
			width: `${REACTIONS_CONTAINER_WIDTH}px`,
			height: `${REACTION_CONTAINER_HEIGHT}px`,
			zIndex: 0,
			background: `linear-gradient(270deg, rgba(255, 255, 255, 0.95) 40.23%, rgba(255, 255, 255, 0.55) 58.33%, rgba(255, 255, 255, 0) 77.49%)`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.disabled + &.disabled::after': {
			content: '""',
			position: 'absolute',
			left: '0px',
			top: '0px',
			width: `${REACTIONS_CONTAINER_WIDTH}px`,
			height: `${REACTION_CONTAINER_HEIGHT}px`,
			zIndex: 0,
			background: `linear-gradient(90deg, rgba(255, 255, 255, 0.95) 40.23%, rgba(255, 255, 255, 0.55) 58.33%, rgba(255, 255, 255, 0) 77.49%)`,
		},
	},
	darkTheme: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.disabled::after': {
			background: `linear-gradient(270deg, rgba(34, 39, 43, 0.95) 40.23%, rgba(34, 39, 43, 0.55) 58.33%, rgba(34, 39, 43, 0) 77.49%)`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&.disabled + &.disabled::after': {
			background: `linear-gradient(90deg, rgba(34, 39, 43, 0.95) 40.23%, rgba(34, 39, 43, 0.55) 58.33%, rgba(34, 39, 43, 0) 77.49%)`,
		},
	},
});

const firstElement = css({
	paddingLeft: token('space.200', '16px'),
});

interface ReactionsDialogModalHeaderProps {
	totalReactionsCount: number;
	handlePreviousPage: () => void;
	handleNextPage: () => void;
	currentPage: number;
	maxPages: number;
	emojiProvider: Promise<EmojiProvider>;
	currentReactions: ReactionSummary[];
	handleCloseReactionsDialog: OnCloseHandler;
}

type CloseButtonProp = Pick<ReactionsDialogModalHeaderProps, 'handleCloseReactionsDialog'>;
const CloseButtonCustom = ({ handleCloseReactionsDialog }: CloseButtonProp) => {
	const intl = useIntl();

	return (
		<IconButton
			onClick={handleCloseReactionsDialog}
			icon={CrossIcon}
			label={intl.formatMessage(messages.closeReactionsDialog)}
			appearance="subtle"
			isTooltipDisabled={false}
		/>
	);
};

type LeftNavigationButtonProp = Pick<ReactionsDialogModalHeaderProps, 'handlePreviousPage'>;
const LeftNavigationButton = ({ handlePreviousPage }: LeftNavigationButtonProp) => {
	const intl = useIntl();

	return (
		<Flex xcss={styles.leftNavigationStyle}>
			<IconButton
				spacing="compact"
				onClick={handlePreviousPage}
				icon={(iconProps) => <ChevronLeftIcon {...iconProps} size="small" />}
				label={intl.formatMessage(messages.leftNavigateLabel)}
				isTooltipDisabled={false}
			/>
		</Flex>
	);
};

type RightNavigationButtonProp = Pick<ReactionsDialogModalHeaderProps, 'handleNextPage'>;
const RightNavigationButton = ({ handleNextPage }: RightNavigationButtonProp) => {
	const intl = useIntl();

	return (
		<Flex xcss={styles.rightNavigationStyle}>
			<IconButton
				spacing="compact"
				onClick={handleNextPage}
				icon={(iconProps) => <ChevronRightIcon {...iconProps} size="small" />}
				label={intl.formatMessage(messages.rightNavigateLabel)}
				isTooltipDisabled={false}
			/>
		</Flex>
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
	handleCloseReactionsDialog,
}: ReactionsDialogModalHeaderProps) => {
	const [cache, setCache] = useState<{ [key: string]: string }>({});

	const { titleId } = useModal();
	const intl = useIntl();
	const { colorMode } = useThemeObserver();

	const isSinglePage = maxPages === 1;
	const isOnFirstPage = currentPage === 1;
	const isOnLastPage = currentPage === maxPages;

	const handleMouseEnter = (reaction: ReactionSummary) => {
		const { emojiId } = reaction;

		if (!emojiId || cache[emojiId]) {
			return;
		}

		(async () => {
			// Note: not a network request e.g. ReactedUsersQuery
			const provider = await emojiProvider;
			const emoji = await provider.findByEmojiId({
				shortName: '',
				id: emojiId,
			});

			if (emoji?.name) {
				// capitalize first letter of each string
				const capitalizedName = emoji.name.replace(/\b\w/g, (char) => char.toUpperCase());
				setCache((prevCache) => ({
					...prevCache,
					[emojiId]: capitalizedName,
				}));
			}
		})();
	};

	return (
		<Stack>
			<Flex
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				xcss={styles.fullWidthStyle}
			>
				<Heading size="medium" id={titleId}>
					{intl.formatMessage(messages.reactionsCount, {
						count: totalReactionsCount,
					})}
				</Heading>
				{fg('platform-make-accessible-close-button') ? (
					<CloseButton onClick={handleCloseReactionsDialog} />
				) : (
					<CloseButtonCustom handleCloseReactionsDialog={handleCloseReactionsDialog} />
				)}
			</Flex>
			<Inline>
				<div css={customTabListStyles} id="reactions-dialog-tabs-list">
					{!isSinglePage && !isOnFirstPage && (
						<LeftNavigationButton handlePreviousPage={handlePreviousPage} />
					)}
					<TabList>
						{/* Actual tabs - can't move to its own component as React Fragment doesn't play well with TabList */}
						{currentReactions.map((reaction, index) => {
							const emojiId = { id: reaction.emojiId, shortName: '' };

							return (
								// eslint-disable-next-line jsx-a11y/no-static-element-interactions
								<div
									css={[
										customTabWrapper.base,
										colorMode === 'dark' && customTabWrapper.darkTheme,
										index === 0 && firstElement,
									]}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className="reaction-elements"
									key={reaction.emojiId}
									data-testid={emojiId?.id}
									onMouseEnter={() => {
										handleMouseEnter(reaction);
									}}
								>
									<Tab>
										<Tooltip
											content={cache[reaction.emojiId]}
											canAppear={() => !!cache[reaction.emojiId]}
										>
											<Flex justifyContent="center" alignItems="center" direction="row">
												<Box xcss={styles.emoji}>
													<ResourcedEmoji
														emojiProvider={emojiProvider}
														emojiId={emojiId}
														fitToHeight={RESOURCED_EMOJI_COMPACT_HEIGHT}
														showTooltip
													/>
												</Box>
												<Box xcss={styles.counterStyle}>
													<Counter value={reaction.count} />
												</Box>
											</Flex>
										</Tooltip>
									</Tab>
								</div>
							);
						})}
						{!isSinglePage && !isOnLastPage && (
							<RightNavigationButton handleNextPage={handleNextPage} />
						)}
					</TabList>
				</div>
			</Inline>
		</Stack>
	);
};
