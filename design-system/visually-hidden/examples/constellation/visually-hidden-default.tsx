import React, { Fragment } from 'react';

import VisuallyHidden from '@atlaskit/visually-hidden';

import ToggleVisuallyHidden from './utils/toggle-visually-hidden';

const VisuallyHiddenDefaultExample = (): React.JSX.Element => {
	const hiddenContent = "Can't see me!";

	return (
		<ToggleVisuallyHidden id="default-example">
			{(isVisible) => (
				<Fragment>
					There is text hidden between these brackets: [
					{isVisible ? hiddenContent : <VisuallyHidden>{hiddenContent}</VisuallyHidden>}]
				</Fragment>
			)}
		</ToggleVisuallyHidden>
	);
};

export default VisuallyHiddenDefaultExample;
