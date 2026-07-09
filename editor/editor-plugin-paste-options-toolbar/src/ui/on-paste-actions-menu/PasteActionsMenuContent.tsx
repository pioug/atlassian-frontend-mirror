import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { PASTE_MENU } from '@atlaskit/editor-common/toolbar';
import { OutsideClickTargetRefContext } from '@atlaskit/editor-common/ui-react';
import type { Slice } from '@atlaskit/editor-prosemirror/model';
import { ToolbarMenuContainer } from '@atlaskit/editor-toolbar/toolbar-menu-container';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';
import type {
	AsyncHiddenContext,
	RegisterComponent,
} from '@atlaskit/editor-ui-control-model/types';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { getSingleSmartLinkUrlFromSlice } from '../utils/current-pasted-smart-link';

import { evaluateAsyncHidden, type AsyncHiddenResults } from './async-hidden';

const styles = cssMap({
	container: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
	},
});

const pasteMenuSurface = { type: PASTE_MENU.type, key: PASTE_MENU.key } as const;

interface PasteActionsMenuContentProps {
	components: RegisterComponent[];
	contentRef?: React.RefObject<HTMLDivElement | null>;
	onMouseDown: (e: React.MouseEvent) => void;
	onMouseEnter: () => void;
	/** The pasted slice, used to extract a single smart link URL for `isAsyncHidden` checks. */
	pastedSlice?: Slice;
}

export const PasteActionsMenuContent = ({
	onMouseDown,
	onMouseEnter,
	components,
	contentRef,
	pastedSlice,
}: PasteActionsMenuContentProps): React.JSX.Element => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);

	// Extract the pasted URL (if the pasted content was a single smart link).
	// Uses the reactive pasted slice from the paste plugin state so pastedUrl
	// updates when paste state changes.
	const pastedUrl = getSingleSmartLinkUrlFromSlice(pastedSlice);

	// Components with isAsyncHidden are hidden until the async check resolves.
	// This prevents flash-of-visible content for items that
	// should ultimately be hidden. A generation counter discards stale results.
	const [asyncHiddenResults, setAsyncHiddenResults] = useState<AsyncHiddenResults>(() => {
		return Object.fromEntries(components.map((component) => [component.key, true]));
	});

	const generationRef = useRef(0);

	useEffect(() => {
		const asyncComponents: RegisterComponent[] = [];
		for (const component of components) {
			if (typeof component.isAsyncHidden === 'function') {
				asyncComponents.push(component);
			}
		}
		if (asyncComponents.length === 0) {
			setAsyncHiddenResults({});
			return;
		}

		// Reset: mark all async components as hidden until this round resolves.
		const pending: Record<string, boolean> = {};
		for (const c of asyncComponents) {
			pending[c.key] = true;
		}
		setAsyncHiddenResults(pending);

		const generation = ++generationRef.current;
		const context: AsyncHiddenContext = { pastedUrl };

		void evaluateAsyncHidden(asyncComponents, context).then((results) => {
			// Discard if a newer effect has already started.
			if (generation === generationRef.current) {
				setAsyncHiddenResults(results);
			}
		});
	}, [components, pastedUrl]);

	// SurfaceRenderer evaluates isHidden() itself on each component. Override
	// isHidden on async components so SurfaceRenderer sees the resolved value.
	const visibleComponents = components.map((component) => {
		if (typeof component.isAsyncHidden !== 'function') {
			// No async check — pass through unchanged.
			return component;
		}

		const asyncResult = asyncHiddenResults[component.key];
		return {
			...component,
			isHidden: () => {
				return asyncResult === true || Boolean(component.isHidden?.());
			},
		};
	});

	const mergedRef = useCallback(
		(node: HTMLDivElement | null) => {
			setOutsideClickTargetRef?.(node);
			if (contentRef) {
				(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
			}
		},
		[setOutsideClickTargetRef, contentRef],
	);

	if (expValEquals('platform_editor_menu_radius_update', 'isEnabled', true)) {
		return (
			<ToolbarMenuContainer ref={mergedRef} onMouseDown={onMouseDown} onMouseEnter={onMouseEnter}>
				<SurfaceRenderer surface={pasteMenuSurface} components={visibleComponents} />
			</ToolbarMenuContainer>
		);
	}

	return (
		<Box
			ref={mergedRef}
			xcss={styles.container}
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
		>
			<SurfaceRenderer surface={pasteMenuSurface} components={visibleComponents} />
		</Box>
	);
};
