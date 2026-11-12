import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

import camelCase from 'lodash/camelCase';
import rafSchedule from 'raf-schd';
import { useIntl } from 'react-intl';

import { getDocument } from '@atlaskit/browser-apis';
import { cssMap } from '@atlaskit/css';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics/types/dispatch-analytics-event';
import type { FLOATING_CONTROLS_TITLE } from '@atlaskit/editor-common/analytics/types/enums';
import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics/types/enums';
import Announcer from '@atlaskit/editor-common/announcer';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import messages from '@atlaskit/editor-common/floating-toolbar/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Toolbar } from '@atlaskit/editor-toolbar/toolbar';
import { useToolbarUI } from '@atlaskit/editor-toolbar/ui-context';
import { Popper } from '@atlaskit/popper/main';
import type { PopperChildrenProps } from '@atlaskit/popper/main';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { ScrollButton } from '../ScrollButton';
import { getDomRefFromSelection } from '../SelectionToolbar/utils';
import type { ElementToolbarContextValue } from './element-toolbar-context';
import { useElementToolbarContext } from './element-toolbar-context';

export const ELEMENT_TOOLBAR_TEST_ID = 'editor-element-toolbar';

const styles = cssMap({
	scrollWrapper: {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		minWidth: 0,
	},
	scrollContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
		overflowX: 'auto',
		overflowY: 'hidden',
		// Scroll buttons replace the native scrollbar
		scrollbarWidth: 'none',
	},
});

export type ElementToolbarPopupProps = {
	/**
	 * Identifies the toolbar in the `viewed` analytics event, e.g. ACTION_SUBJECT_ID.TABLE_TOOLBAR
	 */
	actionSubjectId?: string;
	children: React.ReactNode;
	/**
	 * Element to position the toolbar against. Defaults to the DOM node at the selection.
	 */
	getDomRef?: (editorView: EditorView) => HTMLElement | undefined;
	/**
	 * Toolbar aria-label. Also identifies the toolbar in error analytics.
	 */
	label: string;
	/**
	 * Distance from the element as [along, away], in px.
	 */
	offset?: [number, number];
	/**
	 * Show scroll buttons when the toolbar is wider than the editor.
	 */
	scrollable?: boolean;
	zIndex?: number;
};

type PopperContentProps = Pick<PopperChildrenProps, 'style' | 'update'> & {
	activeElement: ElementToolbarContextValue;
	children: React.ReactNode;
	editorDom: HTMLElement;
	popperRef: PopperChildrenProps['ref'];
	scrollable?: boolean;
	target: HTMLElement;
	zIndex?: number;
};

const PopperContent = ({
	activeElement,
	children,
	editorDom,
	popperRef,
	scrollable,
	style,
	target,
	update,
	zIndex,
}: PopperContentProps) => {
	const contentRef = useRef<HTMLDivElement | null>(null);
	const setRefs = useCallback(
		(element: HTMLDivElement | null) => {
			contentRef.current = element;
			if (typeof popperRef === 'function') {
				popperRef(element);
			} else if (popperRef) {
				(popperRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
			}
		},
		[popperRef],
	);

	// Popper only repositions on scroll and window resize. Like the legacy Popup, also reposition
	// when the element, the editor or the toolbar changes size, e.g. when the editor gets narrower.
	useEffect(() => {
		const ResizeObserverConstructor = target.ownerDocument.defaultView?.ResizeObserver;
		if (!ResizeObserverConstructor) {
			return;
		}
		const scheduleUpdate = rafSchedule(update);
		const observer = new ResizeObserverConstructor(() => scheduleUpdate());
		[target, editorDom, contentRef.current].forEach((element) => {
			if (element) {
				observer.observe(element);
			}
		});
		return () => {
			observer.disconnect();
			scheduleUpdate.cancel();
		};
	}, [target, editorDom, update]);

	// Reposition when the element changes, e.g. a table gets a new row
	const isFirstRender = useRef(true);
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		update();
	}, [activeElement, update]);

	return (
		<div
			ref={setRefs}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Popper positions with inline styles
			style={{ ...style, zIndex, maxWidth: scrollable ? '100%' : undefined }}
		>
			{children}
		</div>
	);
};

/**
 * Renders an element toolbar next to its node. Use it as the `component` of a toolbar root
 * registered with `element` options. It only renders inside the element toolbar host.
 *
 * Uses `@atlaskit/popper`, the positioning layer of `@atlaskit/popup`, because `@atlaskit/popup`
 * needs a trigger element and the toolbar is anchored to an editor node instead.
 */
export const ElementToolbarPopup = ({
	actionSubjectId,
	children,
	getDomRef,
	label,
	offset = [0, 12],
	scrollable,
	zIndex,
}: ElementToolbarPopupProps): React.JSX.Element | null => {
	const intl = useIntl();
	const { editorView } = useEditorToolbar();
	const activeElement = useElementToolbarContext();
	const { popupsMountPoint, popupsBoundariesElement, fireAnalyticsEvent } = useToolbarUI();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const modifiers = useMemo(() => {
		const boundary = popupsBoundariesElement ?? 'clippingParents';
		return [
			{ name: 'flip', options: { boundary } },
			// Keep the toolbar in view while the element scrolls, like the legacy `stick` option
			{ name: 'preventOverflow', options: { boundary, altAxis: true, tether: false } },
		];
	}, [popupsBoundariesElement]);

	const target = editorView && (getDomRef?.(editorView) ?? getDomRefFromSelection(editorView));
	const mountPoint = popupsMountPoint ?? getDocument()?.body;
	if (!activeElement || !editorView || !target || !mountPoint) {
		return null;
	}

	const scrollButton = (side: 'left' | 'right') => (
		<ScrollButton
			intl={intl}
			scrollContainerRef={scrollContainerRef}
			node={activeElement.node}
			disabled={false}
			side={side}
		/>
	);

	const toolbar = (
		<Toolbar label={label} testId={ELEMENT_TOOLBAR_TEST_ID} actionSubjectId={actionSubjectId}>
			<Announcer text={intl.formatMessage(messages.floatingToolbarAnnouncer)} delay={250} />
			{scrollable ? (
				<Box xcss={styles.scrollWrapper}>
					{scrollButton('left')}
					<Box ref={scrollContainerRef} xcss={styles.scrollContainer}>
						{children}
					</Box>
					{scrollButton('right')}
				</Box>
			) : (
				children
			)}
		</Toolbar>
	);

	return (
		<ErrorBoundary
			component={ACTION_SUBJECT.FLOATING_TOOLBAR_PLUGIN}
			componentId={camelCase(label) as FLOATING_CONTROLS_TITLE}
			// The toolbar UI context types payloads loosely. The host forwards them to the analytics plugin.
			dispatchAnalyticsEvent={fireAnalyticsEvent as DispatchAnalyticsEvent | undefined}
			fallbackComponent={null}
		>
			{createPortal(
				<Popper
					referenceElement={target}
					placement="bottom"
					offset={offset}
					strategy={popupsMountPoint ? 'absolute' : 'fixed'}
					modifiers={modifiers}
				>
					{({ ref, style, update }) => (
						<PopperContent
							popperRef={ref}
							style={style}
							update={update}
							activeElement={activeElement}
							editorDom={editorView.dom}
							target={target}
							scrollable={scrollable}
							zIndex={zIndex}
						>
							{toolbar}
						</PopperContent>
					)}
				</Popper>,
				mountPoint,
			)}
		</ErrorBoundary>
	);
};
