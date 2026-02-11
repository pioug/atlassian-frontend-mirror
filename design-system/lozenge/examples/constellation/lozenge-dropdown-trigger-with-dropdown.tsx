/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ImageIcon from '@atlaskit/icon/core/image';
import Lozenge, { LozengeDropdownTrigger } from '@atlaskit/lozenge';

const _default: () => JSX.Element = () => {
	const statusOptions = [
		{ label: 'Success', value: 'success' as const },
		{ label: 'Warning', value: 'warning' as const },
		{ label: 'Danger', value: 'danger' as const },
		{ label: 'Information', value: 'information' as const },
		{ label: 'Discovery', value: 'discovery' as const },
		{ label: 'Neutral', value: 'neutral' as const },
	];

	const [currentStatus, setCurrentStatus] = useState<(typeof statusOptions)[number]['value']>('success');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	return (
		<DropdownMenu
			trigger={({ triggerRef, ...props }) => (
				<LozengeDropdownTrigger
					ref={triggerRef}
					appearance={currentStatus}
					isSelected={isDropdownOpen}
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					iconBefore={ImageIcon}
					{...props}
				>
					{statusOptions.find((opt) => opt.value === currentStatus)?.label}
				</LozengeDropdownTrigger>
			)}
			onOpenChange={(attrs) => setIsDropdownOpen(attrs.isOpen)}
		>
			<DropdownItemGroup>
				{statusOptions.map((option) => (
					<DropdownItem key={option.value} onClick={() => setCurrentStatus(option.value)}>
						<Lozenge appearance={option.value} iconBefore={ImageIcon}>
							{option.label}
						</Lozenge>
					</DropdownItem>
				))}
			</DropdownItemGroup>
		</DropdownMenu>
	);
};
export default _default;
