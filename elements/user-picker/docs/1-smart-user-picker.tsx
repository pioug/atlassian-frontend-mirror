import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import React from 'react';
import { md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

const LinkComponent = (props: any) =>
	// eslint-disable-next-line @atlaskit/design-system/no-html-anchor, jsx-a11y/anchor-has-content
	fg('dst-a11y__replace-anchor-with-link__search-platfor') ? <Link {...props} /> : <a {...props} />;

export default md`
  ${(
		<SectionMessage
			appearance="warning"
			title="Note: @atlaskit/user-picker/smart-user-picker is deprecated."
		>
			SmartUserPicker has moved packages! Please use{' '}
			<LinkComponent href="https://statlas.prod.atl-paas.net/atlassian-frontend/master#packages/smart-experiences/smart-user-picker">
				@atlaskit/smart-user-picker
			</LinkComponent>{' '}
			instead. Alternatively, @atlaskit/smart-hooks will be ready by end of FY22Q4. Contact
			#search-plex for further details.
		</SectionMessage>
	)}
`;
