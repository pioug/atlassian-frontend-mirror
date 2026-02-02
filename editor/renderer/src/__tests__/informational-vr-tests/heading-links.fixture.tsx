import React from 'react';
import Renderer from '../../ui/Renderer';

import {
	adfHeadingInsideTable,
	adfHeadingNestedExpand,
	adfHeadingNestedLayout,
	adfHeadingsInsideTable,
	adfHeadingsNestedExpands,
	adfHeadingsNestedLayout,
	adfHeadingsNestedPanel,
} from '../__fixtures__/heading-links';

export const HeadingInsidePanel = (): React.JSX.Element => {
	return (
		<Renderer
			allowHeadingAnchorLinks={{
				allowNestedHeaderLinks: true,
			}}
			adfStage={'stage0'}
			appearance={'full-page'}
			document={adfHeadingsNestedPanel}
		/>
	);
};

export const SimpleHeadingInsideExpand = (): React.JSX.Element => {
	return (
		<Renderer
			allowHeadingAnchorLinks={{
				allowNestedHeaderLinks: true,
			}}
			adfStage={'stage0'}
			appearance={'full-page'}
			document={adfHeadingNestedExpand}
		/>
	);
};

export const HeadingInsideExpand = (): React.JSX.Element => {
	return (
		<Renderer
			allowHeadingAnchorLinks={{
				allowNestedHeaderLinks: true,
			}}
			adfStage={'stage0'}
			appearance={'full-page'}
			document={adfHeadingsNestedExpands}
		/>
	);
};

export const SimpleHeadingInsideTable = (): React.JSX.Element => {
	return (
		<Renderer
			allowHeadingAnchorLinks={{
				allowNestedHeaderLinks: true,
			}}
			adfStage={'stage0'}
			appearance={'full-page'}
			allowColumnSorting={true}
			document={adfHeadingInsideTable}
		/>
	);
};
export const HeadingInsideTable = (): React.JSX.Element => {
	return (
		<Renderer
			allowHeadingAnchorLinks={{
				allowNestedHeaderLinks: true,
			}}
			adfStage={'stage0'}
			appearance={'full-page'}
			allowColumnSorting={true}
			document={adfHeadingsInsideTable}
		/>
	);
};

export const SimpleHeadingInsideLayout = (): React.JSX.Element => {
	return (
		<Renderer
			allowHeadingAnchorLinks={{
				allowNestedHeaderLinks: true,
			}}
			adfStage={'stage0'}
			appearance={'full-page'}
			document={adfHeadingNestedLayout}
		/>
	);
};
export const HeadingInsideLayout = (): React.JSX.Element => {
	return (
		<Renderer
			allowHeadingAnchorLinks={{
				allowNestedHeaderLinks: true,
			}}
			adfStage={'stage0'}
			appearance={'full-page'}
			document={adfHeadingsNestedLayout}
		/>
	);
};
