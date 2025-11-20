import React from 'react';

import { DocumentViewer } from '../src/documentViewer';

import { contents, imageUrl } from './utils/dummy-data';

export default function Basic(): React.JSX.Element {
	const getContent = async () => contents;
	const getPageImageUrl = async () => imageUrl;

	return <DocumentViewer getContent={getContent} getPageImageUrl={getPageImageUrl} zoom={1.75} />;
}
