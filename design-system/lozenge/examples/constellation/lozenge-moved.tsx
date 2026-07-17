import React from 'react';

import Lozenge from '@atlaskit/lozenge';

const _default: () => React.JSX.Element = () => (
	<>
		<div>
			<Lozenge appearance="warning">Moved</Lozenge>
		</div>
		<div>
			<Lozenge appearance="warning" isBold>
				Moved bold
			</Lozenge>
		</div>
	</>
);
export default _default;
