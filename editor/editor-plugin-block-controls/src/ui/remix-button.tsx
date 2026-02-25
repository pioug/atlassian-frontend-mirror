/**
 * Remix block control: positioned at the right edge of the block.
 * Uses anchor(anchorName end) or getRightPositionForRootElement (same coordinate system
 * as left controls). The widget span has no position:relative so position:absolute
 * uses the same containing block as the node.
 */
/* @jsxRuntime classic */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import type { IntlShape } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import RandomizeIcon from '@atlaskit/icon-lab/core/randomize';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { getTopPosition } from '../pm-plugins/utils/drag-handle-positions';
import { getRightPositionForRootElement } from '../pm-plugins/utils/widget-positions';

import {
	REMIX_BUTTON_DIMENSIONS,
	REMIX_BUTTON_RIGHT_OFFSET,
	rootElementGap,
	topPositionAdjustment,
} from './consts';
import { refreshAnchorName } from './utils/anchor-name';
import { getAnchorAttrName } from './utils/dom-attr-name';
import { VisibilityContainer } from './visibility-container';

const containerBaseStyles = css({
	position: 'absolute',
	zIndex: 100,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

type RemixButtonProps = {
	anchorName: string;
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	formatMessage: IntlShape['formatMessage'];
	getPos: () => number | undefined;
	nodeType: string;
	rootAnchorName?: string;
	rootNodeType: string;
	view: EditorView;
};

export const RemixButton = ({
	view,
	api,
	getPos,
	anchorName,
	rootAnchorName,
	rootNodeType,
}: RemixButtonProps) => {
	const { macroInteractionUpdates } = useSharedPluginStateWithSelector(
		api,
		['featureFlags'],
		(states) => ({
			macroInteractionUpdates: states.featureFlagsState?.macroInteractionUpdates,
		}),
	);

	const [positionStyles, setPositionStyles] = useState<React.CSSProperties>({ display: 'none' });

	// Same positioning pattern as quick insert / drag handle: anchor(start/end) or offset-based left/top
	const calculatePosition = useCallback((): CSSProperties => {
		const safeAnchorName = refreshAnchorName({
			getPos,
			view,
			anchorName: rootAnchorName ?? anchorName,
		});

		const dom: HTMLElement | null = view.dom.querySelector(
			`[${getAnchorAttrName()}="${safeAnchorName}"]`,
		);

		if (!dom) {
			return { display: 'none' };
		}

		const hasResizer = rootNodeType === 'table' || rootNodeType === 'mediaSingle';
		const isExtension = rootNodeType === 'extension' || rootNodeType === 'bodiedExtension';
		const isBlockCard = rootNodeType === 'blockCard';
		const isEmbedCard = rootNodeType === 'embedCard';
		const isMacroInteractionUpdates = macroInteractionUpdates && isExtension;

		let innerContainer: HTMLElement | null = null;
		if (dom) {
			if (isEmbedCard) {
				innerContainer = dom.querySelector('.rich-media-item');
			} else if (hasResizer) {
				innerContainer = dom.querySelector('.resizer-item');
			} else if (isExtension) {
				innerContainer = dom.querySelector('.extension-container[data-layout]');
			} else if (isBlockCard) {
				innerContainer = dom.querySelector('.datasourceView-content-inner-wrap');
			}
		}

		const isEdgeCase = (hasResizer || isExtension || isEmbedCard || isBlockCard) && innerContainer;

		// Check anchor first (no reflow). Only call expensive getRightPositionForRootElement when fallback needed.
		const supportsAnchorRight =
			CSS.supports('left', `anchor(${safeAnchorName} end)`) &&
			CSS.supports('top', `anchor(${safeAnchorName} start)`);
		if (supportsAnchorRight && !isEdgeCase) {
			return {
				left: `calc(anchor(${safeAnchorName} end) - ${REMIX_BUTTON_DIMENSIONS.width}px - ${rootElementGap(rootNodeType)}px + ${REMIX_BUTTON_RIGHT_OFFSET}px)`,
				top: `calc(anchor(${safeAnchorName} start) + ${topPositionAdjustment(rootNodeType)}px)`,
				height: `${REMIX_BUTTON_DIMENSIONS.height}px`,
				bottom: 'unset',
			} as CSSProperties;
		}
		// Fallback: offset-based (triggers reflow). When isEdgeCase add dom.offsetLeft (same as left controls).
		const rightEdgeLeft = getRightPositionForRootElement(
			dom,
			rootNodeType,
			REMIX_BUTTON_DIMENSIONS,
			innerContainer ?? undefined,
			isMacroInteractionUpdates,
		);
		return {
			left: isEdgeCase
				? `calc(${dom?.offsetLeft ?? 0}px + (${rightEdgeLeft}) + ${REMIX_BUTTON_RIGHT_OFFSET}px)`
				: `calc(${rightEdgeLeft} + ${REMIX_BUTTON_RIGHT_OFFSET}px)`,
			top: getTopPosition(dom, rootNodeType),
			height: `${REMIX_BUTTON_DIMENSIONS.height}px`,
			bottom: 'unset',
		} as CSSProperties;
	}, [view, getPos, anchorName, rootAnchorName, rootNodeType, macroInteractionUpdates]);

	// Recompute button position on mount and when extension/embedCard layout changes (e.g. expand/collapse).
	// For extension/embedCard we listen to transitionend so position updates after CSS transitions finish.
	useEffect(() => {
		let cleanUpTransitionListener: (() => void) | undefined;
		if (rootNodeType === 'extension' || rootNodeType === 'embedCard') {
			const anchorDom = view.dom.querySelector(
				`[${getAnchorAttrName()}="${rootAnchorName ?? anchorName}"]`,
			);
			if (anchorDom) {
				cleanUpTransitionListener = bind(anchorDom, {
					type: 'transitionend',
					listener: () => setPositionStyles(calculatePosition()),
				});
			}
		}
		const id = requestAnimationFrame(() => setPositionStyles(calculatePosition()));
		return () => {
			cancelAnimationFrame(id);
			cleanUpTransitionListener?.();
		};
	}, [calculatePosition, view.dom, rootAnchorName, rootNodeType, anchorName]);

	return (
		<VisibilityContainer api={api}>
			<div
				css={containerBaseStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Dynamic positioning (left, top, height) calculated at runtime
				style={positionStyles}
				data-testid="block-ctrl-remix-button"
			>
				<IconButton
					spacing="compact"
					appearance="subtle"
					label="Remix"
					icon={() => <RandomizeIcon label="" />}
					onMouseDown={(e) => e.preventDefault()}
				/>
			</div>
		</VisibilityContainer>
	);
};
