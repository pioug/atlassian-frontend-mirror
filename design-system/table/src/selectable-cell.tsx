import React, { type ChangeEventHandler, type FC, memo, useCallback, useMemo } from 'react';

import Checkbox from '@atlaskit/checkbox';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { useSelection } from './hooks/selection-provider';
import { useRowId } from './hooks/use-row-id';
import { SelectableCell as SelectableCellPrimitive } from './ui';

const SelectableCellComponent: FC = () => {
	const [{ allChecked, checked }, { toggleSelection }] = useSelection();
	const idx = useRowId()!;

	const isChecked = useMemo(() => allChecked || checked.includes(idx), [allChecked, checked, idx]);

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => toggleSelection?.(idx, (e.nativeEvent as PointerEvent).shiftKey),
		[idx, toggleSelection],
	);

	return (
		<SelectableCellPrimitive as="td">
			<Checkbox
				isChecked={isChecked}
				onChange={onChange}
				label={<VisuallyHidden>Select row {idx + 1}</VisuallyHidden>}
			/>
		</SelectableCellPrimitive>
	);
};

const SelectableCell = memo(SelectableCellComponent);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default SelectableCell;
