import { type PropsWithChildren } from 'react';
import { type SmartLinkStatus } from '../../../../constants';
import { type FlexibleCardProps, type FlexibleUiOptions, type RetryOptions } from '../../types';

export type ContainerProps = PropsWithChildren<
	Pick<FlexibleCardProps, 'onClick' | 'showHoverPreview' | 'actionOptions' | 'showAuthTooltip'> &
		FlexibleUiOptions & {
			/**
			 * The options that determine the retry behaviour when a Smart Link errors.
			 */
			retry?: RetryOptions;

			/**
			 * The status of the Smart Link. Used to conditionally render different blocks
			 * when Smart Link is in different states.
			 */
			status?: SmartLinkStatus;

			/**
			 * A `testId` prop is provided for specified elements, which is a unique
			 * string that appears as a data attribute `data-testid` in the rendered code,
			 * serving as a hook for automated tests
			 */
			testId?: string;
		}
>;

export type ChildrenOptions = {
	previewOnLeft?: boolean;
	previewOnRight?: boolean;
};
