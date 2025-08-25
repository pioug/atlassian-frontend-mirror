import Tooltip from '@atlaskit/tooltip';
import React from 'react';
import { NoAccessWarning } from '../../util/i18n';

type Props = {
	children: React.ReactNode;
	name: string;
};

export const NoAccessTooltip = ({ name, children }: Props) => (
	<NoAccessWarning values={{ name: name }}>
		{(text: string) => (
			<Tooltip content={text} position="right">
				{children}
			</Tooltip>
		)}
	</NoAccessWarning>
);
