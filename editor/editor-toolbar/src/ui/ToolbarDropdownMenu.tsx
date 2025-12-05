/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { jsx, cssMap, cx } from '@compiled/react';

import DropdownMenu, { type OnOpenChangeArgs } from '@atlaskit/dropdown-menu';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { useToolbarUI } from '../hooks/ui-context';

import { ToolbarButton } from './ToolbarButton';
import { useToolbarDropdownMenu } from './ToolbarDropdownMenuContext';

const styles = cssMap({
	sectionMargin: {
		marginBlock: token('space.025'),
	},

	firstSectionSeparator: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[data-section]:nth-of-type(1)': {
			// Remove separator from first section
			borderBlockStart: 'unset',
		},
	},
	scrollContainer: {
		maxHeight: '320px',
		overflowY: 'auto',
	},
});

type ToolbarDropdownMenuProps = {
	children?: ReactNode;
	/**
	 * Enforeces a max height of 320px for menus - when menu is larger a scroll is introduced
	 */
	enableMaxHeight?: boolean;
	/**
	 * Whether to add margin around sections to align with 4px block padding existing in current editor dropdown
	 */
	hasSectionMargin?: boolean;
	iconBefore: React.ReactNode;
	isDisabled?: boolean;
	label?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, isOpen: boolean) => void;
	testId?: string;
};

const ToolbarDropdownMenuContent = ({
	iconBefore,
	children,
	isDisabled,
	testId,
	label,
	onClick,
}: ToolbarDropdownMenuProps) => {
	const { onDropdownOpenChanged } = useToolbarUI();
	const menuContext = useToolbarDropdownMenu();

	const handleOpenChange = useCallback(
		(args: OnOpenChangeArgs) => {
			onDropdownOpenChanged(args);
			if (!args.isOpen) {
				menuContext?.closeMenu(args.event);
			}
		},
		[menuContext, onDropdownOpenChanged],
	);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			if (!menuContext?.isOpen) {
				menuContext?.openMenu(e);
			} else {
				menuContext?.closeMenu(e);
			}
		},
		[menuContext],
	);

	return (
		<DropdownMenu<HTMLButtonElement>
			trigger={(triggerProps) => (
				<ToolbarButton
					ref={triggerProps.triggerRef}
					isSelected={triggerProps.isSelected}
					aria-expanded={triggerProps['aria-expanded']}
					aria-haspopup={triggerProps['aria-haspopup']}
					aria-controls={triggerProps['aria-controls']}
					onBlur={triggerProps.onBlur}
					onClick={(e) => {
						onClick && onClick(e, !menuContext?.isOpen);
						handleClick(e);
						triggerProps.onClick && triggerProps.onClick(e);
					}}
					onFocus={triggerProps.onFocus}
					testId={testId}
					iconBefore={iconBefore}
					isDisabled={isDisabled}
					label={label}
				/>
			)}
			onOpenChange={handleOpenChange}
			isOpen={menuContext?.isOpen}
		>
			{children}
		</DropdownMenu>
	);
};

export const ToolbarDropdownMenu = ({
	iconBefore,
	children,
	isDisabled,
	testId,
	label,
	hasSectionMargin = true,
	enableMaxHeight = false,
	onClick,
}: ToolbarDropdownMenuProps) => {
	return (
		<ToolbarDropdownMenuContent
			iconBefore={iconBefore}
			isDisabled={isDisabled}
			testId={testId}
			label={label}
			onClick={onClick}
		>
			<Box
				xcss={cx(
					hasSectionMargin && styles.sectionMargin,
					enableMaxHeight && styles.scrollContainer,
					expValEquals('platform_editor_toolbar_migrate_loom', 'isEnabled', true) &&
						styles.firstSectionSeparator,
				)}
				data-toolbar-component="menu"
			>
				{children}
			</Box>
		</ToolbarDropdownMenuContent>
	);
};
