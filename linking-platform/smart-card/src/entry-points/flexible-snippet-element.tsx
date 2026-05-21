/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import type { Prettify } from '@atlaskit/linking-common';

import Snippet from '../view/FlexibleCard/components/elements/snippet-element';

type SnippetElementProps = Prettify<
	Pick<React.ComponentProps<typeof Snippet>, 'maxLines'> & {
		text?: React.ComponentProps<typeof Snippet>['content'];
	}
>;

export const SnippetElement = (props?: SnippetElementProps): React.JSX.Element => (
	<Snippet maxLines={props?.maxLines} content={props?.text} />
);
