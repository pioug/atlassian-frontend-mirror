import React from 'react';

import { type AppearanceType, type SizeType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import Modal, { ModalBody } from '@atlaskit/modal-dialog';

import { RANDOM_USERS } from '../examples-util/data';
import ExampleImage from '../examples-util/nucleus.png';

export default () => {
	const data = RANDOM_USERS.slice(0, 8).map((d) => ({
		key: d.email,
		name: d.name,
		href: '#',
		appearance: 'circle' as AppearanceType,
		size: 'medium' as SizeType,
		src: ExampleImage,
	}));

	return (
		<div>
			<Modal>
				<ModalBody>
					<AvatarGroup testId="within-modal" appearance="stack" data={data} size="large" />
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
					sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum.
				</ModalBody>
			</Modal>
		</div>
	);
};
