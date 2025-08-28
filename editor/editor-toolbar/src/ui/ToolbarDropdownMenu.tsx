/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { jsx, cssMap } from '@compiled/react';

import DropdownMenu, { type OnOpenChangeArgs } from '@atlaskit/dropdown-menu';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { useToolbarUI } from '../hooks/ui-context';

import { ToolbarButton } from './ToolbarButton';
import { ToolbarDropdownMenuProvider, useToolbarDropdownMenu } from './ToolbarDropdownMenuContext';

const styles = cssMap({
	sectionMargin: {
		marginBlock: token('space.050'),
	},

	firstSectionSeparator: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[data-section]:nth-of-type(1)': {
			// Remove separator from first section
			borderBlockStart: 'unset',
		},
	},
});

type ToolbarDropdownMenuProps = {
	children?: ReactNode;
	/**
	 * Whether to add margin around sections to align with 4px block padding existing in current editor dropdown
	 */
	hasSectionMargin?: boolean;
	iconBefore: React.ReactNode;
	isDisabled?: boolean;
	label?: string;
	testId?: string;
};

const ToolbarDropdownMenuContent = ({
	iconBefore,
	children,
	isDisabled,
	testId,
	label,
}: ToolbarDropdownMenuProps) => {
	const { onDropdownOpenChanged } = useToolbarUI();
	const { closeMenu, isOpen, openMenu } = useToolbarDropdownMenu();

	const handleOpenChange = useCallback(
		(args: OnOpenChangeArgs) => {
			onDropdownOpenChanged(args);
			if (!args.isOpen) {
				closeMenu();
			}
		},
		[closeMenu, onDropdownOpenChanged],
	);

	const handleClick = useCallback(() => {
		if (!isOpen) {
			openMenu();
		} else {
			closeMenu();
		}
	}, [closeMenu, openMenu, isOpen]);

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
						handleClick();
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
			isOpen={isOpen}
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
}: ToolbarDropdownMenuProps) => {
	return (
		<ToolbarDropdownMenuProvider>
			<ToolbarDropdownMenuContent
				iconBefore={iconBefore}
				isDisabled={isDisabled}
				testId={testId}
				label={label}
			>
				<div
					css={[
						hasSectionMargin && styles.sectionMargin,
						expValEquals('platform_editor_toolbar_migrate_loom', 'isEnabled', true) &&
							styles.firstSectionSeparator,
					]}
				>
					{children}
				</div>
			</ToolbarDropdownMenuContent>
		</ToolbarDropdownMenuProvider>
	);
};
