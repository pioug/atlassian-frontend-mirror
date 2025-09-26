import React, { forwardRef } from 'react';

import { useId } from '@atlaskit/ds-lib/use-id';
import { Section, type SectionProps } from '@atlaskit/menu';

import GroupTitle from './internal/components/group-title';

/**
 * __Dropdown item checkbox group__
 *
 * A wrapping element for dropdown menu items.
 *
 */
const DropdownMenuItemGroup: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SectionProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, SectionProps>(
	(
		{ children, id, isList, isScrollable, title, testId, hasSeparator, ...rest }: SectionProps,
		ref,
	) => {
		const uid = useId();
		const titleId = `dropdown-menu-item-group-title-${uid}`;

		return (
			<Section
				id={id}
				ref={ref}
				isList={isList}
				isScrollable={isScrollable}
				hasSeparator={hasSeparator}
				testId={testId}
				titleId={title ? titleId : undefined}
				{...rest}
			>
				{title && <GroupTitle id={titleId} title={title} />}
				{children}
			</Section>
		);
	},
);

export default DropdownMenuItemGroup;
