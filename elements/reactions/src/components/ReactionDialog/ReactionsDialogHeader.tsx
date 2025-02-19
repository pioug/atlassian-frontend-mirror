/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';
import { useIntl } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import { type ThemeColorModes, token, useThemeObserver } from '@atlaskit/tokens';
import { type OnCloseHandler } from '@atlaskit/modal-dialog';
import { Tab, TabList } from '@atlaskit/tabs';
import { Box, Flex, xcss, Stack, Inline } from '@atlaskit/primitives';
import { IconButton } from '@atlaskit/button/new';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import Heading from '@atlaskit/heading';
import { useModal } from '@atlaskit/modal-dialog';
import Tooltip from '@atlaskit/tooltip';
import ChevronLeftIcon from '@atlaskit/icon/utility/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';
import CloseIcon from '@atlaskit/icon/core/close';
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

const leftNavigationStyle = xcss({
	marginTop: 'space.050',
	alignSelf: 'self-start',
	paddingLeft: 'space.200',
	paddingBottom: 'space.150',
});

const rightNavigationStyle = xcss({
	marginTop: 'space.050',
	alignSelf: 'self-start',
	marginLeft: 'auto',
	marginRight: 'space.100',
});

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
		// we add our own border bottom below since tablist border is not full width
		'&::before': {
			backgroundColor: 'transparent',
		},
	},
	width: ' 100%',
	alignItems: 'flex-start',
	borderBottom: `1px solid ${token('color.border', '#EBECF0')}`,
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
	currentReactions: ReactionSummary[];
	handleCloseReactionsDialog: OnCloseHandler;
}

type CloseButtonProp = Pick<ReactionsDialogModalHeaderProps, 'handleCloseReactionsDialog'>;
const CloseButton = ({ handleCloseReactionsDialog }: CloseButtonProp) => {
	const intl = useIntl();

	return (
		<IconButton
			onClick={handleCloseReactionsDialog}
			icon={CloseIcon}
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
		<Flex xcss={leftNavigationStyle}>
			<IconButton
				spacing="compact"
				onClick={handlePreviousPage}
				icon={ChevronLeftIcon}
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
		<Flex xcss={rightNavigationStyle}>
			<IconButton
				spacing="compact"
				onClick={handleNextPage}
				icon={ChevronRightIcon}
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

	const handleMouseEnterTab = (reaction: ReactionSummary) => {
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
				xcss={fullWidthStyle}
			>
				<Heading size="medium" id={titleId}>
					{intl.formatMessage(messages.reactionsCount, {
						count: totalReactionsCount,
					})}
				</Heading>
				<CloseButton handleCloseReactionsDialog={handleCloseReactionsDialog} />
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
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									css={[customTabWrapper(colorMode), index === 0 ? firstElement : []]}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className="reaction-elements"
									key={reaction.emojiId}
									data-testid={emojiId?.id}
									onMouseEnter={() => {
										handleMouseEnterTab(reaction);
									}}
								>
									<Tab>
										<Tooltip
											content={cache[reaction.emojiId]}
											canAppear={() => !!cache[reaction.emojiId]}
										>
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
