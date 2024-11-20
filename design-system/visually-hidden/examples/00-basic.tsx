import React from 'react';

import VisuallyHidden from '@atlaskit/visually-hidden';

export default () => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div data-testid="visually-hidden" style={{ border: '1px solid black' }}>
			There is text hidden between the brackets [<VisuallyHidden>Can't see me!</VisuallyHidden>]
		</div>
	);
};
