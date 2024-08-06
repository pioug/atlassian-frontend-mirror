/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
	dragToMoveDown,
	dragToMoveUp,
	getAriaKeyshortcuts,
	TooltipContentWithMultipleShortcuts,
} from '@atlaskit/editor-common/keymaps';
import { blockControlsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import { fg } from '@atlaskit/platform-feature-flags';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { key } from '../pm-plugins/main';
import type { BlockControlsPlugin, HandleOptions } from '../types';
import { selectNode } from '../utils';
import { getLeftPosition, getTopPosition } from '../utils/drag-handle-positions';

import {
	DRAG_HANDLE_BORDER_RADIUS,
	DRAG_HANDLE_HEIGHT,
	DRAG_HANDLE_WIDTH,
	DRAG_HANDLE_ZINDEX,
	dragHandleGap,
	topPositionAdjustment,
} from './consts';
import { dragPreview } from './drag-preview';

const dragHandleButtonStyles = css({
	position: 'absolute',
	padding: `${token('space.025', '2px')} 0`,
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: DRAG_HANDLE_HEIGHT,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: DRAG_HANDLE_WIDTH,
	border: 'none',
	background: 'transparent',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: DRAG_HANDLE_BORDER_RADIUS,
	color: token('color.icon', '#44546F'),
	cursor: 'grab',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: DRAG_HANDLE_ZINDEX,
	outline: 'none',

	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', '#091E420F'),
	},

	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed', '#091E4224'),
	},

	'&:focus': {
		outline: `2px solid ${token('color.border.focused', '#388BFF')}`,
	},
});

const selectedStyles = css({
	backgroundColor: token('color.background.selected', '#E9F2FF'),
	color: token('color.icon.selected', '#0C66E4'),
});

const DragHandleInternal = ({
	view,
	api,
	getPos,
	anchorName,
	nodeType,
	intl: { formatMessage },
	handleOptions,
}: {
	view: EditorView;
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	getPos: () => number | undefined;
	anchorName: string;
	nodeType: string;
	handleOptions?: HandleOptions;
} & WrappedComponentProps) => {
	const start = getPos();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const [blockCardWidth, setBlockCardWidth] = useState(768);
	const [dragHandleSelected, setDragHandleSelected] = useState(false);
	const { featureFlagsState } = useSharedPluginState(api, ['featureFlags']);

	useEffect(() => {
		// blockCard/datasource width is rendered correctly after this decoraton does. We need to observe for changes.
		if (nodeType === 'blockCard') {
			const dom: HTMLElement | null = view.dom.querySelector(
				`[data-drag-handler-anchor-name="${anchorName}"]`,
			);
			const container = dom?.querySelector('.datasourceView-content-inner-wrap');

			if (container) {
				const resizeObserver = new ResizeObserver((entries) => {
					const width = entries[0].contentBoxSize[0].inlineSize;
					setBlockCardWidth(width);
				});

				resizeObserver.observe(container);
				return () => resizeObserver.unobserve(container);
			}
		}
	}, [anchorName, nodeType, view.dom]);

	const handleOnClick = useCallback(() => {
		setDragHandleSelected(!dragHandleSelected);
		api?.core?.actions.execute(({ tr }) => {
			const startPos = fg('platform_editor_element_drag_and_drop_ed_24304') ? getPos() : start;

			if (startPos === undefined) {
				return tr;
			}

			tr = selectNode(tr, startPos, nodeType);
			tr.setMeta(key, { pos: startPos });

			const resolvedMovingNode = tr.doc.resolve(startPos);
			const maybeNode = resolvedMovingNode.nodeAfter;

			fg('platform.editor.elements.drag-and-drop-long-node-scroll') &&
				tr.setMeta('scrollIntoView', false);
			api?.analytics?.actions.attachAnalyticsEvent({
				eventType: EVENT_TYPE.UI,
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BUTTON,
				actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
				attributes: {
					nodeDepth: resolvedMovingNode.depth,
					nodeType: maybeNode?.type.name || '',
				},
			})(tr);

			return tr;
		});

		view.focus();
	}, [
		dragHandleSelected,
		api?.core?.actions,
		api?.analytics?.actions,
		view,
		getPos,
		start,
		nodeType,
	]);

	// TODO - This needs to be investigated further. Drag preview generation is not always working
	// as expected with a node selection. This workaround sets the selection to the node on mouseDown,
	// but ensures the preview is generated correctly.
	const handleMouseDown = useCallback(() => {
		api?.core?.actions.execute(({ tr }) => {
			const startPos = fg('platform_editor_element_drag_and_drop_ed_24304') ? getPos() : start;
			if (startPos === undefined) {
				return tr;
			}

			const node = tr.doc.nodeAt(startPos);
			if (!node) {
				return tr;
			}
			const $startPos = tr.doc.resolve(startPos + node.nodeSize);
			const selection = new TextSelection($startPos);
			tr.setSelection(selection);
			tr.setMeta(key, { pos: startPos });
			return tr;
		});
	}, [api?.core?.actions, getPos, start]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>) => {
			if (fg('platform_editor_element_drag_and_drop_ed_23873')) {
				// allow user to use spacebar to select the node

				if (!e.repeat && e.key === ' ') {
					const startPos = fg('platform_editor_element_drag_and_drop_ed_24304') ? getPos() : start;
					api?.core?.actions.execute(({ tr }) => {
						if (startPos === undefined) {
							return tr;
						}

						const node = tr.doc.nodeAt(startPos);
						if (!node) {
							return tr;
						}
						const $startPos = tr.doc.resolve(startPos + node.nodeSize);
						const selection = new TextSelection($startPos);
						tr.setSelection(selection);
						tr.setMeta(key, { pos: startPos });
						return tr;
					});
				} else if (![e.altKey, e.ctrlKey, e.shiftKey].some((pressed) => pressed)) {
					// If not trying to press shortcut keys,
					// return focus to editor to resume editing from caret position
					view.focus();
				}
			}
		},
		[getPos, start, api?.core?.actions, view],
	);

	useEffect(() => {
		const element = buttonRef.current;
		if (!element) {
			return;
		}

		return draggable({
			element,
			getInitialData: () => ({
				type: 'element',
				start,
			}),
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				setCustomNativeDragPreview({
					render: ({ container }) => {
						const dom: HTMLElement | null = view.dom.querySelector(
							`[data-drag-handler-anchor-name="${anchorName}"]`,
						);
						if (!dom) {
							return;
						}
						return dragPreview(container, dom, nodeType);
					},
					nativeSetDragImage,
				});
			},
			onDragStart() {
				if (start === undefined) {
					return;
				}
				api?.core?.actions.execute(({ tr }) => {
					api?.blockControls?.commands.setNodeDragged(start, anchorName, nodeType)({ tr });

					const resolvedMovingNode = tr.doc.resolve(start);
					const maybeNode = resolvedMovingNode.nodeAfter;
					tr.setMeta('scrollIntoView', false);
					api?.analytics?.actions.attachAnalyticsEvent({
						eventType: EVENT_TYPE.UI,
						action: ACTION.DRAGGED,
						actionSubject: ACTION_SUBJECT.ELEMENT,
						actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
						attributes: {
							nodeDepth: resolvedMovingNode.depth,
							nodeType: maybeNode?.type.name || '',
						},
					})(tr);
					return tr;
				});

				view.focus();
			},
		});
	}, [anchorName, api, nodeType, view, start]);

	const macroInteractionUpdates = featureFlagsState?.macroInteractionUpdates;

	const calculatePosition = useCallback(() => {
		const supportsAnchor =
			CSS.supports('top', `anchor(${anchorName} start)`) &&
			CSS.supports('left', `anchor(${anchorName} start)`);
		const dom: HTMLElement | null = view.dom.querySelector(
			`[data-drag-handler-anchor-name="${anchorName}"]`,
		);

		const hasResizer = nodeType === 'table' || nodeType === 'mediaSingle';
		const isExtension = nodeType === 'extension' || nodeType === 'bodiedExtension';
		const isBlockCard = nodeType === 'blockCard' && !!blockCardWidth;
		const isEmbedCard = nodeType === 'embedCard';

		let innerContainer: HTMLElement | null = null;
		if (dom) {
			if (isEmbedCard) {
				innerContainer = dom.querySelector('.rich-media-item');
			} else if (hasResizer) {
				innerContainer = dom.querySelector('.resizer-item');
			} else if (isExtension) {
				innerContainer = dom.querySelector('.extension-container[data-layout]');
			} else if (isBlockCard) {
				//specific to datasource blockCard
				innerContainer = dom.querySelector('.datasourceView-content-inner-wrap');
			}
		}

		if (supportsAnchor) {
			return {
				left:
					hasResizer || isExtension || isEmbedCard || (isBlockCard && innerContainer)
						? `calc(anchor(${anchorName} start) + ${getLeftPosition(dom, nodeType, innerContainer, macroInteractionUpdates)})`
						: `calc(anchor(${anchorName} start) - ${DRAG_HANDLE_WIDTH}px - ${dragHandleGap(nodeType)}px)`,

				top: fg('platform_editor_elements_dnd_ed_23674')
					? `calc(anchor(${anchorName} start) + ${topPositionAdjustment(nodeType)}px)`
					: anchorName.includes('table')
						? `calc(anchor(${anchorName} start) + ${DRAG_HANDLE_HEIGHT}px)`
						: `anchor(${anchorName} start)`,
			};
		}
		return {
			left:
				hasResizer || isExtension || isEmbedCard || (isBlockCard && innerContainer)
					? `calc(${dom?.offsetLeft || 0}px + ${getLeftPosition(dom, nodeType, innerContainer, macroInteractionUpdates)})`
					: getLeftPosition(dom, nodeType, innerContainer, macroInteractionUpdates),
			top: fg('platform_editor_elements_dnd_ed_23674')
				? getTopPosition(dom, nodeType)
				: getTopPosition(dom),
		};
	}, [anchorName, nodeType, view, blockCardWidth, macroInteractionUpdates]);

	const [newPositionStyles, setNewPositionStyles] = useState<CSSProperties>({ display: 'none' });

	useEffect(() => {
		if (!fg('platform_editor_element_drag_and_drop_ed_23896')) {
			return;
		}
		let cleanUpTransitionListener: () => void;

		if (nodeType === 'extension' || nodeType === 'embedCard') {
			const dom: HTMLElement | null = view.dom.querySelector(
				`[data-drag-handler-anchor-name="${anchorName}"]`,
			);
			if (!dom) {
				return;
			}
			cleanUpTransitionListener = bind(dom, {
				type: 'transitionend',
				listener: () => {
					setNewPositionStyles(calculatePosition());
				},
			});
		}
		const calcPos = requestAnimationFrame(() => {
			setNewPositionStyles(calculatePosition());
		});
		return () => {
			cancelAnimationFrame(calcPos);
			cleanUpTransitionListener?.();
		};
	}, [calculatePosition, view.dom, anchorName, nodeType]);

	const positionStyles = useMemo(() => {
		if (fg('platform_editor_element_drag_and_drop_ed_23896')) {
			return newPositionStyles;
		}

		return calculatePosition();
	}, [calculatePosition, newPositionStyles]);

	useEffect(() => {
		if (
			handleOptions?.isFocused &&
			buttonRef.current &&
			fg('platform_editor_element_drag_and_drop_ed_23873')
		) {
			const id = requestAnimationFrame(() => {
				buttonRef.current?.focus();
			});
			return () => {
				cancelAnimationFrame(id);
				view.focus();
			};
		}
	}, [buttonRef, handleOptions?.isFocused, view]);

	const helpDescriptors = [
		{
			description: formatMessage(blockControlsMessages.dragToMove),
		},
		{
			description: formatMessage(blockControlsMessages.moveUp),
			keymap: dragToMoveUp,
		},
		{
			description: formatMessage(blockControlsMessages.moveDown),
			keymap: dragToMoveDown,
		},
	];

	const message = helpDescriptors
		.map((descriptor) => {
			return descriptor.keymap
				? [descriptor.description, getAriaKeyshortcuts(descriptor.keymap)]
				: [descriptor.description];
		})
		.join('. ');

	const renderButton = () => (
		// eslint-disable-next-line @atlaskit/design-system/no-html-button
		<button
			type="button"
			css={[dragHandleButtonStyles, dragHandleSelected && selectedStyles]}
			ref={buttonRef}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				fg('platform_editor_element_drag_and_drop_ed_23896') ? newPositionStyles : positionStyles
			}
			onClick={handleOnClick}
			onMouseDown={handleMouseDown}
			onKeyDown={handleKeyDown}
			data-testid="block-ctrl-drag-handle"
		>
			<DragHandlerIcon label="" size="medium" />
		</button>
	);

	return fg('platform_editor_element_drag_and_drop_ed_23873') ? (
		<Tooltip
			content={<TooltipContentWithMultipleShortcuts helpDescriptors={helpDescriptors} />}
			onShow={() => {
				api?.accessibilityUtils?.actions.ariaNotify(message, { priority: 'important' });
			}}
		>
			{renderButton()}
		</Tooltip>
	) : (
		renderButton()
	);
};

export const DragHandle = injectIntl(DragHandleInternal);
