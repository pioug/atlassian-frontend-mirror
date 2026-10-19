import React from 'react';

import { SUPPORTED_LANGUAGES } from '@atlaskit/code/constants';

import { useIsInsetViewer, useMediaFooterControls } from '../../insetViewerContext';
import { CodeViewerFooter } from './CodeViewerFooter';
import type { Props } from './codeViewerRenderer';
import { CodeViewRenderer as CompiledCodeViewRenderer } from './CodeViewRenderer';

export const CodeViewRenderer = (props: Props): React.JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	const footerElement = useMediaFooterControls();

	return (
		<>
			<CompiledCodeViewRenderer {...props} />
			{isInsetViewer && (
				<CodeViewerFooter
					// Plain text has no name, so the footer shows its translated "Plain text" label instead of
					// the code package's untranslated "PlainText".
					languageName={
						props.language === 'text'
							? undefined
							: SUPPORTED_LANGUAGES.find((candidate) =>
									(candidate.alias as ReadonlyArray<string>).includes(props.language),
								)?.name
					}
					footerElement={footerElement}
				/>
			)}
		</>
	);
};
