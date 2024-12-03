import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const PropertyViewerContainer = styled.span({
	display: 'inline-block',
	margin: token('space.025', '2px'),
	padding: `0 ${token('space.050', '4px')}`,
	borderRadius: '5px',
	boxShadow: '1px 1px 2px #888',
	border: '1px solid #888',
});

type Props<T extends Record<string, unknown>> = {
	object: T;
	property: string & keyof T;
};

export const PropertyViewer = <T extends Record<string, unknown>>({
	object,
	property,
}: Props<T>) => {
	if (object[property] !== undefined) {
		return (
			<PropertyViewerContainer>
				{property}: {JSON.stringify(object[property])}
			</PropertyViewerContainer>
		);
	}
	return null;
};
