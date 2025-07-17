import React from 'react';

import Navigation from '@atlaskit/navigation';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';

import MobileHeader from '../src';

const Example = (): React.ReactElement => {
	return (
		<div>
			<MobileHeader
				menuIconLabel="Menu"
				navigation={(isOpen) => isOpen && <Navigation onResize={() => {}} />}
				pageHeading="Header for a page with content"
			/>
			<Box padding="space.200">
				<h2>Lorem Ipsum</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
				<p>
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
					deserunt mollit anim id est laborum.
				</p>
				<h3>More Content</h3>
				<p>
					Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
					laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
					architecto beatae vitae dicta sunt explicabo.
				</p>
				<p>
					Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
					consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
					est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
				</p>
			</Box>
		</div>
	);
};

export default Example;
