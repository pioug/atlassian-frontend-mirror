import React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { cssMap } from '@atlaskit/css';
import { Date as AKDate } from '@atlaskit/date';
import Icon from '@atlaskit/icon/core/archive-box';
import Lozenge from '@atlaskit/lozenge';
import { Flex } from '@atlaskit/primitives/compiled';
import Table, { Cell, Row, TBody } from '@atlaskit/table';
import { token } from '@atlaskit/tokens';

import { userData } from './content/users';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

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
						<Flex xcss={iconSpacingStyles.space050}>
							<Icon label="archive" />
						</Flex>
					</Cell>
				</Row>
			</TBody>
		</Table>
	);
}
