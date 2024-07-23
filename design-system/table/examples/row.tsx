/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { Date as AKDate } from '@atlaskit/date';
import Icon from '@atlaskit/icon/glyph/archive';
import Lozenge from '@atlaskit/lozenge';

import Table, { Cell, Row, TBody } from '../src';

import { userData } from './content/users';

const user = userData.results[0];

export default function RowExample() {
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
						<Icon size="medium" label="archive" />
					</Cell>
				</Row>
			</TBody>
		</Table>
	);
}
