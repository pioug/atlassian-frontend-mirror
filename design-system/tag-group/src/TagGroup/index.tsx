/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

type Alignment = 'start' | 'end';

export interface TagGroupProps {
	/**
	 * Sets whether the tags should be aligned to the start or the end of the component.
	 */
	alignment?: Alignment;
	/**
	 * Tags to render within the tag group.
	 */
	children: ReactNode;
	/**
	 * Refers to an `aria-label` attribute. Sets an accessible name for the tags group wrapper to announce it to users of assistive technology.
	 * Usage of either this, or the `titleId` attribute is strongly recommended.
	 */
	label?: string;
	/**
	 * ID referenced by the tag group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group-button title element.
	 * Usage of either this, or the `label` attribute is strongly recommended.
	 */
	titleId?: string;
}

const baseStyles = css({
	display: 'flex',
	width: '100%',
	flexWrap: 'wrap',
});

const justifyStartStyles = css({ justifyContent: 'flex-start' });
const justifyEndStyles = css({ justifyContent: 'flex-end' });

/**
 * __Tag group__
 *
 * A tag group controls the layout and alignment for a collection of tags.
 *
 * - [Examples](https://atlassian.design/components/tag-group/examples)
 * - [Code](https://atlassian.design/components/tag-group/code)
 * - [Usage](https://atlassian.design/components/tag-group/usage)
 */
const TagGroup = forwardRef<any, TagGroupProps>(
	({ alignment = 'start', titleId, label, children }, ref) => {
		return (
			<div
				role="group"
				ref={ref}
				aria-label={label}
				aria-labelledby={titleId}
				css={[
					baseStyles,
					alignment === 'start' && justifyStartStyles,
					alignment === 'end' && justifyEndStyles,
				]}
			>
				{children}
			</div>
		);
	},
);

export default TagGroup;
