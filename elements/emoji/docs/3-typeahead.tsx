import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import TypeAheadiExample from '../examples/03-standard-emoji-typeahead';

const TypeAheadSource = require('!!raw-loader!../examples/03-standard-emoji-typeahead');
const TypeAheadProps = require('!!extract-react-types-loader!../src/components/typeahead/EmojiTypeAheadComponent');

const _default_1: any = md`

  ${(
		<Example
			packageName="@atlaskit/emoji"
			Component={TypeAheadiExample}
			title="Typeahead"
			source={TypeAheadSource}
		/>
	)}

  ${(<Props props={TypeAheadProps} />)}
`;
export default _default_1;
