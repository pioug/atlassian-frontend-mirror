/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import CopyLinkActionComponent from '../view/FlexibleCard/components/actions/copy-link-action';
import { toActionProps, type BaseActionProps } from '../view/FlexibleCard/components/actions/utils';

type CopyLinkActionProps = BaseActionProps;

export const CopyLinkAction = (props: CopyLinkActionProps): React.JSX.Element => (
	<CopyLinkActionComponent {...toActionProps(props)} />
);
