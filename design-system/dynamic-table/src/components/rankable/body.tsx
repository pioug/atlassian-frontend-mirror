import React from 'react';

import withSortedPageRows, { type TableProps } from '../../hoc/with-sorted-page-rows';

import { RankableBody, type RankableBodyProps } from './rankable-body';

// eslint-disable-next-line import/no-anonymous-default-export
const _default_1: React.ForwardRefExoticComponent<
	Omit<RankableBodyProps & TableProps, 'pageRows'> & {
		forwardedRef?: React.Ref<HTMLTableSectionElement> | undefined;
	} & React.RefAttributes<HTMLTableSectionElement>
> = withSortedPageRows<RankableBodyProps>(
	React.forwardRef<HTMLTableSectionElement, RankableBodyProps>((props, ref) => {
		return <RankableBody {...props} forwardedRef={ref} />;
	}),
);
export default _default_1;
