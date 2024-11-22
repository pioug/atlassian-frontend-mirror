import React from 'react';

import { RemovableTag as Tag } from '@atlaskit/tag';

const cupcakeipsum = 'Croissant topping tiramisu gummi bears. Bonbon chocolate bar danish soufflé';

export default () => (
	<Tag
		text={cupcakeipsum}
		removeButtonLabel="No sweets for you!"
		href="http://www.cupcakeipsum.com/"
	/>
);
