import React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example(): React.JSX.Element {
	return <RendererDemo withProviders={true} withPortal={true} serializer="react" />;
}
