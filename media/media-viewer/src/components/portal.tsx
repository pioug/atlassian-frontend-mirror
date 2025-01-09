import React from 'react';
import Portal from '@atlaskit/portal';

export const MediaViewerPortal = ({ children }: { children: React.ReactNode }) => (
	// This zIndex matches with zIndex used by DS Modal and Jira Issue View Modal.
	// This value makes layers stack work correctly:
	//  -> Issue View -> Media Viewer -> DS Modal
	<Portal zIndex={510}>{children}</Portal>
);
