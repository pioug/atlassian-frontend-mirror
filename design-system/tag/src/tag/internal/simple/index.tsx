/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo } from 'react';

import { jsx } from '@compiled/react';

import { colorMapping } from '../../../tag-new/color-mapping';
import { markAsTagMotionCapable } from '../../../tag-new/tag-motion-capability';
import { default as TagNew } from '../../../tag-new/tag-new';
import { type SimpleTagProps } from '../shared/types';

const SimpleTagComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SimpleTagProps> & React.RefAttributes<any>
> = forwardRef(
	(
		{
			elemBefore = null,
			color = 'standard',
			href,
			linkComponent,
			testId,
			text = '',
			maxWidth,
			swatchBefore,
			swatchBeforeLabel,
			swatchBeforeRole,
		}: SimpleTagProps,
		ref: React.Ref<any>,
	) => {
		const newColor = colorMapping[color || 'standard'];

		return (
			<TagNew
				ref={ref}
				color={newColor}
				text={text}
				elemBefore={elemBefore}
				href={href}
				linkComponent={linkComponent}
				testId={testId}
				isRemovable={false}
				maxWidth={maxWidth}
				swatchBefore={swatchBefore}
				swatchBeforeLabel={swatchBeforeLabel}
				swatchBeforeRole={swatchBeforeRole}
			/>
		);
	},
);

/**
 * __Simple tag__
 *
 * A tag labels UI objects for quick recognition and navigation.
 *
 * `SimpleTag` is the default form of a tag, where text is required. Tags with static text can be used as a flag or as a reference to an object or attribute.
 *
 * - [Examples](https://atlassian.design/components/tag/examples)
 * - [Code](https://atlassian.design/components/tag/code)
 * - [Usage](https://atlassian.design/components/tag/usage)
 *
 * @deprecated `SimpleTag` is deprecated. Use the default `Tag` export from
 * `@atlaskit/tag` with `isRemovable={false}` instead, e.g. `<Tag text="…" isRemovable={false} />`.
 */
const SimpleTag: import('react').MemoExoticComponent<
	import('react').ForwardRefExoticComponent<SimpleTagProps & import('react').RefAttributes<any>>
> = markAsTagMotionCapable(memo(SimpleTagComponent));

export default SimpleTag;
