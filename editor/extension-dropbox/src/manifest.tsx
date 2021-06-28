import React from 'react';
import ReactDOM from 'react-dom';

import { ExtensionManifest } from '@atlaskit/editor-common';
import { inlineCard } from '@atlaskit/adf-utils';

import enableDropbox from './enable-dropbox';
import { DropboxFile } from './types';
import { POPUP_MOUNTPOINT, DROPBOX_IFRAME_NAME } from './constants';

declare global {
  interface Window {
    // This is a typed subset of the options available here https://www.dropbox.com/developers/chooser
    // covering only what we are using
    Dropbox: {
      appKey?: string;
      choose: (args: {
        iframe?: boolean;
        windowName?: string;
        success: (
          value?: DropboxFile[] | PromiseLike<DropboxFile[]> | undefined,
        ) => void;
        cancel: () => void;
      }) => void;
    };
  }
}

async function pickFromDropbox(appKey: string, canMountinIframe: boolean) {
  await enableDropbox(appKey);

  let popupMountPoint;

  // BC - as of 2020-01-21 this does not work, as no dropbox app we have is authorised
  // to iframe in the picker - we are currently waiting for permissions.
  // To test the picker, comment out the ReactDOM render call, and the `iframe` and `winowName` options
  if (canMountinIframe) {
    let Modal = await import('./modal');

    // The decision has been made to simply append our modal to the body
    // Using the passed in popupMountPoint has the potential to cause
    // problems, and several users pass down document.body anyway
    //
    // We want to append it and attach it to a new div so we have complete control.
    popupMountPoint = document.getElementById(POPUP_MOUNTPOINT);
    if (!popupMountPoint) {
      popupMountPoint = document.createElement('div');
      popupMountPoint.id = POPUP_MOUNTPOINT;
      document.body.appendChild(popupMountPoint);
    }
    ReactDOM.render(<Modal.default onClose={() => {}} />, popupMountPoint);
  }

  let files: DropboxFile[];

  try {
    files = await new Promise((resolve, reject) => {
      window.Dropbox.choose({
        iframe: canMountinIframe,
        windowName: canMountinIframe ? DROPBOX_IFRAME_NAME : undefined,
        success: resolve,
        cancel: reject,
      });
    });
  } catch (e) {
    if (popupMountPoint) {
      ReactDOM.unmountComponentAtNode(popupMountPoint);
    }
    return;
  }
  let node;

  if (!files.length) {
    if (popupMountPoint) {
      ReactDOM.unmountComponentAtNode(popupMountPoint);
    }
    return;
  }

  const newNodes = files.map((file) => inlineCard({ url: file.link }));

  if (newNodes.length === 1) {
    node = newNodes[0];
  } else {
    // NOTE: we are not currently passing in `multiselect`, so this is not a possible state,
    // but we likely want to allow multiselect in the future so doing some future-proofing
    node = {
      type: 'paragraph',
      content: newNodes,
    };
  }

  if (popupMountPoint) {
    ReactDOM.unmountComponentAtNode(popupMountPoint);
  }
  return node;
}

const manifestFunction = ({
  appKey,
  canMountinIframe,
}: {
  appKey: string;
  canMountinIframe: boolean;
}): ExtensionManifest => ({
  title: 'Dropbox',
  type: 'com.dropbox.fabric',
  key: 'dropbox',
  description: 'Embed Dropbox file to collaborate with your team',
  icons: {
    '16': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_editor-dropbox" */ './icons/DropboxIcon'
      ).then((mod) => mod.default),
    '24': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_editor-dropbox" */ './icons/DropboxIcon'
      ).then((mod) => mod.default),
    '48': () =>
      import(
        /* webpackChunkName: "@atlaskit-internal_editor-dropbox" */ './icons/DropboxIcon'
      ).then((mod) => mod.default),
  },
  modules: {
    quickInsert: [
      {
        key: 'item',
        action: () =>
          new Promise(async (resolve, reject) => {
            try {
              let newNode = await pickFromDropbox(appKey, canMountinIframe);
              if (!newNode) {
                reject();
              } else {
                resolve(newNode);
              }
            } catch (e) {
              reject(e);
            }
          }),
      },
    ],
  },
});

export default manifestFunction;
