import React from 'react';

import { I18NWrapper } from '@atlaskit/media-test-helpers';

import { MainWrapper } from '../example-helpers/MainWrapper';
import { PDFPasswordInput } from '../src/viewers/doc/pdfPasswordInput';

const Example = () => (
	<I18NWrapper>
		<MainWrapper>
			<PDFPasswordInput onSubmit={() => {}} />
		</MainWrapper>
	</I18NWrapper>
);

export default Example;
