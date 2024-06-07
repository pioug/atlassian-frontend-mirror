import React from 'react';

import { type Status } from '@atlaskit/linking-types';
import Lozenge from '@atlaskit/lozenge';

interface StatusProps extends Status {
	testId?: string;
}
export const STATUS_TYPE_TEST_ID = 'link-datasource-render-type--status';

const StatusRenderType = ({ text, style, testId = STATUS_TYPE_TEST_ID }: StatusProps) => {
	if (!(text && typeof text === 'string')) {
		return <></>;
	}

	return (
		<Lozenge appearance={style?.appearance} isBold={style?.isBold} testId={testId}>
			{text}
		</Lozenge>
	);
};

export default StatusRenderType;
