import React from 'react';

/**
 * By default the Atlaskit website includes css-reset in examples
 * when implementing css-reset in your application,
 * please include the stylesheet in head as `<link href="<path to css-reset>" rel="stylesheet" />`
 * or import '@atlaskit/css-reset' in your application code
 */
export default () => (
	<div>
		<table>
			<caption>Table captions are like headings for tabular data</caption>
			<thead>
				<tr>
					<th>Item</th>
					<th>Qty</th>
					<th>Price</th>
				</tr>
			</thead>
			<tfoot>
				<tr>
					<th scope="row">Total</th>
					<td>21</td>
					<td>$13.81</td>
				</tr>
			</tfoot>
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
