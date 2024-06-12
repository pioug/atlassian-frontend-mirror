/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import Checkbox from '@atlaskit/checkbox';
import Inline from '@atlaskit/primitives/inline';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { useSelection } from './hooks/selection-provider';
import { useTable } from './hooks/use-table';
import { BulkActionOverlay as BulkActionOverlayPrimitive } from './ui/bulk-action-overlay';
import { SelectableCell as SelectableCellPrimitive } from './ui/selectable-cell';
import { THead as THeadPrimitive } from './ui/thead';
import { TR as TRPrimitive } from './ui/tr';

type THeadProps = {
	actions?: (selected: number[]) => ReactNode;
	children?: ReactNode;
};

const THead: FC<THeadProps> = ({ actions, children }) => {
	const { isSelectable } = useTable();
	const [state, { setAll, removeAll }] = useSelection();

	const isChecked = state.allChecked || state.anyChecked;

	return (
		<THeadPrimitive>
			<TRPrimitive isBodyRow={false}>
				{isSelectable && (
					<SelectableCellPrimitive as="th">
						<Checkbox
							label={<VisuallyHidden id="select-all">Select all rows</VisuallyHidden>}
							onChange={isChecked ? removeAll : setAll}
							isChecked={isChecked}
							isIndeterminate={state.anyChecked && !state.allChecked}
						/>
					</SelectableCellPrimitive>
				)}
				{children}
				{isSelectable && isChecked && (
					<BulkActionOverlayPrimitive>
						<span
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								color: token('color.text', '#172B4D'),
								/* @ts-ignore migrate to Text */
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								fontWeight: token('font.weight.medium', '500'),
							}}
						>
							{state.checked.length} selected
						</span>
						{actions && (
							<Inline alignBlock="stretch" space="space.100">
								{actions(state.checked)}
							</Inline>
						)}
					</BulkActionOverlayPrimitive>
				)}
			</TRPrimitive>
		</THeadPrimitive>
	);
};

export default THead;
