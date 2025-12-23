import React from 'react';

import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl-next';

import { type EmbedModalProps } from './types';

const IFRAME_NAME = 'twp-editor-preview-iframe';
const POPUP_MOUNT_POINT_ID = 'twp-editor-preview-iframe';

/*
  Explanatory note:
  Actions don't have access to the react tree of whatever is rendered them
  (and this concept is fraught inside editor anyway) so we want to ensure
  it is mounting to a new unique place. This function manages that, including
  creating an element if it doesn't exist, as well as tidying up the react tree
  (but not the element) upon closing the modal.

  This may strike you as really uncomfortable as you read it, so I wanted to note
  that a) this was discussed and agreed upon, and b) it's definitely odd, and if
  you find an elegant solution around this, you should definitely feel free to
  refactor it.
*/
export async function openEmbedModal({
	onClose = () => {},
	...props
}: Partial<EmbedModalProps> = {}): Promise<void> {
	let popupMountPoint: HTMLElement | null;

	popupMountPoint = document.getElementById(POPUP_MOUNT_POINT_ID);
	if (!popupMountPoint) {
		popupMountPoint = document.createElement('div');
		popupMountPoint.id = POPUP_MOUNT_POINT_ID;
		popupMountPoint.setAttribute('data-testid', 'preview-modal');
		document.body.appendChild(popupMountPoint);
	}

	let Modal = await import('./index');

	ReactDOM.render(
		<IntlProvider locale="en">
			<Modal.default
				{...props}
				iframeName={IFRAME_NAME}
				onClose={(_context) => {
					if (popupMountPoint) {
						ReactDOM.unmountComponentAtNode(popupMountPoint);
					}
					if (onClose) {
						onClose(_context);
					}
				}}
				showModal={true}
			/>
		</IntlProvider>,
		popupMountPoint,
	);
}
