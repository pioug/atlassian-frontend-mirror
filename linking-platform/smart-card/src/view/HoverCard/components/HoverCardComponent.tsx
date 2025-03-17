import React, { useCallback, useEffect, useRef } from 'react';

import { useIntl } from 'react-intl-next';

import Popup from '@atlaskit/popup';

import { ActionName, CardDisplay } from '../../../constants';
import { messages } from '../../../messages';
import { useSmartCardActions } from '../../../state/actions';
import { useSmartLinkRenderers } from '../../../state/renderers';
import { useSmartCardState as useLinkState } from '../../../state/store';
import { SmartLinkAnalyticsContext } from '../../../utils/analytics/SmartLinkAnalyticsContext';
import CustomPopupContainer from '../components/CustomPopupContainer';
import HoverCardContent from '../components/HoverCardContent';
import { CARD_GAP_PX, HOVER_CARD_Z_INDEX } from '../styled';
import { type HoverCardComponentProps, type HoverCardContentProps } from '../types';

export const HOVER_CARD_SOURCE = 'smartLinkPreviewHoverCard';

const FADE_IN_DELAY = 500;
const FADE_OUT_DELAY = 300;
const RESOLVE_DELAY = 100;

export const HoverCardComponent = ({
	children,
	url,
	id = '',
	canOpen = true,
	closeOnChildClick = false,
	actionOptions,
	allowEventPropagation = false,
	zIndex = HOVER_CARD_Z_INDEX,
	noFadeDelay = false,
	hoverPreviewOptions,
	role,
	label,
	titleId,
}: HoverCardComponentProps) => {
	const fadeInDelay = hoverPreviewOptions?.fadeInDelay ?? FADE_IN_DELAY;
	const [isOpen, setIsOpen] = React.useState(false);
	const fadeOutTimeoutId = useRef<ReturnType<typeof setTimeout>>();
	const fadeInTimeoutId = useRef<ReturnType<typeof setTimeout>>();
	const resolveTimeOutId = useRef<ReturnType<typeof setTimeout>>();
	const mousePos = useRef<{ x: number; y: number }>();
	const popupOffset = useRef<[number, number]>();
	const parentSpan = useRef<HTMLSpanElement>(null);
	const { formatMessage } = useIntl();

	const renderers = useSmartLinkRenderers();
	const linkState = useLinkState(url);

	const { loadMetadata } = useSmartCardActions(id, url);

	const setMousePosition = useCallback(
		(event: any) => {
			if (isOpen && canOpen) {
				return;
			}
			mousePos.current = {
				x: event.clientX,
				y: event.clientY,
			};

			//If these are undefined then popupOffset is undefined and we fallback to default bottom-start placement
			if ((!isOpen || !canOpen) && parentSpan.current && mousePos.current) {
				const { bottom, left } = parentSpan.current.getBoundingClientRect();
				popupOffset.current = [
					mousePos.current.x - left + CARD_GAP_PX,
					mousePos.current.y - bottom + CARD_GAP_PX,
				];
			}
		},
		[canOpen, isOpen],
	);

	const hideCard = useCallback(() => {
		setIsOpen(false);
	}, []);

	const initHideCard = useCallback(() => {
		if (fadeInTimeoutId.current) {
			clearTimeout(fadeInTimeoutId.current);
			// because fadeInTimeoutId.current is set by mouseOver which triggers multiple times in a hover,
			// we want to clear out the reference to signify that there's no in-progress fade in event
			fadeInTimeoutId.current = undefined;
		}

		if (resolveTimeOutId.current) {
			clearTimeout(resolveTimeOutId.current);
			// because resolveTimeOutId.current is set by mouseOver which triggers multiple times in a hover,
			// we want to clear out the reference to signify that there's no in-progress resolve event
			resolveTimeOutId.current = undefined;
		}
		if (noFadeDelay) {
			hideCard();
		} else {
			fadeOutTimeoutId.current = setTimeout(() => hideCard(), FADE_OUT_DELAY);
		}
	}, [hideCard, noFadeDelay]);

	// clearing out the timeouts in order to avoid memory leaks
	// in case the component unmounts before they execute
	useEffect(() => {
		return () => {
			if (fadeOutTimeoutId.current) {
				clearTimeout(fadeOutTimeoutId.current);
			}

			if (fadeInTimeoutId.current) {
				clearTimeout(fadeInTimeoutId.current);
				// because fadeInTimeoutId.current is set by mouseOver which triggers multiple times in a hover,
				// we want to clear out the reference to signify that there's no in-progress fade in event
				fadeInTimeoutId.current = undefined;
			}

			if (resolveTimeOutId.current) {
				clearTimeout(resolveTimeOutId.current);
				// because resolveTimeOutId.current is set by mouseOver which triggers multiple times in a hover,
				// we want to clear out the reference to signify that there's no in-progress resolve event
				resolveTimeOutId.current = undefined;
			}
		};
	}, []);

	// we want to initiate resolve a bit earlier for standalone cards
	// to minimize the loading state
	const initResolve = useCallback(() => {
		// this check covers both non-SSR (status) & SSR case (metadataStatus)
		const isLinkUnresolved = linkState.status === 'pending' || !linkState.metadataStatus;

		if (!resolveTimeOutId.current && isLinkUnresolved) {
			resolveTimeOutId.current = setTimeout(() => {
				loadMetadata();
			}, RESOLVE_DELAY);
		}
	}, [linkState.metadataStatus, linkState.status, loadMetadata]);

	const initShowCard = useCallback(
		(event: any) => {
			// clearing out fadeOutTimeoutId in case it's already counting down to hide the card
			if (fadeOutTimeoutId.current) {
				clearTimeout(fadeOutTimeoutId.current);
			}

			// starting to resolve the hover card if the store doesn't have data about the link yet
			initResolve();

			//Set mouse position in the case it's not already set by onMouseMove, as in the case of scrolling
			setMousePosition(event);

			if (!isOpen && !fadeInTimeoutId.current) {
				// setting a timeout to show a Hover Card after delay runs out
				if (noFadeDelay) {
					setIsOpen(true);
				} else {
					fadeInTimeoutId.current = setTimeout(() => {
						setIsOpen(true);
					}, fadeInDelay);
				}
			}
		},
		[initResolve, isOpen, setMousePosition, noFadeDelay, fadeInDelay],
	);

	const onActionClick = useCallback(
		(actionId: any) => {
			if (actionId === ActionName.PreviewAction || actionId === ActionName.AutomationAction) {
				hideCard();
			}
		},
		[hideCard],
	);

	// Stop hover preview content to propagate event to parent.
	const handleChildClick = useCallback(
		(e: any, closeOnClick: boolean) => {
			if (!allowEventPropagation) {
				e.stopPropagation();
			}

			if (closeOnClick) {
				hideCard();
			}
		},
		[allowEventPropagation, hideCard],
	);

	const onContextMenuClick = useCallback((e: any) => handleChildClick(e, true), [handleChildClick]);

	const onChildClick = useCallback(
		(e: any) => handleChildClick(e, closeOnChildClick),
		[closeOnChildClick, handleChildClick],
	);

	const content = useCallback(
		({ update }: { update: () => void }) => {
			const hoverCardContentProps: HoverCardContentProps = {
				onMouseEnter: initShowCard,
				onMouseLeave: initHideCard,
				cardState: linkState,
				onActionClick,
				onResolve: update,
				renderers,
				actionOptions,
				url,
				id,
			};

			return (
				<SmartLinkAnalyticsContext
					url={url}
					display={CardDisplay.HoverCardPreview}
					id={id}
					source={HOVER_CARD_SOURCE}
				>
					<HoverCardContent {...hoverCardContentProps} />
				</SmartLinkAnalyticsContext>
			);
		},
		[initShowCard, initHideCard, linkState, onActionClick, renderers, actionOptions, url, id],
	);

	const trigger = useCallback(
		({ 'aria-haspopup': ariaHasPopup, 'aria-expanded': ariaExpanded, ...triggerProps }: any) => (
			<span ref={parentSpan}>
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
				<span
					{...triggerProps}
					// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
					onMouseOver={initShowCard}
					onMouseLeave={initHideCard}
					onMouseMove={setMousePosition}
					onClick={onChildClick}
					onContextMenu={onContextMenuClick}
					data-testid="hover-card-trigger-wrapper"
					aria-label={formatMessage(messages.more_information_about_this_work_item)}
				>
					{children}
				</span>
			</span>
		),
		[
			children,
			initHideCard,
			initShowCard,
			onChildClick,
			onContextMenuClick,
			setMousePosition,
			formatMessage,
		],
	);

	return (
		<Popup
			testId="hover-card"
			isOpen={isOpen && canOpen}
			onClose={hideCard}
			placement="bottom-start"
			offset={popupOffset.current}
			autoFocus={false}
			content={content}
			trigger={trigger}
			zIndex={zIndex}
			role={role}
			titleId={titleId}
			label={label}
			// @ts-ignore: [PIT-1685] Fails in post-office due to backwards incompatibility issue with React 18
			popupComponent={CustomPopupContainer}
		/>
	);
};
