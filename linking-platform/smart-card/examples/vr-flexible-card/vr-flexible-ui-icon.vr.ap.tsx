import React from 'react';

import { IconType, SmartLinkSize } from '../../src/constants';
import AtlaskitIcon from '../../src/view/FlexibleCard/components/common/atlaskit-icon';
import VRTestWrapper from '../utils/vr-test-wrapper';

import '../utils/vr-preload-metadata-icons';

function generateExample(iconType: IconType) {
	return (): React.JSX.Element => (
		<VRTestWrapper>
			<AtlaskitIcon icon={iconType} size={SmartLinkSize.Large} />
		</VRTestWrapper>
	);
}

export const IconTypeAttachment: () => React.JSX.Element = generateExample(IconType.Attachment);
export const IconTypeCheckItem: () => React.JSX.Element = generateExample(IconType.CheckItem);
export const IconTypeComment: () => React.JSX.Element = generateExample(IconType.Comment);
export const IconTypeView: () => React.JSX.Element = generateExample(IconType.View);
export const IconTypeReact: () => React.JSX.Element = generateExample(IconType.React);
export const IconTypeVote: () => React.JSX.Element = generateExample(IconType.Vote);
export const IconTypePriorityBlocker: () => React.JSX.Element = generateExample(
	IconType.PriorityBlocker,
);
export const IconTypePriorityCritical: () => React.JSX.Element = generateExample(
	IconType.PriorityCritical,
);
export const IconTypePriorityHigh: () => React.JSX.Element = generateExample(IconType.PriorityHigh);
export const IconTypePriorityHighest: () => React.JSX.Element = generateExample(
	IconType.PriorityHighest,
);
export const IconTypePriorityLow: () => React.JSX.Element = generateExample(IconType.PriorityLow);
export const IconTypePriorityLowest: () => React.JSX.Element = generateExample(
	IconType.PriorityLowest,
);
export const IconTypePriorityMajor: () => React.JSX.Element = generateExample(
	IconType.PriorityMajor,
);
export const IconTypePriorityMedium: () => React.JSX.Element = generateExample(
	IconType.PriorityMedium,
);
export const IconTypePriorityMinor: () => React.JSX.Element = generateExample(
	IconType.PriorityMinor,
);
export const IconTypePriorityTrivial: () => React.JSX.Element = generateExample(
	IconType.PriorityTrivial,
);
export const IconTypePriorityUndefined: () => React.JSX.Element = generateExample(
	IconType.PriorityUndefined,
);
export const IconTypeProgrammingLanguage: () => React.JSX.Element = generateExample(
	IconType.ProgrammingLanguage,
);
export const IconTypeSubscriber: () => React.JSX.Element = generateExample(IconType.Subscriber);
export const IconTypeSubTasksProgress: () => React.JSX.Element = generateExample(
	IconType.SubTasksProgress,
);
