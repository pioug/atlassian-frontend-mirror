import React from 'react';
import Renderer from '../../ui/Renderer';

import {
	adfHeadingsInsideTable,
	adfHeadingsNestedExpands,
	adfHeadingsNestedLayout,
	adfHeadingsNestedPanel,
} from '../__fixtures__/heading-links';

export const HeadingInsidePanel = () => {
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

export const HeadingInsideExpand = () => {
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

export const HeadingInsideTable = () => {
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

export const HeadingInsideLayout = () => {
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
