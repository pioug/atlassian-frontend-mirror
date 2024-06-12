import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';

import VisuallyHidden from '../../src';

import ToggleVisuallyHidden from './utils/toggle-visually-hidden';

const VisuallyHiddenButtonsExample = () => {
	return (
		<ToggleVisuallyHidden id="buttons-example">
			{(isVisible) => (
				<ButtonGroup label="Buttons with hidden content">
					<Button>
						Read more
						{isVisible ? ' about horses' : <VisuallyHidden> about horses</VisuallyHidden>}
					</Button>
					<Button>
						Read more
						{isVisible ? ' about dogs' : <VisuallyHidden> about dogs</VisuallyHidden>}
					</Button>
					<Button>
						Read more
						{isVisible ? ' about cats' : <VisuallyHidden> about cats</VisuallyHidden>}
					</Button>
				</ButtonGroup>
			)}
		</ToggleVisuallyHidden>
	);
};

export default VisuallyHiddenButtonsExample;
