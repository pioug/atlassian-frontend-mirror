/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import FollowActionComponent from '../view/FlexibleCard/components/actions/follow-action';
import { toActionProps, type BaseActionProps } from '../view/FlexibleCard/components/actions/utils';


type FollowActionProps = BaseActionProps;
export const FollowAction = (props: FollowActionProps): React.JSX.Element => (
	<FollowActionComponent {...toActionProps(props)} />
);
