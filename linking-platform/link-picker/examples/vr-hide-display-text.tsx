import React from 'react';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

export default function VrHideDisplayText(): React.JSX.Element {
	return (
		<PageWrapper>
			<LinkPicker onSubmit={() => {}} onCancel={() => {}} hideDisplayText={true} />
		</PageWrapper>
	);
}
