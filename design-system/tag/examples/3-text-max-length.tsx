import React, { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { RemovableTag as Tag } from '@atlaskit/tag';
import { token } from '@atlaskit/tokens';

const cupcakeipsum = 'Croissant topping tiramisu gummi bears. Bonbon chocolate bar danish soufflé';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const TableHeading = styled.th({
	fontWeight: token('font.weight.bold'),
});

interface RowProps {
	name: string;
	children: ReactNode;
}

function Row(props: RowProps) {
	return (
		<tr>
			<TableHeading>{props.name}</TableHeading>
			<td>{props.children}</td>
		</tr>
	);
}

export default function Table() {
	return (
		<table id="maxLengthTag">
			<tbody>
				<Row name="Full text">{cupcakeipsum}</Row>
				<Row name="Text">
					<Tag text={cupcakeipsum} isRemovable={false} />
				</Row>
				<Row name="Linked">
					<Tag text={cupcakeipsum} href="http://www.cupcakeipsum.com/" isRemovable={false} />
				</Row>
				<Row name="Linked & elemBefore">
					<Tag
						text={cupcakeipsum}
						href="http://www.cupcakeipsum.com/"
						isRemovable={false}
						elemBefore="<"
					/>
				</Row>
				<Row name="Removable">
					<Tag text={cupcakeipsum} removeButtonLabel="No sweets for you!" />
				</Row>
				<Row name="Removable & linked">
					<Tag
						text={cupcakeipsum}
						removeButtonLabel="No sweets for you!"
						href="http://www.cupcakeipsum.com/"
					/>
				</Row>
				<Row name="Removable & linked & elemBefore">
					<Tag
						text={cupcakeipsum}
						removeButtonLabel="No sweets for you!"
						href="http://www.cupcakeipsum.com/"
						elemBefore="<"
					/>
				</Row>
			</tbody>
		</table>
	);
}
