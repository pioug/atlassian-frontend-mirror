import React from 'react';

import DropboxModal from '../src/modal';

/** Open Dropbox modal for ModalTitle VR. */
export default function DropboxModalOpen(): React.JSX.Element {
	return <DropboxModal onClose={() => {}} showModal TEST_ONLY_src="about:blank" />;
}
