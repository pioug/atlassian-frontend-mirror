import React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example(): React.JSX.Element {
	return <RendererDemo truncationEnabled={true} maxHeight={96} serializer="react" />;
}
