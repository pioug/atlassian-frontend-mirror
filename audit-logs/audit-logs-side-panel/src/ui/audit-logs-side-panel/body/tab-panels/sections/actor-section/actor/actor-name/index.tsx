/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import { Inline } from '@atlaskit/primitives/compiled';

import type { AuditLogEventData } from '../../../../../../../../common/types';

interface ActorNameProps {
	actor: AuditLogEventData['attributes']['actor'];
}

export const ActorName = ({ actor }: ActorNameProps) => (
	<Inline alignBlock="center">
		<Avatar
			appearance="circle"
			size="small"
			src={actor?.picture ?? undefined}
			name={actor?.name ?? undefined}
		/>
		<span>{actor?.name}</span>
	</Inline>
);
