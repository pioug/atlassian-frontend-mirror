import React from 'react';

import ModalSpinner from '@atlaskit/media-ui/modalSpinner';
import { token } from '@atlaskit/tokens';

export const CustomSpinner = (): React.JSX.Element => {
	return <ModalSpinner blankedColor={`${token('color.blanket')}`} invertSpinnerColor={false} />;
};
