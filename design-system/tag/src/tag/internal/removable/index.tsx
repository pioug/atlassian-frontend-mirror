/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, useCallback } from 'react';

import { jsx } from '@compiled/react';

import { useCallbackWithAnalytics } from '@atlaskit/analytics-next/useCallbackWithAnalytics';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import noop from '@atlaskit/ds-lib/noop';

import { colorMapping } from '../../../tag-new/color-mapping';
import { getTagText } from '../../../tag-new/get-tag-text';
import { markAsTagMotionCapable } from '../../../tag-new/tag-motion-capability';
import { default as TagNew } from '../../../tag-new/tag-new';
import { type SimpleTagProps } from '../shared/types';

export interface RemovableTagProps extends SimpleTagProps, WithAnalyticsEventsProps {
	/**
	 * When false, removes the tag's default margin. Use when parent controls spacing (e.g. Select). Defaults to `true`.
	 */
	hasMargin?: boolean;
	/**
	 * Text rendered as the aria-label for remove button.
	 */
	removeButtonLabel?: string;
	/**
	 * Flag to indicate if a tag is removable.
	 */
	isRemovable?: boolean;
	/**
	 * Handler to be called before the tag is removed. If it does not return a
	 * truthy value, the tag will not be removed.
	 */
	onBeforeRemoveAction?: () => boolean;
	/**
	 * Handler to be called after tag is removed. Called with the string 'Post
	 * Removal Hook'.
	 */
	onAfterRemoveAction?: (text: string) => void;
}

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const defaultBeforeRemoveAction = () => true;

const RemovableTagComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<RemovableTagProps> & React.RefAttributes<any>
> = forwardRef<any, RemovableTagProps>(
	(
		{
			elemBefore = null,
			isRemovable = true,
			text = '',
			color = 'standard',
			href,
			linkComponent,
			removeButtonLabel,
			testId,
			onBeforeRemoveAction = defaultBeforeRemoveAction,
			onAfterRemoveAction = noop,
			maxWidth,
			hasMargin = true,
			swatchBefore,
			swatchBeforeLabel,
			swatchBeforeRole,
		},
		ref,
	) => {
		const normalizedText = getTagText(text);

		// Wrap the analytics dispatcher so it fires synchronously when removal is
		// confirmed (matching the pre-flag-removal behaviour where analytics fired
		// immediately on button click, not after the CSS exit animation).
		const fireRemovedAnalytics = useCallbackWithAnalytics(
			noop,
			{
				action: 'removed',
				actionSubject: 'tag',
				attributes: {
					componentName: 'tag',
					packageName,
					packageVersion,
				},
			},
			'atlaskit',
		);

		// Intercept onBeforeRemoveAction: fire analytics and call onAfterRemoveAction
		// synchronously when removal is approved. This matches the pre-feature-flag
		// behaviour where both fired immediately on button click, not after the CSS
		// exit animation completes (which never fires in jsdom test environments).
		const onBeforeRemoveActionWithAnalytics = useCallback(() => {
			const shouldRemove = onBeforeRemoveAction();
			if (shouldRemove) {
				fireRemovedAnalytics(normalizedText);
				onAfterRemoveAction(normalizedText);
			}
			return shouldRemove;
		}, [onBeforeRemoveAction, fireRemovedAnalytics, normalizedText, onAfterRemoveAction]);

		// TagNew handles its own animation internally via RemovableWrapper
		const newColor = colorMapping[color || 'standard'];

		return (
			<TagNew
				ref={ref}
				color={newColor}
				text={normalizedText}
				elemBefore={elemBefore}
				href={href}
				linkComponent={linkComponent}
				testId={testId}
				isRemovable={isRemovable}
				removeButtonLabel={removeButtonLabel}
				onBeforeRemoveAction={onBeforeRemoveActionWithAnalytics}
				maxWidth={maxWidth}
				hasMargin={hasMargin}
				swatchBefore={swatchBefore}
				swatchBeforeLabel={swatchBeforeLabel}
				swatchBeforeRole={swatchBeforeRole}
			/>
		);
	},
);

/**
 * __Removable tag__
 *
 * A tag labels UI objects for quick recognition and navigation.
 *
 * Once a tag has been removed, it cannot be re-rendered. Removable tags are visible in "edit" mode or in multi-select controls.
 *
 */
const RemovableTag: import('react').MemoExoticComponent<
	import('react').ForwardRefExoticComponent<
		Omit<RemovableTagProps, 'ref'> & import('react').RefAttributes<any>
	>
> = markAsTagMotionCapable(memo(RemovableTagComponent));

export default RemovableTag;
