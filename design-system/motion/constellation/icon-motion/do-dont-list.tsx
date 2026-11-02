import React from 'react';

export default function DoDontList({ list }: { list: string[] }): React.JSX.Element {
	return (
		<ul>
			{list.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ul>
	);
}
