import React from 'react';

import ReactDOM from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { IntlProvider } from 'react-intl';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type EmbedModalProps } from './types';

let reactRoots = new WeakMap<Element, Root>();

/** Mounts `element` into `mountPoint`: uses the React 18/19 `createRoot` API when `nike_r19_render_unmount` is on, else the legacy render path. */
const renderToMountPoint = (element: React.ReactElement, mountPoint: Element) => {
	if (fg('nike_r19_render_unmount')) {
		let root = reactRoots.get(mountPoint);

		if (!root) {
			root = createRoot(mountPoint);
			reactRoots.set(mountPoint, root);
		}

		root.render(element);
	} else {
		ReactDOM.render(element, mountPoint);
	}
};

/** Unmounts the tree at `mountPoint`: uses `root.unmount()` when `nike_r19_render_unmount` is on, else the legacy unmount path. */
const unmountFromMountPoint = (mountPoint: Element) => {
	if (fg('nike_r19_render_unmount')) {
		const root = reactRoots.get(mountPoint);

		if (root) {
			root.unmount();
			reactRoots.delete(mountPoint);
		}
	} else {
		ReactDOM.unmountComponentAtNode(mountPoint);
	}
};

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

	renderToMountPoint(
		<IntlProvider locale="en">
			<Modal.default
				{...props}
				iframeName={IFRAME_NAME}
				onClose={(_context) => {
					if (popupMountPoint) {
						unmountFromMountPoint(popupMountPoint);
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
