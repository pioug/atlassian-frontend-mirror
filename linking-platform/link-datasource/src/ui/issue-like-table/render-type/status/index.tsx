import React from 'react';

import { type Status } from '@atlaskit/linking-types';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';

interface StatusProps extends Status {
	testId?: string;
}
export const STATUS_TYPE_TEST_ID = 'link-datasource-render-type--status';

const StatusRenderType = ({ text, style, testId = STATUS_TYPE_TEST_ID }: StatusProps) => {
	if (!(text && typeof text === 'string')) {
		return <></>;
	}

	return (
		<Lozenge
			appearance={style?.appearance}
			isBold={fg('platform-component-visual-refresh') ? style?.isBold !== false : style?.isBold}
			testId={testId}
		>
			{text}
		</Lozenge>
	);
};

export default StatusRenderType;
