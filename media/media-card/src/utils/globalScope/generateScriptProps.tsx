import type React from 'react';

import { type FileIdentifier } from '@atlaskit/media-client';
import { type NumericalCardDimensions } from '@atlaskit/media-common';

import { type MediaCardErrorInfo } from '../analytics';
import { printFunctionCall } from '../printFunctionCall';
import { printScript } from '../printScript';
import { getKey } from './getKey';
import { getMediaCardSSR } from './getMediaCardSSR';
import { getMediaGlobalScope } from './getMediaGlobalScope';
import { storeDataURI } from './storeDataURI';

const generateScript = (
	identifier: FileIdentifier,
	dataURI?: string,
	dimensions?: Partial<NumericalCardDimensions>,
	error?: MediaCardErrorInfo,
) => {
	const functionCall = printFunctionCall(
		storeDataURI,
		getKey(identifier),
		dataURI,
		dimensions,
		error,
	);
	return printScript([getMediaCardSSR.toString(), getMediaGlobalScope.toString(), functionCall]);
};

export const generateScriptProps = (
	identifier: FileIdentifier,
	dataURI?: string,
	dimensions?: Partial<NumericalCardDimensions>,
	error?: MediaCardErrorInfo,
): React.ScriptHTMLAttributes<HTMLScriptElement> => ({
	dangerouslySetInnerHTML: {
		__html: generateScript(identifier, dataURI, dimensions, error),
	},
});
