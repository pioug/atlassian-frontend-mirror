import React from 'react';

import { RovoIcon as RovoLogoIcon } from '@atlaskit/logo';

type AIChatIconProps = {
	label: string;
	testId?: string;
};

export const AIChatIcon = ({ label, testId }: AIChatIconProps) => (
	<RovoLogoIcon label={label} testId={testId} size="small" appearance="neutral" />
);
