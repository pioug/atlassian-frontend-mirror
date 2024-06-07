import React from 'react';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

export default function VrHideDisplayText() {
	return (
		<PageWrapper>
			<LinkPicker onSubmit={() => {}} onCancel={() => {}} hideDisplayText={true} />
		</PageWrapper>
	);
}
