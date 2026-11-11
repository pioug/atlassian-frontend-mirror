/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import ImageIcon from '@atlaskit/icon/core/image';
import LozengeDropdownTrigger from '@atlaskit/lozenge/lozenge-dropdown-trigger';
import Lozenge from '@atlaskit/lozenge/new/lozenge';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	controls: { display: 'flex', flexWrap: 'wrap', gap: token('space.100') },
});

export default function ResizingExample(): JSX.Element {
	const [label, setLabel] = useState('Done');
	const [selected, setSelected] = useState(false);
	const [narrow, setNarrow] = useState(false);
	const [adorned, setAdorned] = useState(false);
	const [percentage, setPercentage] = useState(false);
	const props = {
		maxWidth: percentage ? '75%' : 200,
		iconBefore: adorned ? ImageIcon : undefined,
		trailingMetric: adorned ? '123' : undefined,
	};
	return (
		<div css={styles.root}>
			<div css={styles.controls}>
				<Button onClick={() => setLabel('Done')}>Short label</Button>
				<Button onClick={() => setLabel('Ready to merge after all required checks finish')}>
					Long label
				</Button>
				<Button onClick={() => setSelected((value) => !value)}>Unrelated update</Button>
				<Button onClick={() => setNarrow((value) => !value)}>Toggle container width</Button>
				<Button onClick={() => setAdorned((value) => !value)}>Toggle icon and metric</Button>
				<Button onClick={() => setPercentage((value) => !value)}>Toggle percentage width</Button>
			</div>
			<div data-testid="resize-container" style={{ width: narrow ? 100 : 300 }}>
				<Lozenge {...props} testId="resizing-lozenge">
					{label}
				</Lozenge>
			</div>
			<div style={{ width: narrow ? 100 : 300 }}>
				<LozengeDropdownTrigger
					{...props}
					isSelected={selected}
					onClick={() => setSelected((value) => !value)}
					testId="resizing-dropdown"
				>
					{label}
				</LozengeDropdownTrigger>
			</div>
		</div>
	);
}
