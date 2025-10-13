import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type EmojiDescription, type EmojiProvider, toEmojiId } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { getTestEmojiRepository } from '@atlaskit/util-data-test/get-test-emoji-repository';
import {
	type ReactionSummary,
	type ReactionClick,
	type ReactionMouseEnter,
	type User,
} from '../types';
import {
	mockReactDomWarningGlobal,
	renderWithIntl,
	useFakeTimers,
} from '../__tests__/_testing-library';
import { RENDER_FLASHANIMATION_TESTID } from './FlashAnimation';
import { Reaction, RENDER_REACTION_TESTID } from './Reaction';

const emojiRepository = getTestEmojiRepository();
const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

const grinning: EmojiDescription = emojiRepository.findByShortName(
	':grinning:',
) as EmojiDescription;

jest.mock('./ReactionParticleEffect', () => {
	return {
		ReactionParticleEffect: () => <>ReactionParticleEffect</>,
	};
});

/**
 * create a summary reaction object
 * @param count number of selections of the emoji
 * @param reacted does the emoji been clicked
 * @param users list of users selecting the emoji
 * @returns ReactionSummary object
 */
const getReaction = (
	count: number,
	reacted: boolean,
	users?: User[],
	optimistic?: boolean,
): ReactionSummary => ({
	ari,
	containerAri,
	emojiId: toEmojiId(grinning).id!,
	count,
	reacted,
	users,
});

/**
 * Render a <Reaction /> component with the given props.
 * @param reacted does the emoji been clicked
 * @param count number of selections of the emoji
 * @param onClick click handler
 * @param onMouseEnter onMouseEnter handler
 * @param enableFlash show custom animation or render as standard without animation (defaults to false)
 * @param onEvent onEvent for the analytics engine handler
 * @param users list of users reacted to the emoji clicked
 * @param showParticleEffect flag that adds particle effect to reactions
 * @param optimistic flag that adds optimistic image URL to reactions
 * @returns JSX.Element
 */
const renderReaction = ({
	reacted,
	count,
	onClick = () => {},
	onMouseEnter = () => {},
	enableFlash = false,
	onEvent = () => {},
	users = [],
	showParticleEffect = false,
	showOpaqueBackground = false,
	isViewOnly = false,
	showSubtleStyle = false,
	optimistic = false,
}: {
	count: number;
	enableFlash?: boolean;
	isViewOnly?: boolean;
	onClick?: ReactionClick;
	onEvent?: (event: UIAnalyticsEvent, channel?: string) => void;
	onMouseEnter?: ReactionMouseEnter;
	optimistic?: boolean;
	reacted: boolean;
	showOpaqueBackground?: boolean;
	showParticleEffect?: boolean;
	showSubtleStyle?: boolean;
	users?: User[];
}) =>
	renderWithIntl(
		<AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
			<Reaction
				reaction={getReaction(count, reacted, users, optimistic)}
				emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				flash={enableFlash}
				showParticleEffect={showParticleEffect}
				showOpaqueBackground={showOpaqueBackground}
				isViewOnly={isViewOnly}
				showSubtleStyle={showSubtleStyle}
			/>
		</AnalyticsListener>,
	);

describe('@atlaskit/reactions/components/Reaction', () => {
	mockReactDomWarningGlobal();
	useFakeTimers();

	it('should render emoji with resolved emoji data', async () => {
		const count = 1;
		const reacted = false;
		renderReaction({ reacted, count });

		const emojiButton = await screen.findByTestId(RENDER_REACTION_TESTID);
		expect(emojiButton).toBeInTheDocument();
		expect(emojiButton).toHaveAttribute('data-emoji-id', grinning.id);
	});

	it('should call onClick on click', async () => {
		const count = 1;
		const reacted = false;
		const onClickSpy = jest.fn();
		const onMouseEnterSpy = jest.fn();
		renderReaction({ reacted, count, onClick: onClickSpy, onMouseEnter: onMouseEnterSpy });

		const emojiButton = await screen.findByTestId(RENDER_REACTION_TESTID);
		expect(emojiButton).toBeInTheDocument();

		act(() => {
			fireEvent.click(emojiButton);
		});
		expect(onClickSpy).toHaveBeenCalled();
	});

	it('should delegate flash to Flash component', async () => {
		const count = 1;
		const reacted = false;
		const enableFlash = true;
		const onClickSpy = jest.fn();
		const onMouseEnterSpy = jest.fn();

		renderReaction({
			reacted,
			count,
			onClick: onClickSpy,
			onMouseEnter: onMouseEnterSpy,
			enableFlash,
		});
		act(() => {
			jest.runAllTimers();
		});

		const flashAnimationWrapper = await screen.findByTestId(RENDER_FLASHANIMATION_TESTID);
		expect(flashAnimationWrapper).toBeInTheDocument();
		expect(flashAnimationWrapper).toHaveCompiledCss({
			animationDuration: '.7s',
			animationTimingFunction: 'ease-in-out',
		});
	});

	it('should render ReactionTooltip', async () => {
		const count = 1;
		const reacted = false;
		const onClickSpy = jest.fn();
		const onMouseEnterSpy = jest.fn();
		renderReaction({ reacted, count, onClick: onClickSpy, onMouseEnter: onMouseEnterSpy });

		const content = await screen.findByRole('button');
		expect(content).toBeInTheDocument();
		const tooltipWrapper = await screen.findByRole('presentation');
		expect(tooltipWrapper).toBeInTheDocument();
	});

	it('should render with reacted background if reaction is reacted', async () => {
		const count = 3;
		const reacted = true;
		const onClickSpy = jest.fn();
		const onMouseEnterSpy = jest.fn();
		const enableFlash = false;
		const onEventSpy = jest.fn();
		const users: User[] = [];
		const showParticleEffect = false;
		const showOpaqueBackground = true;
		renderReaction({
			reacted,
			count,
			onClick: onClickSpy,
			onMouseEnter: onMouseEnterSpy,
			enableFlash,
			onEvent: onEventSpy,
			users,
			showParticleEffect,
			showOpaqueBackground,
		});
		const btn = await screen.findByRole('button');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveCompiledCss('background-color', 'var(--ds-background-selected,#e9f2ff)');
		expect(btn).toHaveCompiledCss('border-color', 'var(--ds-border-selected,#0c66e4)');
	});

	it('should render with opaque background if showOpaqueBackground is true', async () => {
		const count = 3;
		const reacted = false;
		const onClickSpy = jest.fn();
		const onMouseEnterSpy = jest.fn();
		const enableFlash = false;
		const onEventSpy = jest.fn();
		const users: User[] = [];
		const showParticleEffect = false;
		const showOpaqueBackground = true;
		renderReaction({
			reacted,
			count,
			onClick: onClickSpy,
			onMouseEnter: onMouseEnterSpy,
			enableFlash,
			onEvent: onEventSpy,
			users,
			showParticleEffect,
			showOpaqueBackground,
		});
		const btn = await screen.findByRole('button');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveCompiledCss('background-color', 'var(--ds-surface,#fff)');
	});

	it('should not render with border if isViewOnly is true', async () => {
		const count = 3;
		const reacted = false;
		const onClickSpy = jest.fn();
		const onMouseEnterSpy = jest.fn();
		const enableFlash = false;
		const onEventSpy = jest.fn();
		const users: User[] = [];
		const showParticleEffect = false;
		const showOpaqueBackground = true;
		const isViewOnly = true;
		renderReaction({
			reacted,
			count,
			onClick: onClickSpy,
			onMouseEnter: onMouseEnterSpy,
			enableFlash,
			onEvent: onEventSpy,
			users,
			showParticleEffect,
			showOpaqueBackground,
			isViewOnly,
		});
		const reactionContainer = await screen.findByTestId('render_reaction_wrapper');
		expect(reactionContainer).toBeInTheDocument();
		expect(reactionContainer).toHaveCompiledCss('border', 'none');
	});

	it('should not render with border if showSubtleStyle is true', async () => {
		const count = 3;
		const reacted = false;
		const onClickSpy = jest.fn();
		const onMouseEnterSpy = jest.fn();
		const enableFlash = false;
		const onEventSpy = jest.fn();
		const users: User[] = [];
		const showParticleEffect = false;
		const showOpaqueBackground = true;
		const showSubtleStyle = true;
		renderReaction({
			reacted,
			count,
			onClick: onClickSpy,
			onMouseEnter: onMouseEnterSpy,
			enableFlash,
			onEvent: onEventSpy,
			users,
			showParticleEffect,
			showOpaqueBackground,
			showSubtleStyle,
		});
		const reactionContainer = await screen.findByTestId('render_reaction_wrapper');
		expect(reactionContainer).toBeInTheDocument();
		expect(reactionContainer).toHaveCompiledCss('border', 'none');
	});

	describe('with analytics', () => {
		it('should trigger clicked for Reaction', async () => {
			const count = 10;
			const reacted = false;
			const onClickSpy = jest.fn();
			const onMouseEnterSpy = jest.fn();
			const enableFlash = false;
			const onEventSpy = jest.fn();
			renderReaction({
				reacted,
				count,
				onClick: onClickSpy,
				onMouseEnter: onMouseEnterSpy,
				enableFlash,
				onEvent: onEventSpy,
			});

			const btn = await screen.findByRole('button');
			expect(btn).toBeInTheDocument();

			// Click the Reaction emoji button
			act(() => {
				fireEvent.click(btn);
			});
			expect(onEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						action: 'clicked',
						actionSubject: 'existingReaction',
						eventType: 'ui',
						attributes: {
							added: true,
							emojiId: toEmojiId(grinning).id!,
							packageName: expect.any(String),
							packageVersion: expect.any(String),
						},
					}),
				}),
				'fabric-elements',
			);
		});

		it('should trigger hovered for Reaction', async () => {
			const count = 10;
			const reacted = false;
			const onClickSpy = jest.fn();
			const onMouseEnterSpy = jest.fn();
			const enableFlash = false;
			const onEventSpy = jest.fn();
			const users: User[] = [
				{
					id: 'user-1',
					displayName: 'Luiz',
				},
			];
			renderReaction({
				reacted,
				count,
				onClick: onClickSpy,
				onMouseEnter: onMouseEnterSpy,
				enableFlash,
				onEvent: onEventSpy,
				users,
			});

			const btn = await screen.findByRole('button');
			expect(btn).toBeInTheDocument();

			// Click the Reaction emoji button
			act(() => {
				fireEvent.mouseOver(btn);
			});

			expect(onEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						action: 'hovered',
						actionSubject: 'existingReaction',
						eventType: 'ui',
						attributes: {
							packageName: expect.any(String),
							packageVersion: expect.any(String),
						},
					}),
				}),
				'fabric-elements',
			);
		});
	});

	describe('Particle effect', () => {
		it('should render particle effect if the prop showParticleEffect is set', async () => {
			const count = 10;
			const reacted = false;
			const onClickSpy = jest.fn();
			const onMouseEnterSpy = jest.fn();
			const enableFlash = false;
			const onEventSpy = jest.fn();
			const users: User[] = [];
			const showParticleEffect = true;
			renderReaction({
				reacted,
				count,
				onClick: onClickSpy,
				onMouseEnter: onMouseEnterSpy,
				enableFlash,
				onEvent: onEventSpy,
				users,
				showParticleEffect,
			});
			const btn = await screen.findByRole('button');
			expect(btn).toBeInTheDocument();

			// Click the Reaction emoji button
			act(() => {
				fireEvent.click(btn);
			});

			expect(screen.getByText('ReactionParticleEffect')).toBeInTheDocument();
		});

		it('should not render particle effect if the prop showParticleEffect is not set', async () => {
			const count = 10;
			const reacted = false;
			const onClickSpy = jest.fn();
			const onMouseEnterSpy = jest.fn();
			const enableFlash = false;
			const onEventSpy = jest.fn();
			const users: User[] = [];
			const showParticleEffect = false;
			renderReaction({
				reacted,
				count,
				onClick: onClickSpy,
				onMouseEnter: onMouseEnterSpy,
				enableFlash,
				onEvent: onEventSpy,
				users,
				showParticleEffect,
			});
			const btn = await screen.findByRole('button');
			expect(btn).toBeInTheDocument();

			// Click the Reaction emoji button
			act(() => {
				fireEvent.click(btn);
			});

			expect(screen.queryByText('ReactionParticleEffect')).not.toBeInTheDocument();
		});
	});
});
