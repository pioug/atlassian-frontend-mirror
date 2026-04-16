import React from 'react';

import withDimensions, { type State } from '../../hoc/with-dimensions';

import { RankableTableCell, type RankableTableCellProps } from './rankable-table-cell';

// eslint-disable-next-line import/no-anonymous-default-export
const _default_1: React.ComponentClass<
	Omit<RankableTableCellProps, 'refWidth' | 'refHeight' | 'innerRef'>,
	State
> = withDimensions<RankableTableCellProps>(RankableTableCell);
export default _default_1;
