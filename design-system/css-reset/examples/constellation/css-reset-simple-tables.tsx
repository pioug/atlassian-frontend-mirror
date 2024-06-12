import React from 'react';

const CSSResetSimpleTablesExample = () => {
	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Item</th>
						<th>Qty</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Apple</th>
						<td>3</td>
						<td>$5.42</td>
					</tr>
					<tr>
						<th scope="row">Orange</th>
						<td>6</td>
						<td>$4.60</td>
					</tr>
					<tr>
						<th scope="row">Banana</th>
						<td>12</td>
						<td>$3.79</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default CSSResetSimpleTablesExample;
