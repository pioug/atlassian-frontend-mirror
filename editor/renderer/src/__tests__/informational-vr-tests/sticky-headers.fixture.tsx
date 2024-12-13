import React from 'react';
import {
	stickyHeadersBrokenOutTableNoResize,
	stickyHeadersBrokenOutTableOverflowing,
	stickyHeadersBrokenOutTableResized,
	stickyHeadersRowWithOnlyHeader,
	stickyHeadersRowWithOnlyNonHeader,
	stickyHeadersRowWithResizedColumns,
	stickyHeadersTableInsideLayout,
	stickyHeadersTableInsideLayoutBrokenOut,
	stickyHeadersTableMergedRows,
	stickyHeadersTableMultipleHeaderRows,
	stickyHeadersTableOverflowing,
	stickyHeadersTableOverflowingNumberedColumn,
	stickyHeadersUnresizedTable,
	stickyHeadersUnresizedTableNumberedColumn,
	stickyHeadersUnresizedTableWithoutHeaderRow,
} from '../__fixtures__/sticky-header-adf';
import Renderer from '../../ui/Renderer';
import type { DocNode } from '@atlaskit/adf-schema';

function StickyHeaderFixture({ adf }: { adf: unknown }) {
	return (
		<div
			id="testscrollcontainer"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ overflow: 'scroll', width: 1280, height: 868 }}
		>
			<Renderer
				adfStage={'stage0'}
				document={adf as DocNode}
				appearance={'full-width'}
				stickyHeaders={{
					offsetTop: 0,
				}}
			/>
		</div>
	);
}
export function StickyHeaderUnResizedTableRenderer() {
	return <StickyHeaderFixture adf={stickyHeadersUnresizedTable} />;
}

export function StickyHeaderUnResizedTableNumberedColumnRenderer() {
	return <StickyHeaderFixture adf={stickyHeadersUnresizedTableNumberedColumn} />;
}

export function StickyHeaderUnResizedTableWithoutHeaderRowRenderer() {
	return <StickyHeaderFixture adf={stickyHeadersUnresizedTableWithoutHeaderRow} />;
}

export function StickyHeaderRowWithOnlyHeader() {
	return <StickyHeaderFixture adf={stickyHeadersRowWithOnlyHeader} />;
}

export function StickyHeaderRowWithOnlyNonHeader() {
	return <StickyHeaderFixture adf={stickyHeadersRowWithOnlyNonHeader} />;
}

export function StickyHeaderRowWithResizedColumns() {
	return <StickyHeaderFixture adf={stickyHeadersRowWithResizedColumns} />;
}

export function StickyHeadersBrokenOutTableNoResize() {
	return <StickyHeaderFixture adf={stickyHeadersBrokenOutTableNoResize} />;
}

export function StickyHeadersBrokenOutTableResized() {
	return <StickyHeaderFixture adf={stickyHeadersBrokenOutTableResized} />;
}

export function StickyHeadersBrokenOutTableOverflowing() {
	return <StickyHeaderFixture adf={stickyHeadersBrokenOutTableOverflowing} />;
}

export function StickyHeadersTableOverflowing() {
	return <StickyHeaderFixture adf={stickyHeadersTableOverflowing} />;
}

export function StickyHeadersTableOverflowingNumberedColumn() {
	return <StickyHeaderFixture adf={stickyHeadersTableOverflowingNumberedColumn} />;
}

export function StickyHeadersTableInsideLayout() {
	return <StickyHeaderFixture adf={stickyHeadersTableInsideLayout} />;
}

export function StickyHeadersTableInsideLayoutBrokenOut() {
	return <StickyHeaderFixture adf={stickyHeadersTableInsideLayoutBrokenOut} />;
}

export function StickyHeadersTableMultipleHeaderRows() {
	return <StickyHeaderFixture adf={stickyHeadersTableMultipleHeaderRows} />;
}

export function StickyHeadersTableMergedRows() {
	return <StickyHeaderFixture adf={stickyHeadersTableMergedRows} />;
}
