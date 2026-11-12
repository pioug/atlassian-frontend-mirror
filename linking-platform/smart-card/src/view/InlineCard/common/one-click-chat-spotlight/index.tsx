/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { getDocument } from '@atlaskit/browser-apis';
import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/core/cross';
import { ChoreographedContent } from '@atlaskit/link-provider/choreographed-content';
import { Popup } from '@atlaskit/popup/popup';
import type { ContentProps, PopupComponentProps } from '@atlaskit/popup/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { EVENT_CHANNEL } from '../../../../common/analytics/constants';
import { getExtensionKey } from '../../../../state/getExtensionKey';
import type { RovoInteractionSource } from '../../../../state/hooks/use-invoke-client-action/types';
import useOneClickChatSpotlightEligibility, {
	type SpotlightInteraction,
} from '../../../../state/hooks/use-one-click-chat-spotlight-eligibility';
import useRovoConfig from '../../../../state/hooks/use-rovo-config';
import { useSmartCardState } from '../../../../state/store';
import type { InternalCardActionOptions } from '../../../Card/types';

const messages = defineMessages({
	heading: {
		id: 'smart-card.one-click-chat-spotlight-v2.heading.ai-non-final',
		defaultMessage: 'Explore this link with Rovo',
		description:
			'Accessible name of a spotlight introducing the Rovo action beside a resolved Smart Link.',
	},
	body: {
		id: 'smart-card.one-click-chat-spotlight-v2.takeaways-body.ai-non-final',
		defaultMessage: 'Get key decisions and next steps from this link.',
		description:
			'Spotlight body inviting users to get key decisions and next steps from a linked document or code using Rovo.',
	},
	dismiss: {
		id: 'smart-card.one-click-chat-spotlight-v2.dismiss.ai-non-final',
		defaultMessage: 'Dismiss spotlight',
		description: 'Dismiss button in the Smart Link spotlight. Hides this spotlight for seven days.',
	},
	action: {
		id: 'smart-card.one-click-chat-spotlight-v2.see-takeaways.ai-non-final',
		defaultMessage: 'See takeaways',
		description:
			'Button in the spotlight that invokes the same Rovo action as the highlighted inline button.',
	},
});

const styles = cssMap({
	surface: {
		position: 'relative',
		width: '296px',
		maxWidth: '100%',
		boxSizing: 'border-box',
		overflow: 'auto',
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		paddingRight: token('space.100'),
	},
	card: {
		backgroundColor: token('color.background.neutral.bold'),
		color: token('color.text.inverse'),
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	caret: {
		position: 'absolute',
		width: '16px',
		height: '8px',
		backgroundColor: token('color.background.neutral.bold'),
		clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
		pointerEvents: 'none',
	},
	below: { top: 0 },
	above: { bottom: 0, transform: 'rotate(180deg)' },
	close: {
		position: 'absolute',
		top: token('space.100'),
		right: token('space.100'),
		paddingTop: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
		paddingRight: token('space.025'),
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.neutral.bold'),
		borderRadius: token('radius.small'),
		transition: token('motion.button.hovered'),
		'&:hover': { backgroundColor: token('color.background.neutral.bold.hovered') },
		'&:active': {
			backgroundColor: token('color.background.neutral.bold.pressed'),
			transition: token('motion.button.pressed'),
		},
	},
	content: { position: 'relative' },
	body: { paddingRight: token('space.300') },
});

const SpotlightOpenContext = createContext(false);
const TargetContext = createContext<React.RefObject<HTMLSpanElement> | null>(null);
const PositionUpdateContext = createContext<React.MutableRefObject<
	ContentProps['update'] | undefined
> | null>(null);

function LegacyPositionUpdater({ update }: Pick<ContentProps, 'update'>) {
	const positionUpdate = useContext(PositionUpdateContext);
	useEffect(() => {
		if (!positionUpdate) return;
		positionUpdate.current = update;
		return () => {
			positionUpdate.current = undefined;
		};
	}, [positionUpdate, update]);
	return null;
}

// Keep Popup's inline trigger and focus handling. The design-system Spotlight
// target renders a block element; the Smart Link action must stay inline.
const SpotlightSurface = forwardRef<HTMLDivElement, PopupComponentProps>(
	(
		{
			children,
			style,
			shouldFitViewport: _fit,
			shouldRenderToParent: _parent,
			shouldFitContainer: _container,
			appearance: _appearance,
			xcss: _xcss,
			isReferenceHidden: _hidden,
			...props
		},
		forwardedRef,
	) => {
		const isOpen = useContext(SpotlightOpenContext);
		const target = useContext(TargetContext);
		const positionUpdate = useContext(PositionUpdateContext);
		const surface = useRef<HTMLDivElement | null>(null);
		const [caret, setCaret] = useState({ above: false, left: 24 });
		const ref = useCallback(
			(node: HTMLDivElement | null) => {
				surface.current = node;
				if (typeof forwardedRef === 'function') forwardedRef(node);
				else if (forwardedRef) forwardedRef.current = node;
			},
			[forwardedRef],
		);
		useEffect(() => {
			const element = surface.current;
			const anchor = target?.current;
			if (!isOpen || !element || !anchor) return;
			let frame = 0;
			let previousTrigger: DOMRect | undefined;
			let previousCaret: { above: boolean; left: number } | undefined;
			// Navigation can translate the anchor without a resize or scroll event.
			// Only the visible spotlight samples geometry; unchanged geometry causes no updates.
			const measure = () => {
				frame = requestAnimationFrame(measure);
				const card = element.getBoundingClientRect();
				const trigger = anchor.getBoundingClientRect();
				if (
					previousTrigger &&
					(trigger.left !== previousTrigger.left ||
						trigger.top !== previousTrigger.top ||
						trigger.width !== previousTrigger.width ||
						trigger.height !== previousTrigger.height)
				) {
					// Reuse Popup's positioning engine rather than moving its DOM ourselves.
					void positionUpdate?.current?.();
				}
				previousTrigger = trigger;
				if (!card.width) return;
				const above = card.bottom <= trigger.top;
				const left = Math.max(
					16,
					Math.min(card.width - 32, trigger.left + trigger.width / 2 - card.left - 8),
				);
				if (previousCaret?.above !== above || previousCaret.left !== left) {
					previousCaret = { above, left };
					setCaret(previousCaret);
				}
			};
			frame = requestAnimationFrame(measure);
			return () => cancelAnimationFrame(frame);
		}, [target, positionUpdate, isOpen]);
		return (
			<div {...props} ref={ref} style={style} css={styles.surface}>
				<span
					aria-hidden="true"
					css={[styles.caret, caret.above ? styles.above : styles.below]}
					style={{ left: caret.left }}
				/>
				<Box xcss={styles.card}>{children}</Box>
			</div>
		);
	},
);

function VisibleSpotlightCard({
	onShown,
	body,
	dismissLabel,
	actionLabel,
	onDismiss,
	onAction,
}: {
	actionLabel: string;
	body: string;
	dismissLabel: string;
	onAction: () => void;
	onDismiss: () => void;
	onShown: () => void;
}): React.JSX.Element {
	useEffect(() => onShown(), [onShown]);
	return (
		<Box testId="one-click-chat-spotlight-v2" xcss={styles.content} padding="space.150">
			<Pressable xcss={styles.close} onClick={onDismiss} aria-label={dismissLabel}>
				<CrossIcon label="" size="small" />
			</Pressable>
			<Stack space="space.050">
				<Box xcss={styles.body}>
					<Text color="color.text.inverse">{body}</Text>
				</Box>
				<Inline alignInline="end">
					<Button appearance="primary" spacing="compact" onClick={onAction}>
						{actionLabel}
					</Button>
				</Inline>
			</Stack>
		</Box>
	);
}

export function OneClickChatSpotlight({
	children,
	url,
	actionOptions,
	onInvoke,
}: {
	actionOptions?: InternalCardActionOptions;
	children: React.ReactNode;
	onInvoke: () => void;
	url?: string;
}): React.JSX.Element {
	const intl = useIntl();
	const target = useRef<HTMLSpanElement>(null);
	const positionUpdate = useRef<ContentProps['update'] | undefined>(undefined);
	const [isOpportunity, setOpportunity] = useState(false);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { product } = useRovoConfig();
	const card = useSmartCardState(url ?? '');
	const provider = getExtensionKey(card.details);
	const onInteraction = useCallback(
		(interaction: SpotlightInteraction, interactionSource?: RovoInteractionSource) => {
			createAnalyticsEvent({
				eventType: interaction === 'impression' ? 'track' : 'ui',
				action: interaction === 'impression' ? 'viewed' : interaction,
				actionSubject: 'oneClickChatSpotlight',
				actionSubjectId: 'oneClickChatSpotlightV2',
				attributes: {
					provider: provider === 'google-object-provider' ? 'google-drive' : 'github',
					product: product === 'CONFLUENCE' ? 'confluence_web' : 'jira_web',
					appearance: 'inline',
					cohort: 'treatment',
					variant: 'v2',
					...(interactionSource ? { interactionSource } : {}),
				},
			}).fire(EVENT_CHANNEL);
		},
		[createAnalyticsEvent, provider, product],
	);
	const spotlight = useOneClickChatSpotlightEligibility({
		url,
		actionOptions,
		isOpportunity,
		onInteraction,
	});

	useEffect(() => {
		const element = target.current;
		const doc = getDocument();
		if (!element || !doc || typeof IntersectionObserver === 'undefined') {
			return;
		}
		let intersects = false;
		const update = () => setOpportunity(intersects && doc.visibilityState === 'visible');
		const observer = new IntersectionObserver(([entry]) => {
			intersects = entry.isIntersecting;
			update();
		});
		observer.observe(element);
		doc.addEventListener('visibilitychange', update);
		return () => {
			observer.disconnect();
			doc.removeEventListener('visibilitychange', update);
		};
	}, []);

	const trigger = (
		<span
			onClickCapture={() => {
				if (spotlight.isEligible && !spotlight.onClick('inlineAction')) spotlight.onUnavailable();
			}}
		>
			{children}
		</span>
	);
	const content = (
		<VisibleSpotlightCard
			onShown={spotlight.onShown}
			body={intl.formatMessage(messages.body)}
			dismissLabel={intl.formatMessage(messages.dismiss)}
			actionLabel={intl.formatMessage(messages.action)}
			onDismiss={spotlight.onDismiss}
			onAction={() => {
				if (spotlight.onClick('spotlightCta')) onInvoke();
			}}
		/>
	);

	return (
		<ChoreographedContent
			messageId="smart-link-one-click-chat-spotlight-v2"
			isActive={spotlight.isEligible}
			onUnavailable={spotlight.onUnavailable}
		>
			{({ hasPermission }) => (
				<span
					ref={target}
					role="none"
					onClick={(event) => {
						// Top-layer popups remain inside the Smart Link's anchor in the DOM.
						event.preventDefault();
						event.stopPropagation();
					}}
					onKeyDown={(event) => {
						if (event.key === 'Escape' && hasPermission) {
							event.preventDefault();
							event.stopPropagation();
							spotlight.onDismiss();
						}
					}}
					// Match the enclosing Smart Link's keypress handler.
					onKeyPress={(event) => event.stopPropagation()}
				>
					<TargetContext.Provider value={target}>
						<PositionUpdateContext.Provider value={positionUpdate}>
							<SpotlightOpenContext.Provider value={hasPermission}>
								<Popup
									mode="manual"
									popupComponent={SpotlightSurface}
									shouldFitViewport
									isOpen={hasPermission}
									placement="bottom-start"
									role="dialog"
									label={intl.formatMessage(messages.heading)}
									// This span only anchors the popup; it does not toggle it.
									trigger={({ ref }) => <span ref={ref}>{trigger}</span>}
									content={({ update }) => (
										<React.Fragment>
											<LegacyPositionUpdater update={update} />
											{content}
										</React.Fragment>
									)}
								/>
							</SpotlightOpenContext.Provider>
						</PositionUpdateContext.Provider>
					</TargetContext.Provider>
				</span>
			)}
		</ChoreographedContent>
	);
}
