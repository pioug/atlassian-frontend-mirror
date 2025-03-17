/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';
import { type IntlShape } from 'react-intl-next';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { layoutBreakpointWidth } from '@atlaskit/editor-shared-styles';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { getNodeAnchor } from '../pm-plugins/decorations-common';
import { useActiveAnchorTracker } from '../pm-plugins/utils/active-anchor-tracker';
import { type AnchorRectCache, isAnchorSupported } from '../pm-plugins/utils/anchor-utils';
import { getInsertLayoutStep, updateSelection } from '../pm-plugins/utils/update-selection';

// 8px gap + 16px on left and right
const DROP_TARGET_LAYOUT_DROP_ZONE_WIDTH = 40;

export type DropTargetLayoutProps = {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	getPos: () => number | undefined;
	parent: PMNode;
	formatMessage?: IntlShape['formatMessage'];
};

const dropTargetLayoutStyle = css({
	height: '100%',
	width: `${DROP_TARGET_LAYOUT_DROP_ZONE_WIDTH}px`,
	transform: 'translateX(-50%)',
	zIndex: 120,
	position: 'relative',
	display: 'flex',
	justifyContent: 'center',
});

const dropTargetLayoutHintStyle = css({
	height: '100%',
	position: 'relative',
	borderRight: `1px dashed ${token('color.border.focused', B200)}`,
	width: 0,
});

export const DropTargetLayout = (
	props: DropTargetLayoutProps & {
		anchorRectCache?: AnchorRectCache;
	},
) => {
	const { api, getPos, parent, anchorRectCache } = props;

	const ref = useRef<HTMLDivElement | null>(null);
	const [isDraggedOver, setIsDraggedOver] = useState(false);

	const anchorName = getNodeAnchor(parent);

	const nextNodeAnchorName = ref.current?.parentElement?.nextElementSibling?.getAttribute(
		'data-drag-handler-anchor-name',
	);
	let height = '100%';
	if (nextNodeAnchorName) {
		if (isAnchorSupported()) {
			height = `anchor-size(${nextNodeAnchorName} height)`;
		} else if (anchorRectCache) {
			const layoutColumnRect = anchorRectCache.getRect(nextNodeAnchorName);
			height = `${layoutColumnRect?.height || 0}px`;
		}
	}
	const dropTargetStackLayoutHintStyle = css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[`@container layout-area (max-width:${layoutBreakpointWidth.MEDIUM - 1}px)`]: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			height,
			marginTop: `${token('space.050', '4px')}`,
		},
	});
	const [isActiveAnchor] = useActiveAnchorTracker(anchorName);

	const { activeNode } = api?.blockControls?.sharedState.currentState() || {};
	const onDrop = useCallback(() => {
		if (!activeNode) {
			return;
		}

		const to = getPos();
		let mappedTo: number | undefined;
		if (to !== undefined) {
			const { pos: from } = activeNode;
			api?.core?.actions.execute(({ tr }) => {
				api?.blockControls?.commands?.moveToLayout(from, to)({ tr });
				const insertColumnStep = getInsertLayoutStep(tr);
				mappedTo = (insertColumnStep as ReplaceStep)?.from;

				return tr;
			});

			api?.core?.actions.execute(({ tr }) => {
				if (mappedTo !== undefined) {
					updateSelection(tr, mappedTo);
				}
				return tr;
			});
		}
	}, [api, getPos, activeNode]);

	useEffect(() => {
		if (ref.current) {
			return dropTargetForElements({
				element: ref.current,
				onDragEnter: () => {
					setIsDraggedOver(true);
				},
				onDragLeave: () => {
					setIsDraggedOver(false);
				},
				onDrop,
			});
		}
	}, [onDrop]);

	if (activeNode?.nodeType === 'layoutSection') {
		return null;
	}
	return (
		<div
			ref={ref}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			css={[dropTargetLayoutStyle, dropTargetStackLayoutHintStyle]}
			data-testid="block-ctrl-drop-indicator"
		>
			{isDraggedOver ? (
				<DropIndicator edge="right" gap={`-${DROP_TARGET_LAYOUT_DROP_ZONE_WIDTH}px`} />
			) : (
				isActiveAnchor && (
					<div
						data-testid="block-ctrl-drop-hint"
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
						css={dropTargetLayoutHintStyle}
					></div>
				)
			)}
		</div>
	);
};
