import React, { useState } from 'react';

import type { Avatar } from '@atlaskit/media-avatar-picker/avatar-list';
import AvatarPickerDialog from '@atlaskit/media-avatar-picker/avatar-picker-dialog-loader';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';

const sampleAvatar: Avatar = {
	name: 'Blue profile avatar',
	dataURI:
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p0cAAAAASUVORK5CYII=',
};

export default function AvatarPickerExample(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [selection, setSelection] = useState('No avatar selected.');

	return (
		<section>
			<h2>Profile avatar</h2>
			<p aria-live="polite">{selection}</p>
			<button type="button" onClick={() => setIsOpen(true)}>
				Choose an avatar
			</button>
			<ModalTransition>
				{isOpen && (
					<AvatarPickerDialog
						avatars={[sampleAvatar]}
						onAvatarPicked={(avatar) => {
							setSelection(`Selected ${avatar.name ?? 'a predefined avatar'}.`);
							setIsOpen(false);
						}}
						onImagePicked={(_file, crop) => {
							setSelection(`Cropped image selected at ${crop.x}, ${crop.y}, size ${crop.size}.`);
							setIsOpen(false);
						}}
						onCancel={() => setIsOpen(false)}
					/>
				)}
			</ModalTransition>
			<p>Connect the selection callbacks to the host application’s image storage flow.</p>
		</section>
	);
}
