/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import DownloadActionComponent from '../view/FlexibleCard/components/actions/download-action';
import { toActionProps, type BaseActionProps } from '../view/FlexibleCard/components/actions/utils';

type DownloadActionProps = BaseActionProps;

export const DownloadAction = (props: DownloadActionProps): React.JSX.Element => (
	<DownloadActionComponent {...toActionProps(props)} />
);
