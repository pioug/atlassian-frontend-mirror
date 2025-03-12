/* eslint-disable @atlaskit/design-system/use-tokens-typography */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx, styled } from '@compiled/react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl-next';
import invariant from 'tiny-invariant';

import Button from '@atlaskit/button/new';
import DropdownMenu, {
	type CustomTriggerProps,
	DropdownItem,
	type DropdownMenuProps,
} from '@atlaskit/dropdown-menu';
import ChevronDown from '@atlaskit/icon/utility/migration/chevron-down';
import ChevronUp from '@atlaskit/icon/utility/migration/chevron-up';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	attachClosestEdge,
	type Edge,
	extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
	draggable,
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../analytics';

import { GlyphPlaceholder, UnwrapTextIcon, WrapTextIcon } from './custom-icons';
import { DraggableTableHeadingOld } from './draggable-table-heading-old';
import { issueLikeTableMessages } from './messages';
import { getColumnMinWidth, getWidthCss } from './utils';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled
const TableHeading = styled.th({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &, .ProseMirror .pm-table-wrapper > table thead &, &': {
		border: 0,
		position: 'relative',
		/* This makes resizing work with out jumping due to padding + changes overall width for same default values. */
		boxSizing: 'border-box',
		lineHeight: '24px',
		paddingTop: token('space.025', '2px'),
		paddingRight: token('space.050', '4px'),
		paddingBottom: token('space.025', '2px'),
		paddingLeft: token('space.050', '4px'),
		borderRight: `0.5px solid ${token('color.border', N40)}`,
		borderBottom: `2px solid ${token('color.border', N40)}`,
		/*
      lineHeight * 2 -> Max height of two lined header
      verticalPadding * 2 -> padding for this component itself
      verticalPadding * 2 -> padding inside span (--container)
      2px -> Bottom border
      Last two terms are needed because of border-box box sizing.
    */
		height: `calc(24px * 2 + ${token('space.025', '2px')} * 4 + 2px)`,
		verticalAlign: 'bottom',
		backgroundColor: token('utility.elevation.surface.current', '#FFF'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead.has-column-picker &:nth-last-of-type(2), .ProseMirror .pm-table-wrapper > table thead.has-column-picker &:nth-last-of-type(2), thead.has-column-picker &:nth-last-of-type(2)':
		{
			borderRight: 0,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &:first-of-type, .ProseMirror .pm-table-wrapper > table thead &:first-of-type, &:first-of-type':
		{
			paddingLeft: token('space.050', '4px'),
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'.pm-table-wrapper > table thead &:last-of-type, .ProseMirror .pm-table-wrapper > table thead &:last-of-type, &:last-of-type':
		{
			borderRight: 0,
		},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"& [data-testid='datasource-header-content--container']": {
		width: '100%',
		/* With Button now being a parent for this component it adds its lineHeight value and spoils
      `height` calculation above. */
		lineHeight: '24px',
		paddingTop: token('space.025', '2px'),
		paddingRight: token('space.050', '4px'),
		paddingBottom: token('space.025', '2px'),
		paddingLeft: token('space.050', '4px'),
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		whiteSpace: 'normal',
		overflow: 'hidden',
		wordWrap: 'break-word',
	},
});

type DraggableState =
	| { type: 'idle' }
	| { type: 'preview'; container: HTMLElement }
	| { type: 'dragging' }
	| {
			type: 'resizing';
			initialWidth: number;
	  };

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const DropdownParent = styled.div({
	display: 'flex',
	alignItems: 'center',
	whiteSpace: 'nowrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& button': {
		textAlign: 'left' /* By default button center in the middle without props to control it */,
		height: 'auto' /* By default button is not happy with tall (up to lines in our case) content */,
		paddingBlock: token('space.0'),
		paddingLeft: token(
			'space.0',
			'0px',
		) /* By default button's padding left and right is 8 + 4. We control that 8, so left with 4 that we need.  */,
		paddingRight: token('space.0', '0px'),
	},
});

const dropTargetStyles = css({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
});

const noPointerEventsStyles = css({
	pointerEvents: 'none',
});

const resizerStyles = css({
	'--local-hitbox-width': token('space.300', '24px'),
	width: 'var(--local-hitbox-width)',
	cursor: 'col-resize',
	flexGrow: '0',
	position: 'absolute',
	zIndex: 1, // we want this to sit on top of adjacent column headers
	right: 'calc(-1 * calc(var(--local-hitbox-width) / 2))',
	top: 0,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'::before': {
		opacity: 0,
		'--local-line-width': token('border.width', '2px'),
		content: '""',
		position: 'absolute',
		backgroundColor: token('color.border.brand', '#0052CC'),
		width: 'var(--local-line-width)',
		inset: 0,
		left: `calc(50% - calc(var(--local-line-width) / 2))`,
		transition: 'opacity 0.2s ease',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':hover::before': {
		opacity: 1,
	},
});

const resizingStyles = css({
	// turning off the resizing cursor as sometimes it can cause the cursor to flicker
	// while resizing. The browser controls the cursor while dragging, but the browser
	// can sometimes bug out.
	cursor: 'unset',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'::before': {
		opacity: 1,
	},
});

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };

interface DraggableTableHeadingProps {
	children: ReactNode;
	id: string;
	index: number;
	tableId: symbol;
	dndPreviewHeight: number;
	dragPreview: React.ReactNode;
	width?: number;
	onWidthChange?: (width: number) => void;
	isWrapped?: boolean;
	onIsWrappedChange?: (shouldWrap: boolean) => void;
}

const DraggableTableHeadingNew = ({
	children,
	id,
	index,
	tableId,
	dndPreviewHeight,
	dragPreview,
	width,
	onWidthChange,
	isWrapped,
	onIsWrappedChange,
}: DraggableTableHeadingProps) => {
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const mainHeaderCellRef = useRef<HTMLTableCellElement>(null);
	const columnResizeHandleRef = useRef<HTMLDivElement | null>(null);
	const [state, setState] = useState<DraggableState>(idleState);

	const [isDraggingAnyColumn, setIsDraggingAnyColumn] = useState(false);
	const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

	const dropTargetRef = useRef<HTMLDivElement>(null);
	/**
	 * When width is not set (or callback is not set) we assume not resizing is needed.
	 * In our case width won't be set for last cell when table container is bigger than sum of all columns
	 */
	const resizeIsEnabled = !!onWidthChange && !!width;

	useEffect(() => {
		const cell = mainHeaderCellRef.current;

		invariant(cell);

		return combine(
			draggable({
				element: cell,
				getInitialData() {
					return { type: 'table-header', id, index, tableId };
				},
				onGenerateDragPreview({ nativeSetDragImage }) {
					setCustomNativeDragPreview({
						getOffset: pointerOutsideOfPreview({
							x: '18px',
							y: '18px',
						}),
						render: ({ container }) => {
							// Cause a `react` re-render to create your portal synchronously
							setState({ type: 'preview', container });
							// In our cleanup function: cause a `react` re-render to create remove your portal
							// Note: you can also remove the portal in `onDragStart`,
							// which is when the cleanup function is called
							return () => setState(draggingState);
						},
						nativeSetDragImage,
					});
				},
				onDragStart() {
					setState(draggingState);
				},
				onDrop() {
					setState(idleState);
				},
			}),
		);
	}, [id, index, tableId]);

	// Here we handle drop target, that in our case is absolutely positioned div that covers full width and height
	// of this column (has height of whole table). It sits on top of everything, but has `pointerEvents: 'none'` by default
	useEffect(() => {
		const dropTarget = dropTargetRef.current;
		invariant(dropTarget);

		return dropTargetForElements({
			element: dropTarget,
			getIsSticky() {
				return true;
			},
			getData({ input, element }) {
				const data = { id, index };
				return attachClosestEdge(data, {
					input,
					element,
					allowedEdges: ['left', 'right'],
				});
			},
			canDrop(args) {
				return args.source.data.type === 'table-header' && args.source.data.tableId === tableId;
			},
			onDrag(args) {
				if (args.source.data.id !== id) {
					setClosestEdge(extractClosestEdge(args.self.data));
				}
			},
			onDragLeave() {
				setClosestEdge(null);
			},
			onDrop() {
				setClosestEdge(null);
			},
		});
	}, [id, index, tableId]);

	// During dragging anywhere we want to remove `pointerEvents: 'none'` from all the drop targets
	useEffect(() => {
		return monitorForElements({
			canMonitor({ source }) {
				return source.data.type === 'table-header' && source.data.tableId === tableId;
			},
			onDragStart() {
				/**
				 * Should cause a synchronous re-render.
				 */
				setIsDraggingAnyColumn(true);
			},
			onDrop() {
				setIsDraggingAnyColumn(false);
			},
		});
	}, [tableId]);

	// Handling column resizing
	useEffect(() => {
		if (!resizeIsEnabled) {
			return;
		}
		const resizeHandle = columnResizeHandleRef.current;
		invariant(resizeHandle);
		const mainHeaderCell = mainHeaderCellRef.current;
		invariant(mainHeaderCell);

		return draggable({
			element: resizeHandle,
			getInitialData() {
				// metadata related to currently dragging item (can be read by drop events etc)
				return { type: 'column-resize', id, index, tableId };
			},

			// Is called when dragging started
			onGenerateDragPreview({ nativeSetDragImage }) {
				// We don't show any preview, since column separator (handle) is moving with the cursor
				disableNativeDragPreview({ nativeSetDragImage });
				// Block drag operations outside `@atlaskit/pragmatic-drag-and-drop`
				preventUnhandled.start();

				setState({
					type: 'resizing',
					initialWidth: width,
				});
			},
			onDrag({ location }) {
				const relativeDistanceX = location.current.input.clientX - location.initial.input.clientX;

				invariant(state.type === 'resizing');
				const { initialWidth } = state;

				// Set the width of our header being resized
				let proposedWidth = initialWidth + relativeDistanceX;

				if (proposedWidth < getColumnMinWidth(id)) {
					proposedWidth = getColumnMinWidth(id);
				}

				// We update width css directly live
				mainHeaderCell.style.setProperty('width', `${proposedWidth}px`);
			},
			onDrop() {
				preventUnhandled.stop();
				setState(idleState);
				if (onWidthChange) {
					let cssWidth = +mainHeaderCell.style.getPropertyValue('width').slice(0, -2);

					onWidthChange(cssWidth);
				}
			},
		});
	}, [id, index, onWidthChange, resizeIsEnabled, state, tableId, width]);

	const [buttonHovered, setButtonHovered] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	// Width is not set when it is a last cell in a wide table.
	// We make assumption thus that there is enough width for chevron.
	const isWideEnoughToHaveChevron = !width || width > 76;

	const shouldShowTriggerIcon = (buttonHovered || isDropdownOpen) && isWideEnoughToHaveChevron;
	const triggerIcon = useMemo(
		() =>
			shouldShowTriggerIcon
				? isDropdownOpen
					? ChevronUp
					: ChevronDown
				: isWideEnoughToHaveChevron
					? GlyphPlaceholder
					: undefined,
		[shouldShowTriggerIcon, isDropdownOpen, isWideEnoughToHaveChevron],
	);

	const getTriggerButton = useCallback(
		({ triggerRef, ...props }: CustomTriggerProps<HTMLButtonElement>) => {
			return (
				<Button
					{...props}
					testId={`${id}-column-dropdown`}
					shouldFitContainer
					iconAfter={triggerIcon}
					ref={triggerRef}
					appearance="subtle"
					spacing="compact"
					onMouseEnter={() => setButtonHovered(true)}
					onMouseLeave={() => setButtonHovered(false)}
				>
					{children}
				</Button>
			);
		},
		[children, id, triggerIcon],
	);

	const onDropdownOpenChange: NonNullable<DropdownMenuProps['onOpenChange']> = useCallback(
		({ isOpen }) => setIsDropdownOpen(isOpen),
		[],
	);

	const toggleWrap = useCallback(() => {
		if (!onIsWrappedChange) {
			return;
		}

		const nextIsWrap = !(isWrapped || false);
		if (nextIsWrap) {
			fireEvent('ui.button.clicked.wrap', {});
		} else {
			fireEvent('ui.button.clicked.unwrap', {});
		}

		onIsWrappedChange(nextIsWrap);
	}, [fireEvent, isWrapped, onIsWrappedChange]);

	return (
		<TableHeading
			ref={mainHeaderCellRef}
			data-testid={`${id}-column-heading`}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				cursor: 'grab',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				...getWidthCss({ shouldUseWidth: resizeIsEnabled, width }),
			}}
		>
			{resizeIsEnabled ? (
				<div
					ref={columnResizeHandleRef}
					css={[resizerStyles, state.type === 'resizing' && resizingStyles]}
					style={{
						height: `${dndPreviewHeight}px`,
					}}
					data-testid="column-resize-handle"
				></div>
			) : null}
			{onIsWrappedChange ? (
				<DropdownParent>
					<DropdownMenu<HTMLButtonElement>
						trigger={getTriggerButton}
						onOpenChange={onDropdownOpenChange}
						placement={'bottom'}
					>
						<DropdownItem
							elemBefore={isWrapped ? <UnwrapTextIcon /> : <WrapTextIcon />}
							testId={`${id}-column-dropdown-item-toggle-wrapping`}
							onClick={toggleWrap}
						>
							{isWrapped ? (
								<FormattedMessage {...issueLikeTableMessages.unwrapText} />
							) : (
								<FormattedMessage {...issueLikeTableMessages.wrapText} />
							)}
						</DropdownItem>
					</DropdownMenu>
				</DropdownParent>
			) : (
				children
			)}
			<div
				ref={dropTargetRef}
				css={[dropTargetStyles, isDraggingAnyColumn ? null : noPointerEventsStyles]}
				style={{
					height: `${dndPreviewHeight}px`,
				}}
				data-testid={'column-drop-target'}
			>
				{closestEdge && <DropIndicator edge={closestEdge} />}
			</div>
			{state.type === 'preview' ? ReactDOM.createPortal(dragPreview, state.container) : null}
		</TableHeading>
	);
};

export const DraggableTableHeading = (props: DraggableTableHeadingProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <DraggableTableHeadingNew {...props} />;
	} else {
		return <DraggableTableHeadingOld {...props} />;
	}
};
