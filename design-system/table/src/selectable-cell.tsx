/** @jsx jsx */
import { ChangeEventHandler, FC, memo, useCallback, useMemo } from 'react';

import { jsx } from '@emotion/react';

import Checkbox from '@atlaskit/checkbox';

import { useSelection } from './hooks/selection-provider';
import { useRowId } from './hooks/use-row-id';
import * as Primitives from './ui';

const SelectableCell: FC = () => {
  const [{ allChecked, checked }, { toggleSelection }] = useSelection();
  const idx = useRowId()!;

  const isChecked = useMemo(
    () => allChecked || checked.includes(idx),
    [allChecked, checked, idx],
  );

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => toggleSelection?.(idx, (e.nativeEvent as PointerEvent).shiftKey),
    [idx, toggleSelection],
  );

  return (
    <Primitives.SelectableCell as="td">
      <Checkbox isChecked={isChecked} onChange={onChange} />
    </Primitives.SelectableCell>
  );
};

export default memo(SelectableCell);
