import React from 'react';

import { Container } from '../examples-utils/styled';
import { JQLEditorReadOnly } from '../src';

export default (): React.JSX.Element => {
	return (
		<Container>
			<JQLEditorReadOnly query={'issuetype = bug order by rank'} />
		</Container>
	);
};
