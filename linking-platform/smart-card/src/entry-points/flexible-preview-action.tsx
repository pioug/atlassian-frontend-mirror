/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import PreviewActionComponent from '../view/FlexibleCard/components/actions/preview-action';
import { toActionProps, type BaseActionProps } from '../view/FlexibleCard/components/actions/utils';

type PreviewActionProps = BaseActionProps;

export const PreviewAction = (props: PreviewActionProps): React.JSX.Element => (
	<PreviewActionComponent {...toActionProps(props)} />
);
