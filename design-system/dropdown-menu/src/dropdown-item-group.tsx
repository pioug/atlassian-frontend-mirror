/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type Ref } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { useId } from '@atlaskit/ds-lib/use-id';
import Section from '@atlaskit/menu/section';
import type { SectionProps } from '@atlaskit/menu/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import GroupTitle from './internal/components/group-title';

const styles = cssMap({
	root: {
		display: 'flex',
		position: 'static',
		flexDirection: 'column',
		overflow: 'auto',
		rowGap: token('space.025'),
		paddingInline: token('space.075'),
		paddingBlockStart: token('space.075'),
		paddingBlockEnd: token('space.075'),
		flexShrink: 0,
	},
	separator: {
		borderBlockStartColor: token('color.border'),
		borderBlockStartStyle: 'solid',
		borderBlockStartWidth: token('border.width'),
	},
	scrollable: {
		flexShrink: 1,
		overflow: 'auto',
	},
});

/**
 * __Dropdown item group__
 *
 * A wrapping element for dropdown menu items.
 *
 */
export const DropdownItemGroup: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SectionProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, SectionProps>(
	(
		{
			children,
			id,
			isList,
			isScrollable,
			title,
			testId,
			hasSeparator,
			titleId,
			label,
			...rest
		}: SectionProps,
		ref,
	) => {
		const uid = useId();
		const oldTitleId = `dropdown-menu-item-group-title-${uid}`;
		const groupTitleId = titleId || (title ? `dropdown-menu-item-group-title-${uid}` : undefined);

		if (fg('platform-dst-new-menu')) {
			return (
				<div
					role="group"
					css={[styles.root, hasSeparator && styles.separator, isScrollable && styles.scrollable]}
					data-testid={testId}
					aria-label={label}
					aria-labelledby={groupTitleId}
					id={id}
					ref={ref as Ref<HTMLDivElement>}
				>
					{title && <GroupTitle id={groupTitleId} title={title} />}
					{children}
				</div>
			);
		}

		return (
			<Section
				id={id}
				ref={ref}
				isList={isList}
				isScrollable={isScrollable}
				hasSeparator={hasSeparator}
				testId={testId}
				titleId={title ? oldTitleId : titleId}
				label={label}
				{...rest}
			>
				{title && <GroupTitle id={oldTitleId} title={title} />}
				{children}
			</Section>
		);
	},
);
