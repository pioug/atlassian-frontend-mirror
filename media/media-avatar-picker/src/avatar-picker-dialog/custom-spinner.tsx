import React from 'react';
import { token } from '@atlaskit/tokens';

import { ModalSpinner } from '@atlaskit/media-ui';

export const CustomSpinner = (): React.JSX.Element => {
	return <ModalSpinner blankedColor={`${token('color.blanket')}`} invertSpinnerColor={false} />;
};
