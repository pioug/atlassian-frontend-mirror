import React from 'react';
import Renderer from '../../ui/Renderer';

import {
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
