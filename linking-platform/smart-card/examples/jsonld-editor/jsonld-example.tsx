import { useCallback } from 'react';
import * as examples from '../../examples-helpers/_jsonLDExamples';
import Button from '@atlaskit/button/new';
import { getJsonLdResponse } from '../utils/flexible-ui';
import { type ResolveResponse } from '../../src';
import React from 'react';
import { Flex } from '@atlaskit/primitives';

const JsonldExample = ({
	defaultValue,
	onSelect,
}: {
	defaultValue: ResolveResponse;
	onSelect: (response: ResolveResponse) => void;
}) => {
	const handleOnClick = useCallback(
		({ data, meta }: any) => {
			const response = getJsonLdResponse(data.url, meta, data);
			onSelect(response);
		},
		[onSelect],
	);

	return (
		<Flex gap="space.050" wrap="wrap">
			<Button onClick={() => handleOnClick(defaultValue)} spacing="compact">
				🦄
			</Button>
			{Object.entries(examples).map(([key, data], idx) => (
				<Button key={idx} onClick={() => handleOnClick(data)} spacing="compact">
					{key}
				</Button>
			))}
		</Flex>
	);
};

export default JsonldExample;
