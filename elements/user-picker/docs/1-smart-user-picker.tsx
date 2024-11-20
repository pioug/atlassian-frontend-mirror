import React from 'react';
import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
		<SectionMessage
			appearance="warning"
			title="Note: @atlaskit/user-picker/smart-user-picker is deprecated."
		>
			SmartUserPicker has moved packages! Please use{' '}
			<a href="https://statlas.prod.atl-paas.net/atlassian-frontend/master#packages/smart-experiences/smart-user-picker">
				@atlaskit/smart-user-picker
			</a>{' '}
			instead. Alternatively, @atlaskit/smart-hooks will be ready by end of FY22Q4. Contact
			#search-plex for further details.
		</SectionMessage>
	)}
`;
