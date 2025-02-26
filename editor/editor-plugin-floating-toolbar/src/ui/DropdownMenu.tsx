/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import type { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/floating-toolbar';
import type {
	DropdownOptionT,
	FloatingToolbarOverflowDropdownOptions,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import type { ButtonItemProps } from '@atlaskit/menu';
import { ButtonItem, HeadingItem } from '@atlaskit/menu';
import { B400 } from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

export const menuItemDimensions = {
	width: 175,
	height: 32,
};

const spacerStyles = css({
	display: 'flex',
	flex: 1,
	padding: token('space.100', '8px'),
});

const separatorStyles = css({
	background: token('color.border'),
	height: token('space.025', '1px'),
});

const headingStyles = css({
	padding: `${token('space.200', '16px')} 0 ${token('space.100', '8px')}`,
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
const menuContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minWidth: `${menuItemDimensions.width}px`,

	// temporary solution to retain spacing defined by @atlaskit/Item
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& button': {
		minHeight: token('space.400', '32px'),
		padding: `${token('space.100', '8px')} ${token('space.100', '8px')} 7px`,

		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& > [data-item-elem-before]': {
			marginRight: token('space.050', '4px'),
		},
	},
});

const labelStyles = css({
	display: 'inline-block',
	width: '100%',
});

// TODO: Migrate away from gridSize
// Recommendation: Replace with 4 as itemSpacing is used in calculations expecting a number
export const itemSpacing = gridSize() / 2;
export interface Props {
	hide: Function;
	dispatchCommand: Function;
	items: Array<DropdownOptionT<Function>> | FloatingToolbarOverflowDropdownOptions<Function>;
	showSelected?: boolean;
	editorView?: EditorView;
}

// Extend the ButtonItem component type to allow mouse events to be accepted from the Typescript check
export interface DropdownButtonItemProps extends ButtonItemProps {
	onMouseEnter?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseOver?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseLeave?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onMouseOut?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onFocus?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	onBlur?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}
const DropdownButtonItem: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<DropdownButtonItemProps & React.RefAttributes<HTMLElement>>
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
> = ButtonItem as any;

const DropdownMenuItem = (props: {
	item: DropdownOptionT<Function>;
	hide: Function;
	dispatchCommand: Function;
	editorView?: EditorView;
	intl: IntlShape;
	showSelected: boolean;
	itemSelected?: boolean;
}) => {
	const { item, hide, dispatchCommand, editorView, showSelected, intl } = props;
	const itemSelected = item.selected;

	const iconBefore = useMemo(() => {
		if (item.icon) {
			return item.icon;
		} else {
			return (
				<SelectedIconBefore itemSelected={itemSelected} showSelected={showSelected} intl={intl} />
			);
		}
	}, [itemSelected, showSelected, intl, item.icon]);

	const [tooltipContent, setTooltipContent] = useState<string>(item.tooltip || '');

	const handleItemMouseOut = useCallback(() => {
		setTooltipContent('');
		if (item.onMouseOut) {
			dispatchCommand(item.onMouseOut);
		}
	}, [item.onMouseOut, dispatchCommand]);

	const handleItemMouseDown = useCallback(
		(e: React.MouseEvent<Element>) => {
			e.preventDefault(); // ED-16204 - This is needed for safari to get handleItemClick() to work
			if (item.onMouseDown) {
				dispatchCommand(item.onMouseDown);
			}
		},
		[item.onMouseDown, dispatchCommand],
	);

	const handleItemMouseOver = useCallback(() => {
		setTooltipContent(item.tooltip || '');
		if (item.onMouseOver) {
			dispatchCommand(item.onMouseOver);
		}
	}, [item.tooltip, item.onMouseOver, dispatchCommand]);

	const handleItemMouseEnter = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			if (item.onMouseEnter) {
				e.preventDefault();
				dispatchCommand(item.onMouseEnter);
			}
		},
		[item.onMouseEnter, dispatchCommand],
	);

	const handleItemMouseLeave = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			if (item.onMouseLeave) {
				e.preventDefault();
				dispatchCommand(item.onMouseLeave);
			}
		},
		[item.onMouseLeave, dispatchCommand],
	);

	const handleItemOnFocus = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			if (item.onFocus) {
				e.preventDefault();
				dispatchCommand(item.onFocus);
			}
		},
		[item.onFocus, dispatchCommand],
	);

	const handleItemOnBlur = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			if (item.onBlur) {
				e.preventDefault();
				dispatchCommand(item.onBlur);
			}
		},
		[item.onBlur, dispatchCommand],
	);

	const handleItemClick = useCallback(() => {
		/**
		 * The order of dispatching the event and hide() is important, because
		 * the ClickAreaBlock will be relying on the element to calculate the
		 * click coordinate.
		 * For more details, please visit the comment in this PR https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5328/edm-1321-set-selection-near-smart-link?link_source=email#chg-packages/editor/editor-core/src/plugins/floating-toolbar/ui/DropdownMenu.tsx
		 */
		dispatchCommand(item.onClick);
		hide();
		if (!editorView?.hasFocus()) {
			editorView?.focus();
		}
	}, [dispatchCommand, item.onClick, hide, editorView]);

	/* ED-16704 - Native mouse event handler to overcome firefox issue on disabled <button> - https://github.com/whatwg/html/issues/5886 */
	const labelRef = useRef<HTMLDivElement>(null);
	const handleTitleWrapperMouseEvent = useCallback(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(e: any) => {
			if (item.disabled) {
				e.stopPropagation();
				e.preventDefault();
			}
		},
		[item.disabled],
	);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const isAriaChecked = (item: DropdownOptionT<any>) => {
		const { selected, domItemOptions } = item;

		return domItemOptions?.type === 'item-checkbox' ? selected : undefined;
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const hasRole = (item: DropdownOptionT<any>) => {
		return item.domItemOptions?.type === 'item-checkbox' ? 'menuitemcheckbox' : undefined;
	};

	useEffect(() => {
		const labelRefCurrent = labelRef.current;
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		labelRefCurrent?.addEventListener('click', handleTitleWrapperMouseEvent);
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		labelRefCurrent?.addEventListener('mousedown', handleTitleWrapperMouseEvent);
		return () => {
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			labelRefCurrent?.removeEventListener('click', handleTitleWrapperMouseEvent);
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			labelRefCurrent?.removeEventListener('mousedown', handleTitleWrapperMouseEvent);
		};
	});

	const itemContent = (
		<DropdownButtonItem
			isSelected={itemSelected}
			iconBefore={iconBefore}
			iconAfter={item.elemAfter}
			onClick={handleItemClick}
			data-testid={item.testId}
			isDisabled={item.disabled}
			onMouseDown={handleItemMouseDown}
			onMouseOver={handleItemMouseOver}
			onMouseEnter={handleItemMouseEnter}
			onMouseLeave={handleItemMouseLeave}
			onMouseOut={handleItemMouseOut}
			onFocus={handleItemOnFocus}
			onBlur={handleItemOnBlur}
			role={hasRole(item)}
			aria-checked={isAriaChecked(item)}
		>
			<span ref={labelRef} css={labelStyles}>
				{item.title}
			</span>
		</DropdownButtonItem>
	);

	if (tooltipContent) {
		return <Tooltip content={tooltipContent}>{itemContent}</Tooltip>;
	}

	return itemContent;
};

type SelectedIconBeforeProps = {
	itemSelected?: boolean;
	showSelected: boolean;
	intl: IntlShape;
};
const SelectedIconBefore = ({ itemSelected, intl, showSelected }: SelectedIconBeforeProps) => {
	if (showSelected && itemSelected) {
		return (
			<span aria-hidden="true">
				<EditorDoneIcon
					primaryColor={token('color.icon.selected', B400)}
					size="small"
					label={intl.formatMessage(messages.confirmModalOK)}
				/>
			</span>
		);
	}

	return <span css={spacerStyles} />;
};

const Dropdown = memo((props: Props & WrappedComponentProps) => {
	const { hide, dispatchCommand, items, intl, editorView, showSelected = true } = props;

	if (editorExperiment('platform_editor_controls', 'variant1')) {
		return (
			<div css={menuContainerStyles} role="menu">
				{items
					.filter((item) => !('hidden' in item) || !item.hidden)
					.map((item, idx) => {
						if (!('type' in item)) {
							return (
								<DropdownMenuItem
									// Ignored via go/ees005
									// eslint-disable-next-line react/no-array-index-key
									key={idx}
									item={item}
									hide={hide}
									dispatchCommand={dispatchCommand}
									editorView={editorView}
									showSelected={showSelected}
									intl={intl}
								/>
							);
						}
						if (item.type === 'separator') {
							// eslint-disable-next-line react/no-array-index-key
							return <div key={idx} css={separatorStyles} />;
						}
						if (item.type === 'overflow-dropdown-heading') {
							return (
								<div key={item.title} css={headingStyles}>
									<HeadingItem>{item.title}</HeadingItem>
								</div>
							);
						}
					})}
			</div>
		);
	}

	return (
		<div css={menuContainerStyles} role="menu">
			{(items as Array<DropdownOptionT<Function>>)
				.filter((item) => !item.hidden)
				.map((item, idx) => (
					<DropdownMenuItem
						// Ignored via go/ees005
						// eslint-disable-next-line react/no-array-index-key
						key={idx}
						item={item}
						hide={hide}
						dispatchCommand={dispatchCommand}
						editorView={editorView}
						showSelected={showSelected}
						intl={intl}
					/>
				))}
		</div>
	);
});

export default injectIntl(Dropdown);
