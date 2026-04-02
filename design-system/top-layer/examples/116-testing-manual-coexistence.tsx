/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';

const styles = cssMap({
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.1000'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	content: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

/**
 * Test fixture for `mode="manual"` coexistence.
 * Two manual popovers can be open simultaneously since they
 * do not participate in auto-dismiss behavior.
 * Layout is vertical with large spacing to prevent popovers
 * from overlapping each other's triggers.
 */
export default function TestingManualCoexistence(): JSX.Element {
	const [openA, setOpenA] = useState(false);
	const [openB, setOpenB] = useState(false);
	const refA = useRef<HTMLDivElement>(null);
	const refB = useRef<HTMLDivElement>(null);

	return (
		<div css={styles.wrapper}>
			<div>
				<button type="button" data-testid="trigger-a" onClick={() => setOpenA((prev) => !prev)}>
					Toggle A
				</button>
				<Popover ref={refA} role="note" mode="manual" isOpen={openA}>
					<div data-testid="popover-a" css={styles.content}>
						Manual popover A
					</div>
				</Popover>
			</div>
			<div>
				<button type="button" data-testid="trigger-b" onClick={() => setOpenB((prev) => !prev)}>
					Toggle B
				</button>
				<Popover ref={refB} role="note" mode="manual" isOpen={openB}>
					<div data-testid="popover-b" css={styles.content}>
						Manual popover B
					</div>
				</Popover>
			</div>
		</div>
	);
}
