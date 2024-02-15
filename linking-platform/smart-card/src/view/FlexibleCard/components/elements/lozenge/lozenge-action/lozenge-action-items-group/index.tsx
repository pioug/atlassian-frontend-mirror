/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FC } from 'react';
import LozengeActionItem from '../lozenge-action-item';
import { dropdownItemGroupStyles } from '../styled';
import { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import type { LozengeActionItemsGroupProps } from './types';

const LozengeActionItemsGroup: FC<LozengeActionItemsGroupProps> = ({
  items,
  testId,
  onClick,
}) => (
  // eslint-disable-next-line @atlaskit/design-system/prefer-primitives
  <span css={dropdownItemGroupStyles} data-testid={`${testId}-item-group`}>
    <DropdownItemGroup>
      {items.map((item, idx) => (
        <LozengeActionItem
          {...item}
          key={idx}
          onClick={onClick}
          testId={`${testId}-item-${idx}`}
        />
      ))}
    </DropdownItemGroup>
  </span>
);

export default LozengeActionItemsGroup;
