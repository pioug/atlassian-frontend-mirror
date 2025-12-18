import React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { Date as AKDate } from '@atlaskit/date';
import Icon from '@atlaskit/icon/core/archive-box';
import Lozenge from '@atlaskit/lozenge';
import Table, { Cell, Row, TBody } from '@atlaskit/table';

import { userData } from './content/users';

const user = userData.results[0];

export default function RowExample(): React.JSX.Element {
	const name = `${user.name.first} ${user.name.last}`;
	return (
		<Table isSelectable testId="table">
			<TBody>
				<Row>
					<Cell>
						<AvatarItem
							primaryText={name}
							secondaryText={user.email}
							avatar={<Avatar src={user.picture.medium} name={name} size="medium" />}
						/>
					</Cell>
					<Cell align="number">3.141</Cell>
					<Cell>
						<AKDate value={Number(new Date(user.dob.date))} />
					</Cell>
					<Cell>
						<Lozenge appearance="moved">Overdue</Lozenge>
					</Cell>
					<Cell align="icon">
						<Icon  spacing="spacious" label="archive" />
					</Cell>
				</Row>
			</TBody>
		</Table>
	);
}
