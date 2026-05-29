/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import { PopoverContent as Legacy, type PopoverContentProps } from './legacy';
import { PopoverContent as TopLayer } from './top-layer';

export type { PopoverContentProps };

/**
 * __PopoverContent__
 *
 * A `PopoverContent` is the element that is shown as a popover.
 */
const renderPopoverContent = (
	Component: typeof Legacy,
	{
		children,
		placement,
		motion,
		isVisible,
		shouldDismissOnClickOutside,
		dismiss,
		back,
		testId,
		offset,
		strategy,
		...actionProps
	}: PopoverContentProps,
) => {
	if ('next' in actionProps && actionProps.next) {
		return (
			<Component
				placement={placement}
				motion={motion}
				isVisible={isVisible}
				shouldDismissOnClickOutside={shouldDismissOnClickOutside}
				dismiss={dismiss}
				back={back}
				testId={testId}
				offset={offset}
				strategy={strategy}
				next={actionProps.next}
			>
				{children}
			</Component>
		);
	}

	if ('done' in actionProps && actionProps.done) {
		return (
			<Component
				placement={placement}
				motion={motion}
				isVisible={isVisible}
				shouldDismissOnClickOutside={shouldDismissOnClickOutside}
				dismiss={dismiss}
				back={back}
				testId={testId}
				offset={offset}
				strategy={strategy}
				done={actionProps.done}
			>
				{children}
			</Component>
		);
	}

	return (
		<Component
			placement={placement}
			motion={motion}
			isVisible={isVisible}
			shouldDismissOnClickOutside={shouldDismissOnClickOutside}
			dismiss={dismiss}
			back={back}
			testId={testId}
			offset={offset}
			strategy={strategy}
		>
			{children}
		</Component>
	);
};

export const PopoverContent: typeof Legacy = (props: PopoverContentProps) =>
	fg('platform-dst-top-layer-spotlight')
		? renderPopoverContent(TopLayer, props)
		: renderPopoverContent(Legacy, props);
