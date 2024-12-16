import React, { lazy, Suspense, useState } from 'react';

import Button from '@atlaskit/button/new';

const ModalDialog = lazy(() => import('@atlaskit/modal-dialog'));
const ModalHeader = lazy(() => import('@atlaskit/modal-dialog/modal-header'));
const ModalTitle = lazy(() => import('@atlaskit/modal-dialog/modal-title'));
const ModalBody = lazy(() => import('@atlaskit/modal-dialog/modal-body'));
const LazyButton = lazy(() => import('@atlaskit/button'));

export default function ModalDeepSuspense(props: any) {
	const [innerLoaded, setInnerLoaded] = useState(false);

	return (
		<Suspense fallback={'Modal loading'}>
			<ModalDialog>
				<ModalHeader>
					<ModalTitle>My modal with inner suspense</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div>
						My modal with inner suspended content
						<br />
						<br />
						<Button onClick={() => setInnerLoaded((c) => !c)}>Toggle suspended content</Button>
						<br />
						<br />
						{innerLoaded && <LazyButton>Suspended content</LazyButton>}
					</div>
				</ModalBody>
			</ModalDialog>
		</Suspense>
	);
}
