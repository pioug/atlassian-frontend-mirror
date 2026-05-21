/**
 * Public API — exported externally. Do not add props without external support intent.
 */
import React from 'react';

import type { Prettify } from '@atlaskit/linking-common';

import Action from '../view/FlexibleCard/components/actions/action';
import { toActionProps, type BaseActionProps } from '../view/FlexibleCard/components/actions/utils';

type CustomActionProps = Prettify<
	BaseActionProps & {
		children: React.ReactNode;
		onClick: () => void;
	}
>;
export const CustomAction = (props: CustomActionProps): React.JSX.Element => (
	<Action {...toActionProps(props)} content={props.children} onClick={props.onClick} />
);
