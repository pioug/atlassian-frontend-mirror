/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	useLayoutEffect,
	useRef,
	type KeyboardEvent,
	type MouseEvent,
	type ReactNode,
	type RefObject,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, cssMap, cx } from '@compiled/react';
import { mergeRefs } from 'use-callback-ref';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled';

import { ToolbarDropdownItem } from './ToolbarDropdownItem';
import { ToolbarTooltip } from './ToolbarTooltip';

const styles = cssMap({
	scrollContainer: {
		maxHeight: '320px',
		overflowY: 'auto',
	},
});

const PopupVisibilityController = ({
	isVisible,
	popupContentIdRef,
	triggerElementRef,
}: {
	isVisible: boolean;
	popupContentIdRef: RefObject<string | undefined>;
	triggerElementRef: RefObject<HTMLButtonElement | null>;
}): null => {
	useLayoutEffect(() => {
		if (isVisible) {
			return;
		}

		const popupContentId = popupContentIdRef.current;
		const popupElement = popupContentId
			? triggerElementRef.current?.ownerDocument.getElementById(popupContentId)
			: null;
		if (!popupElement) {
			return;
		}

		const previousVisibility = popupElement.style.visibility;
		popupElement.style.visibility = 'hidden';

		return () => {
			popupElement.style.visibility = previousVisibility;
		};
	}, [isVisible, popupContentIdRef, triggerElementRef]);

	return null;
};

type ToolbarNestedDropdownMenuProps = {
	children?: ReactNode;
	'data-extension-item-key'?: string;
	dropdownTestId?: string;
	elemAfter: ReactNode;
	elemAfterText?: ReactNode;
	elemBefore: ReactNode;
	/**
	 * Enforeces a max height of 320px for menus - when menu is larger a scroll is introduced
	 */
	enableMaxHeight?: boolean;
	isDisabled?: boolean;
	isPopupVisible?: boolean;
	onClick?: (e: MouseEvent | KeyboardEvent) => void;
	shouldFitContainer?: boolean;
	shouldIgnoreCloseEvent?: (event: Event | MouseEvent | KeyboardEvent) => boolean;
	shouldTitleWrap?: boolean;
	testId?: string;
	text?: string;
	tooltipContent?: ReactNode;
};

export const ToolbarNestedDropdownMenu = ({
	elemBefore,
	text,
	elemAfterText,
	elemAfter,
	children,
	isDisabled,
	testId,
	dropdownTestId,
	enableMaxHeight = false,
	isPopupVisible,
	onClick,
	shouldFitContainer = false,
	shouldIgnoreCloseEvent,
	shouldTitleWrap,
	tooltipContent,
	'data-extension-item-key': dataExtensionItemKey,
}: ToolbarNestedDropdownMenuProps): JSX.Element => {
	const popupContentIdRef = useRef<string | undefined>(undefined);
	const triggerElementRef = useRef<HTMLButtonElement | null>(null);

	return (
		<DropdownMenu<HTMLButtonElement>
			shouldFitContainer={shouldFitContainer}
			shouldIgnoreCloseEvent={fg('cc_blocks_changeboarding') ? shouldIgnoreCloseEvent : undefined}
			placement="right-start"
			testId={dropdownTestId}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			trigger={(triggerProps) => {
				const captureTriggerRef = (element: HTMLButtonElement | null) => {
					triggerElementRef.current = element;
					popupContentIdRef.current = element ? triggerProps['aria-controls'] : undefined;
				};
				const item = (
					<ToolbarDropdownItem
						elemBefore={elemBefore}
						elemAfter={elemAfter}
						isSelected={triggerProps.isSelected}
						// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
						onClick={(e) => {
							onClick && onClick(e);
							triggerProps.onClick && triggerProps.onClick(e);
						}}
						testId={testId}
						triggerRef={
							isPopupVisible === undefined
								? triggerProps.triggerRef
								: mergeRefs([triggerProps.triggerRef, captureTriggerRef])
						}
						hasNestedDropdownMenu={true}
						isDisabled={isDisabled}
						shouldTitleWrap={shouldTitleWrap}
						data-extension-item-key={
							fg('cc_blocks_changeboarding') ? dataExtensionItemKey : undefined
						}
					>
						{text}
						{elemAfterText}
					</ToolbarDropdownItem>
				);

				if (tooltipContent) {
					return (
						<ToolbarTooltip content={tooltipContent} position="top">
							{item}
						</ToolbarTooltip>
					);
				}

				return item;
			}}
		>
			<Box xcss={cx(enableMaxHeight && styles.scrollContainer)} data-toolbar-nested-dropdown-menu>
				{isPopupVisible !== undefined && (
					<PopupVisibilityController
						isVisible={isPopupVisible}
						popupContentIdRef={popupContentIdRef}
						triggerElementRef={triggerElementRef}
					/>
				)}
				{children}
			</Box>
		</DropdownMenu>
	);
};
