/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type Ref, useContext } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { useId } from '@atlaskit/ds-lib/use-id';
import Section from '@atlaskit/menu/section';
import type { SectionProps } from '@atlaskit/menu/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import GroupTitle from './internal/components/group-title';
import { NewSpacingContext } from './internal/context/spacing-context';

const styles = cssMap({
	root: {
		display: 'flex',
		position: 'static',
		flexDirection: 'column',
		overflow: 'auto',
		rowGap: token('space.025'),
		paddingInline: token('space.150'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		flexShrink: 0,
	},
	compact: {
		paddingInline: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
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
		const spacing = useContext(NewSpacingContext);
		const isCompact = spacing === 'compact';
		const uid = useId();
		const oldTitleId = `dropdown-menu-item-group-title-${uid}`;
		const groupTitleId = titleId || (title ? `dropdown-menu-item-group-title-${uid}` : undefined);

		if (fg('platform-dst-new-menu')) {
			return (
				<div
					role="group"
					css={[
						styles.root,
						isCompact && styles.compact,
						hasSeparator && styles.separator,
						isScrollable && styles.scrollable,
					]}
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

export default DropdownItemGroup;
