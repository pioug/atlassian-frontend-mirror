import React from 'react';

import FlaskIcon from '@atlaskit/icon/core/flask';
import { Text } from '@atlaskit/primitives/compiled';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

const Example = (): React.JSX.Element => (
	<SectionMessage
		title="The Modern Prometheus"
		actions={[
			<SectionMessageAction href="https://en.wikipedia.org/wiki/Mary_Shelley">
				Mary
			</SectionMessageAction>,
			<SectionMessageAction href="https://en.wikipedia.org/wiki/Villa_Diodati">
				Villa Diodatti
			</SectionMessageAction>,
		]}
		icon={FlaskIcon}
	>
		<Text as="p">
			You will rejoice to hear that no disaster has accompanied the commencement of an enterprise
			which you have regarded with such evil forebodings. I arrived here yesterday, and my first
			task is to assure my dear sister of my welfare and increasing confidence in the success of my
			undertaking.
		</Text>
	</SectionMessage>
);

export default Example;
