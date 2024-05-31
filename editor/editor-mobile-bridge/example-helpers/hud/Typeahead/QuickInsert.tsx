import React from 'react';
import Button from '../Toolbar/Button';
import type WebBridgeImpl from '../../../src/editor/native-to-web';

interface QuickInsertItem {
	id: string;
	title: string;
}

interface Props {
	items: QuickInsertItem[];
	bridge: WebBridgeImpl;
}

const QuickInsert = ({ items, bridge }: Props) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ display: 'flex', height: 24 }}>
			{items.map((item, index) => (
				<Button
					key={item.id}
					title={item.title}
					onClick={() => {
						bridge.insertTypeAheadItem('quickinsert', JSON.stringify({ index }));
					}}
				/>
			))}
		</div>
	);
};

export default QuickInsert;
