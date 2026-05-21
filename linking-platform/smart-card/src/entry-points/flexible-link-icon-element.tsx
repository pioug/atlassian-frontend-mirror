/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import type { Prettify } from '@atlaskit/linking-common';

import { SmartLinkSize } from '../constants';
import LinkIcon from '../view/FlexibleCard/components/elements/link-icon-element';

type LinkIconElementProps = Prettify<
	Pick<React.ComponentProps<typeof LinkIcon>, 'render'> & {
		iconTileSize?: 16 | 24;
	}
>;

export const LinkIconElement = (props?: LinkIconElementProps): React.JSX.Element => {
	return (
		<LinkIcon
			size={props?.iconTileSize === 24 ? SmartLinkSize.Large : SmartLinkSize.Medium}
			render={props?.render}
		/>
	);
};
