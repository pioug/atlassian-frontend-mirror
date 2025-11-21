import React, { useContext, useEffect } from 'react';

import { TableTreeContext } from './context';

export interface CellWithColumnWidthProps {
	width?: string | number;
	columnIndex?: number;
}
export default function withColumnWidth<T extends object>(Cell: React.ComponentType<T>) {
	return (props: T & CellWithColumnWidthProps): React.JSX.Element => {
		const { setColumnWidth, getColumnWidth } = useContext(TableTreeContext);
		const { width, columnIndex, ...other } = props;

		useEffect(() => {
			if (width !== undefined && columnIndex !== undefined) {
				setColumnWidth(columnIndex, width);
			}
		}, [width, columnIndex, setColumnWidth]);

		let columnWidth;
		if (width !== null && width !== undefined) {
			columnWidth = width;
		} else if (columnIndex !== undefined) {
			columnWidth = getColumnWidth(columnIndex);
		}

		return <Cell width={columnWidth} {...(other as T)} />;
	};
}
