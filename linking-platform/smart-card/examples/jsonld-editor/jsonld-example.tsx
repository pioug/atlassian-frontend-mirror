import React, { useCallback } from 'react';

import { type JsonLd } from 'json-ld-types';

import Button from '@atlaskit/button/new';
import { Flex } from '@atlaskit/primitives';

import * as examples from '../../examples-helpers/_jsonLDExamples';
import { getJsonLdResponse } from '../utils/flexible-ui';

const JsonldExample = ({
	defaultValue,
	onSelect,
}: {
	defaultValue: JsonLd.Response;
	onSelect: (response: JsonLd.Response) => void;
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
