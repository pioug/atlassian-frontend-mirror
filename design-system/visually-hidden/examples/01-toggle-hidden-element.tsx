import React, { Fragment } from 'react';

import VisuallyHidden from '@atlaskit/visually-hidden';

import ToggleVisuallyHidden from './constellation/utils/toggle-visually-hidden';

const VisuallyHiddenDefaultExample = (): React.JSX.Element => {
	const hiddenContent = 'Hidden text';

	return (
		<ToggleVisuallyHidden id="default-example">
			{(isVisible) => (
				<Fragment>
					There is text hidden between these brackets: [
					{isVisible ? (
						<span>{hiddenContent}</span>
					) : (
						<VisuallyHidden>{hiddenContent}</VisuallyHidden>
					)}
					]
				</Fragment>
			)}
		</ToggleVisuallyHidden>
	);
};

export default VisuallyHiddenDefaultExample;
