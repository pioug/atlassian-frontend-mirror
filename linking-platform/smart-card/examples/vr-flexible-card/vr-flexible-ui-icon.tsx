import React from 'react';

import { IconType, SmartLinkSize } from '../../src/constants';
import AtlaskitIcon from '../../src/view/FlexibleCard/components/common/atlaskit-icon';
import VRTestWrapper from '../utils/vr-test-wrapper';

function generateExample(iconType: IconType) {
	return (): React.JSX.Element => (
		<VRTestWrapper>
			<AtlaskitIcon icon={iconType} size={SmartLinkSize.Large} />
		</VRTestWrapper>
	);
}

export const IconTypeAttachment = generateExample(IconType.Attachment);
export const IconTypeCheckItem = generateExample(IconType.CheckItem);
export const IconTypeComment = generateExample(IconType.Comment);
export const IconTypeView = generateExample(IconType.View);
export const IconTypeReact = generateExample(IconType.React);
export const IconTypeVote = generateExample(IconType.Vote);
export const IconTypePriorityBlocker = generateExample(IconType.PriorityBlocker);
export const IconTypePriorityCritical = generateExample(IconType.PriorityCritical);
export const IconTypePriorityHigh = generateExample(IconType.PriorityHigh);
export const IconTypePriorityHighest = generateExample(IconType.PriorityHighest);
export const IconTypePriorityLow = generateExample(IconType.PriorityLow);
export const IconTypePriorityLowest = generateExample(IconType.PriorityLowest);
export const IconTypePriorityMajor = generateExample(IconType.PriorityMajor);
export const IconTypePriorityMedium = generateExample(IconType.PriorityMedium);
export const IconTypePriorityMinor = generateExample(IconType.PriorityMinor);
export const IconTypePriorityTrivial = generateExample(IconType.PriorityTrivial);
export const IconTypePriorityUndefined = generateExample(IconType.PriorityUndefined);
export const IconTypeProgrammingLanguage = generateExample(IconType.ProgrammingLanguage);
export const IconTypeSubscriber = generateExample(IconType.Subscriber);
export const IconTypeSubTasksProgress = generateExample(IconType.SubTasksProgress);
