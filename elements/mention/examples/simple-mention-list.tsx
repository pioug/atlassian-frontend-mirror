import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { mentionsWithLocalResource, onSelection } from '../example-helpers';
import MentionList from '../src/components/MentionList';

const Example = (): React.JSX.Element => {
	return (
		<IntlProvider locale="en">
			<div data-testid="vr-tested">
				<MentionList mentions={mentionsWithLocalResource} onSelection={onSelection} />
			</div>
		</IntlProvider>
	);
};

export default Example;
