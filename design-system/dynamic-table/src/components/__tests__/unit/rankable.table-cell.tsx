import React from 'react';

import { shallow } from 'enzyme';

import {
  RankableTableCell,
  RankableTableCellProps,
} from '../../rankable/table-cell';

import { cellWithKey as cell, head } from './_data';

const createProps = () => ({
  cell,
  head: head.cells[0],
  isRanking: false,
  innerRef: jest.fn(),
  refWidth: -1,
  refHeight: -1,
  isFixedSize: false,
});

test('onKeyDown events are not propagated', () => {
  const props: RankableTableCellProps = createProps();
  const wrapper = shallow(<RankableTableCell {...props} />);

  const stopPropagation = jest.fn();

  wrapper.simulate('keyDown', { stopPropagation });
  expect(stopPropagation).toHaveBeenCalledTimes(1);
});
