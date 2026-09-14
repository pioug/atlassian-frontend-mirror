import type React from 'react';

import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

export type TypeAheadItemRenderProps = {
	id: string;
	isSelected: boolean;
	registration: RegisterMenuItem;
};

export type TypeAheadItemComponent = React.ComponentType<TypeAheadItemRenderProps>;
