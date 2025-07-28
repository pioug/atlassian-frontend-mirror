/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo } from 'react';

import { jsx } from '@compiled/react';

import BaseTag from '../shared/base';
import Before from '../shared/before';
import Content from '../shared/content';
import { type SimpleTagProps } from '../shared/types';

const SimpleTagComponent = forwardRef(
	(
		{
			appearance,
			elemBefore = null,
			color = 'standard',
			href,
			testId,
			text = '',
			linkComponent,
		}: SimpleTagProps,
		ref: React.Ref<any>,
	) => {
		const content = (
			<Content
				elemBefore={elemBefore}
				isRemovable={false}
				text={text}
				color={color}
				href={href}
				linkComponent={linkComponent}
				testId={testId}
			/>
		);

		return (
			<BaseTag
				ref={ref}
				testId={testId}
				href={href}
				appearance={appearance}
				color={color}
				before={<Before elemBefore={elemBefore} />}
				contentElement={content}
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
 */
const SimpleTag = memo(SimpleTagComponent);

export default SimpleTag;
