/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { jsx } from '@emotion/react';

import Checkbox from '@atlaskit/checkbox';
import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import Inline from '@atlaskit/primitives/inline';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { useSelection } from './hooks/selection-provider';
import { useTable } from './hooks/use-table';
import * as Primitives from './ui';

type THeadProps = {
  actions?: (selected: number[]) => ReactNode;
  children?: ReactNode;
};

const THead: FC<THeadProps> = ({ actions, children }) => {
  const { isSelectable } = useTable();
  const [state, { setAll, removeAll }] = useSelection();

  const isChecked = state.allChecked || state.anyChecked;

  return (
    <Primitives.THead>
      <Primitives.TR isBodyRow={false}>
        {isSelectable && (
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
        )}
        {children}
        {isSelectable && isChecked && (
          <Primitives.BulkActionOverlay>
            <Text color="color.text" fontWeight="medium">
              {state.checked.length} selected
            </Text>
            {actions && (
              <Inline alignBlock="stretch" space="space.100">
                {actions(state.checked)}
              </Inline>
            )}
          </Primitives.BulkActionOverlay>
        )}
      </Primitives.TR>
    </Primitives.THead>
  );
};

export default THead;
