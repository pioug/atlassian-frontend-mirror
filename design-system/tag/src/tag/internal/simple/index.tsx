/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo } from 'react';

import { jsx } from '@compiled/react';

import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

import TagNew, { colorMapping } from '../../../tag-new';
import BaseTag from '../shared/base';
import Before from '../shared/before';
import { getLozengeAppearance } from '../shared/color-to-lozenge-appearance';
import Content from '../shared/content';
import { type SimpleTagProps } from '../shared/types';

const SimpleTagComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SimpleTagProps> & React.RefAttributes<any>
> = forwardRef(
	(
		{
			appearance,
			elemBefore = null,
			color = 'standard',
			href,
			testId,
			text = '',
			linkComponent,
			migration_fallback,
			maxWidth,
			...rest
		}: SimpleTagProps,
		ref: React.Ref<any>,
	) => {
		// Handle migration_fallback: render Lozenge when flag is off and migration_fallback is 'lozenge'
		if (migration_fallback === 'lozenge' && !fg('platform-dst-lozenge-tag-badge-visual-uplifts')) {
			const lozengeAppearance = getLozengeAppearance(color);
			return (
				<Lozenge appearance={lozengeAppearance} isBold={false} testId={testId} {...rest}>
					{text}
				</Lozenge>
			);
		}

		// Use new TagNew component behind feature flag
		if (fg('platform-dst-lozenge-tag-badge-visual-uplifts')) {
			const newColor = colorMapping[color || 'standard'];

			return (
				<TagNew
					ref={ref}
					color={newColor}
					text={text}
					elemBefore={elemBefore}
					href={href}
					testId={testId}
					isRemovable={false}
					maxWidth={maxWidth}
				/>
			);
		}

		// Original implementation
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
const SimpleTag: import("react").MemoExoticComponent<import("react").ForwardRefExoticComponent<SimpleTagProps & import("react").RefAttributes<any>>> = memo(SimpleTagComponent);

export default SimpleTag;
