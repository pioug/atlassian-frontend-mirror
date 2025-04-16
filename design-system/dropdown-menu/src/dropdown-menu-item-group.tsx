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
const DropdownMenuItemGroup = forwardRef<HTMLElement, SectionProps>(
	(
		{
			children,
			id,
			isList,
			isScrollable,
			title,
			testId,
			hasSeparator,
			overrides,
			...rest
		}: SectionProps,
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
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides, @atlaskit/design-system/no-deprecated-apis
				overrides={overrides}
				{...rest}
			>
				{title && <GroupTitle id={titleId} title={title} />}
				{children}
			</Section>
		);
	},
);

export default DropdownMenuItemGroup;
