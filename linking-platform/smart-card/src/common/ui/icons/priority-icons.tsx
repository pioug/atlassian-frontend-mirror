import React, { type ComponentType } from 'react';

import PriorityBlocker from '@atlaskit/icon/core/priority-blocker';
import PriorityCritical from '@atlaskit/icon/core/priority-critical';
import PriorityHigh from '@atlaskit/icon/core/priority-high';
import PriorityHighest from '@atlaskit/icon/core/priority-highest';
import PriorityLow from '@atlaskit/icon/core/priority-low';
import PriorityLowest from '@atlaskit/icon/core/priority-lowest';
import PriorityMajor from '@atlaskit/icon/core/priority-major';
import PriorityMedium from '@atlaskit/icon/core/priority-medium';
import PriorityMinor from '@atlaskit/icon/core/priority-minor';
import PriorityTrivial from '@atlaskit/icon/core/priority-trivial';
import type { NewCoreIconProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

type PriorityIcon = ComponentType<NewCoreIconProps>;

const priorityRed = token('color.icon.accent.red') as NewCoreIconProps['color'];
const priorityBlue = token('color.icon.accent.blue') as NewCoreIconProps['color'];
const priorityOrange = token('color.icon.accent.orange') as NewCoreIconProps['color'];
const priorityGray = token('color.icon.accent.gray') as NewCoreIconProps['color'];

const withPriorityColor = (Icon: PriorityIcon, color: NewCoreIconProps['color']): PriorityIcon => {
	return (props) => <Icon {...props} color={color} />;
};

export const PriorityBlockerIcon: PriorityIcon = withPriorityColor(PriorityBlocker, priorityRed);
export const PriorityCriticalIcon: PriorityIcon = withPriorityColor(PriorityCritical, priorityRed);
export const PriorityHighIcon: PriorityIcon = withPriorityColor(PriorityHigh, priorityRed);
export const PriorityHighestIcon: PriorityIcon = withPriorityColor(PriorityHighest, priorityRed);
export const PriorityLowIcon: PriorityIcon = withPriorityColor(PriorityLow, priorityBlue);
export const PriorityLowestIcon: PriorityIcon = withPriorityColor(PriorityLowest, priorityBlue);
export const PriorityMajorIcon: PriorityIcon = withPriorityColor(PriorityMajor, priorityRed);
export const PriorityMediumIcon: PriorityIcon = withPriorityColor(PriorityMedium, priorityOrange);
export const PriorityMinorIcon: PriorityIcon = withPriorityColor(PriorityMinor, priorityBlue);
export const PriorityTrivialIcon: PriorityIcon = withPriorityColor(PriorityTrivial, priorityGray);
