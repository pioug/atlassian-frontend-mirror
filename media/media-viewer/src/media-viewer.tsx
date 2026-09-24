import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { type SyntheticEvent } from 'react';

import { start } from 'perf-marks';
import FocusLock from 'react-focus-lock';
import { IntlProvider, injectIntl, type WrappedComponentProps } from 'react-intl';
import ScrollLock from 'react-scrolllock';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { isFileIdentifier, type Identifier } from '@atlaskit/media-client';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import { Shortcut } from '@atlaskit/media-ui/shortcut';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { createModalEvent } from './analytics/events/screen/modal';
import { createClosedEvent } from './analytics/events/ui/closed';
import { fireAnalytics } from './analytics/fireAnalytics';
import { mediaViewerPopupClass } from './classnames';
import {
	type MediaViewerExtensions,
	type MediaViewerNavigationDirection,
} from './components/types';
import { Content } from './content';
import { List } from './list';
import { Blanket, SidebarWrapper } from './styleWrappers';
import { type ViewerOptionsProps } from './viewerOptions';

const getIdentifierId = (identifier: Identifier): string | undefined =>
	isFileIdentifier(identifier) ? identifier.id : undefined;

export type Props = {
	onClose?: () => void;
	selectedItem?: Identifier;
	featureFlags?: MediaFeatureFlags;
	items: Identifier[];
	extensions?: MediaViewerExtensions;
	contextId?: string;
	innerRef?: React.Ref<HTMLDivElement>;
	viewerOptions?: ViewerOptionsProps;
	fallbackMediaNameFetcher?: (id: string) => Promise<string>;
};

const MediaViewerComponent = ({
	featureFlags,
	items,
	extensions,
	contextId,
	innerRef,
	onClose,
	selectedItem,
	intl,
	viewerOptions,
	fallbackMediaNameFetcher,
}: Props & WrappedComponentProps) => {
	// Experiment gate for the Confluence comments-in-media-viewer work. Only the
	// fields introduced by that series are gated here — `extensions.sidebar` and
	// `extensions.headerActions` shipped earlier and must keep working with the
	// experiment off, so `extensions` itself is deliberately *not* nullified.
	const {
		onPreviewClose,
		onSidebarClose,
		onNavigation,
		onSelectedItemChange,
		defaultSidebarVisible,
		onSidebarVisibilityChange,
	}: MediaViewerExtensions = isExperimentEnabled('cc_comments_media_viewer_sidebar')
		? (extensions ?? {})
		: {};

	const [isSidebarVisible, setIsSidebarVisibleState] = useState(defaultSidebarVisible ?? false);
	const setIsSidebarVisible = useCallback(
		(isVisible: boolean) => {
			setIsSidebarVisibleState(isVisible);
			onSidebarVisibilityChange?.(isVisible);
		},
		[onSidebarVisibilityChange],
	);
	const [selectedIdentifier, setSelectedIdentifier] = useState<Identifier>();
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const createAnalyticsEventRef = useRef(createAnalyticsEvent);
	createAnalyticsEventRef.current = createAnalyticsEvent;

	// Delegation helpers: if the consumer provides an interceptor, call it and
	// let the consumer decide when (or whether) to invoke `proceed`. Otherwise
	// proceed immediately so behavior is unchanged for consumers that don't
	// supply the new callbacks.
	const requestPreviewClose = useCallback(
		(proceed: () => void) => {
			if (onPreviewClose) {
				onPreviewClose(proceed);
			} else {
				proceed();
			}
		},
		[onPreviewClose],
	);

	const requestSidebarClose = useCallback(
		(proceed: () => void) => {
			if (onSidebarClose) {
				onSidebarClose(proceed);
			} else {
				proceed();
			}
		},
		[onSidebarClose],
	);

	const requestNavigation = useCallback(
		(direction: MediaViewerNavigationDirection, proceed: () => void) => {
			if (onNavigation) {
				onNavigation(direction, proceed);
			} else {
				proceed();
			}
		},
		[onNavigation],
	);

	useLayoutEffect(() => {
		fireAnalytics(createModalEvent(), createAnalyticsEventRef.current);
		start('MediaViewer.SessionDuration');
	}, []);

	const defaultSelectedItem: Identifier | undefined = selectedItem || items[0];

	// Toggling the sidebar: opening is unconditional; closing goes through the
	// optional onSidebarClose interceptor.
	const toggleSidebar = useCallback(() => {
		if (isSidebarVisible) {
			requestSidebarClose(() => setIsSidebarVisible(false));
		} else {
			setIsSidebarVisible(true);
		}
	}, [isSidebarVisible, requestSidebarClose, setIsSidebarVisible]);

	// The full modal close — used by ESC, the close button, and click-outside.
	// Always passed through requestPreviewClose so the consumer can intercept.
	const handlePreviewClose = useCallback(
		(reason: 'escKey' | 'button' | 'blanket' | 'other') => {
			requestPreviewClose(() => {
				if (reason !== 'other') {
					fireAnalytics(createClosedEvent(reason), createAnalyticsEventRef.current);
				}
				onClose && onClose();
			});
		},
		[onClose, requestPreviewClose],
	);

	// Compute the navigation direction by comparing the new identifier's index
	// in `items` with the current selected identifier's index. Falls back to
	// 'next' if we can't determine direction (e.g. random jump from a list).
	const computeNavigationDirection = useCallback(
		(nextIdentifier: Identifier): MediaViewerNavigationDirection => {
			const current = selectedIdentifier || defaultSelectedItem;
			const currentId = current && getIdentifierId(current);
			const nextId = getIdentifierId(nextIdentifier);
			if (!currentId || !nextId) {
				return 'next';
			}
			const currentIndex = items.findIndex((it) => getIdentifierId(it) === currentId);
			const nextIndex = items.findIndex((it) => getIdentifierId(it) === nextId);
			if (currentIndex === -1 || nextIndex === -1) {
				return 'next';
			}
			return nextIndex < currentIndex ? 'prev' : 'next';
		},
		[items, selectedIdentifier, defaultSelectedItem],
	);

	const renderSidebar = () => {
		const sidebarSelectedIdentifier = selectedIdentifier || defaultSelectedItem;

		if (sidebarSelectedIdentifier && isSidebarVisible && extensions?.sidebar) {
			return (
				<SidebarWrapper data-testid="media-viewer-sidebar-content">
					{extensions.sidebar.renderer(sidebarSelectedIdentifier, {
						// `close` is what the sidebar renderer calls to dismiss itself.
						// Route it through the same interceptor so confluence's
						// unsaved-comment guard runs here too.
						close: () => requestSidebarClose(() => setIsSidebarVisible(false)),
					})}
				</SidebarWrapper>
			);
		}
	};

	const content = (
		<div ref={innerRef}>
			<Blanket
				data-testid="media-viewer-popup"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={mediaViewerPopupClass}
			>
				<Shortcut
					code={'Escape'}
					handler={() => {
						handlePreviewClose('escKey');
					}}
				/>
				<Content
					isSidebarVisible={isSidebarVisible}
					onClose={(_e?: SyntheticEvent, analyticsEvent?: UIAnalyticsEvent) => {
						const reason: 'button' | 'other' =
							analyticsEvent?.payload?.actionSubject === 'button' ? 'button' : 'other';
						handlePreviewClose(reason);
					}}
				>
					<List
						defaultSelectedItem={defaultSelectedItem || items[0]}
						items={items}
						// Note: `onClose` here is what the prev/next list passes down for
						// "close-the-modal" actions. Route through interceptor too.
						onClose={() => handlePreviewClose('other')}
						extensions={extensions}
						// Notification-only: List has already updated its displayed item
						// by the time this fires. We use it to keep the parent's
						// `selectedIdentifier` in sync (consumers may key off it).
						onNavigationChange={(identifier: Identifier) => {
							setSelectedIdentifier(identifier);
							onSelectedItemChange?.(identifier);
						}}
						// Pre-commit gate: consumer can swallow or defer the
						// nav by not calling `commit`. The image only swaps
						// once `commit` runs.
						onNavigationRequest={(identifier: Identifier, commit: () => void) => {
							const direction = computeNavigationDirection(identifier);
							requestNavigation(direction, commit);
						}}
						onSidebarButtonClick={toggleSidebar}
						isSidebarVisible={isSidebarVisible}
						contextId={contextId}
						featureFlags={featureFlags}
						viewerOptions={viewerOptions}
						fallbackMediaNameFetcher={fallbackMediaNameFetcher}
					/>
				</Content>
				{renderSidebar()}
			</Blanket>
		</div>
	);

	return intl ? content : <IntlProvider locale="en">{content}</IntlProvider>;
};

const MediaViewerWithRef = React.forwardRef<HTMLDivElement, Props & WrappedComponentProps>(
	(props, ref) => {
		return <MediaViewerComponent {...props} innerRef={ref} />;
	},
);

const MediaViewerWithScrollLock = (props: Props & WrappedComponentProps) => {
	return (
		<FocusLock autoFocus>
			<ScrollLock />
			<MediaViewerWithRef {...props} />
		</FocusLock>
	);
};

export const MediaViewer: React.ComponentType<Props> = injectIntl(MediaViewerWithScrollLock, {
	enforceContext: false,
});
