import React from 'react';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

export const CopySection = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
	return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
};
