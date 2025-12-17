import React from 'react';

import type { IconProps, NewCoreIconProps } from '@atlaskit/icon';
import ClipboardIcon from '@atlaskit/icon/core/clipboard';

// Ignored via go/ees005
// eslint-disable-next-line react/jsx-props-no-spreading
const EditorPasteIcon = (
	props: Omit<IconProps, 'size'> & Omit<NewCoreIconProps, 'size'>,
): React.JSX.Element => {
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <ClipboardIcon {...props} />;
};

EditorPasteIcon.displayName = 'EditorPasteIcon';

export default EditorPasteIcon;
