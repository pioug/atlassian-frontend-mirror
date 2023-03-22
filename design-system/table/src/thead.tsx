/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { jsx } from '@emotion/react';

import Checkbox from '@atlaskit/checkbox';
import {
  UNSAFE_Inline as Inline,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { useSelection } from './hooks/selection-provider';
import { useTable } from './hooks/use-table';
import * as Primitives from './ui';

type THeadProps = {
  actions?: (selected: number[]) => ReactNode;
};

const THead: FC<THeadProps> = ({ actions, children }) => {
  const { isSelectable } = useTable();
  const [state, { setAll, removeAll }] = useSelection();

  if (!isSelectable) {
    return (
      <Primitives.THead>
        <Primitives.TR isBodyRow={false}>{children}</Primitives.TR>
      </Primitives.THead>
    );
  }

  const isChecked = state.allChecked || state.anyChecked;

  return (
    <Primitives.THead>
      <Primitives.TR isBodyRow={false}>
        <Primitives.SelectableCell as="th">
          <Checkbox
            label={
              <VisuallyHidden id="select-all">Select all rows</VisuallyHidden>
            }
            onChange={isChecked ? removeAll : setAll}
            isChecked={isChecked}
            isIndeterminate={state.anyChecked && !state.allChecked}
          />
        </Primitives.SelectableCell>
        {children}
        {isChecked && (
          <Primitives.BulkActionOverlay>
            <Text color="color.text" fontWeight="medium">
              {state.checked.length} selected
            </Text>
            {actions && (
              <Inline gap="space.100">{actions(state.checked)}</Inline>
            )}
          </Primitives.BulkActionOverlay>
        )}
      </Primitives.TR>
    </Primitives.THead>
  );
};

export default THead;
