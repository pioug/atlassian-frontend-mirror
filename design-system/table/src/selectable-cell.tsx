/** @jsx jsx */
import { ChangeEventHandler, FC, memo, useCallback } from 'react';

import { jsx } from '@emotion/react';

import Checkbox from '@atlaskit/checkbox';

import { useSelection } from './hooks/selection-provider';
import { useRowId } from './hooks/use-row-id';
import * as Primitives from './ui';

const SelectableCell: FC = () => {
  const [state, { toggleSelection }] = useSelection();
  const idx = useRowId();
  const isChecked = state.allChecked || state.checked.includes(idx!);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => toggleSelection(idx!, (e.nativeEvent as PointerEvent).shiftKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idx],
  );

  return (
    <Primitives.SelectableCell as="td">
      <Checkbox isChecked={isChecked} onChange={onChange} />
    </Primitives.SelectableCell>
  );
};

export default memo(SelectableCell);
