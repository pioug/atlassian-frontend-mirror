/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, cssMap, cx } from '@compiled/react';

import DropdownMenu from '@atlaskit/dropdown-menu';
import { Box } from '@atlaskit/primitives/compiled';

import { ToolbarDropdownItem } from './ToolbarDropdownItem';

const styles = cssMap({
	scrollContainer: {
		maxHeight: '320px',
		overflowY: 'auto',
	},
});

type ToolbarNestedDropdownMenuProps = {
	children?: ReactNode;
	dropdownTestId?: string;
	elemAfter: ReactNode;
	elemBefore: ReactNode;
	/**
	 * Enforeces a max height of 320px for menus - when menu is larger a scroll is introduced
	 */
	enableMaxHeight?: boolean;
	isDisabled?: boolean;
	onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
	shouldFitContainer?: boolean;
	testId?: string;
	text?: string;
};

export const ToolbarNestedDropdownMenu = ({
	elemBefore,
	text,
	elemAfter,
	children,
	isDisabled,
	testId,
	dropdownTestId,
	enableMaxHeight = false,
	onClick,
	shouldFitContainer = false,
}: ToolbarNestedDropdownMenuProps) => {
	return (
		<DropdownMenu<HTMLButtonElement>
			shouldFitContainer={shouldFitContainer}
			placement="right-start"
			testId={dropdownTestId}
			trigger={(triggerProps) => (
				<ToolbarDropdownItem
					elemBefore={elemBefore}
					elemAfter={elemAfter}
					isSelected={triggerProps.isSelected}
					onClick={(e) => {
						onClick && onClick(e);
						triggerProps.onClick && triggerProps.onClick(e);
					}}
					testId={testId}
					triggerRef={triggerProps.triggerRef}
					hasNestedDropdownMenu={true}
					isDisabled={isDisabled}
				>
					{text}
				</ToolbarDropdownItem>
			)}
		>
			<Box xcss={cx(enableMaxHeight && styles.scrollContainer)}>{children}</Box>
		</DropdownMenu>
	);
};
