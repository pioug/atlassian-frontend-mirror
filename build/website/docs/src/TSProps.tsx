import React from 'react';

import { TSMorphProps } from './ts-morph-ui';

type Props = {
	props: {
		types: Parameters<typeof TSMorphProps>[0]['props'];
	};
	withoutMarginBlockStart?: boolean;
	filter?: {
		omit?: string[];
		pick?: string[];
	};
};

export function TSProps(params: Props): React.JSX.Element {
	const { props, filter, withoutMarginBlockStart } = params;

	// Filter the props if required
	let filteredProps = props.types;

	if (Array.isArray(filter?.pick)) {
		filteredProps = filteredProps.filter((t) => filter.pick?.includes(t.name));
	}

	if (Array.isArray(filter?.omit)) {
		filteredProps = filteredProps.filter((t) => !filter.omit?.includes(t.name));
	}

	return <TSMorphProps props={filteredProps} withoutMarginBlockStart={withoutMarginBlockStart} />;
}
