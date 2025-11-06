import React from 'react';
import Button from '@atlaskit/button/standard-button';
import type { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common/types';
import AddCommentIcon from '@atlaskit/icon/core/migration/comment';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Popup } from '@atlaskit/editor-common/ui';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid/v4';

type Callback = (doc: JSONDocNode) => void;

const AnnotationSelectionComponentMock = (
	props: InlineCommentSelectionComponentProps & { setNewDocument: Callback },
) => {
	const { isAnnotationAllowed, onClose, applyDraftMode, wrapperDOM } = props;
	const [showCreateComponent, setShowCreateComponent] = React.useState(false);
	const onToolbarCreateButtonClick = React.useCallback(() => {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		applyDraftMode({ annotationId: uuid(), keepNativeSelection: true });
		setShowCreateComponent(true);
	}, [applyDraftMode]);

	const onPopupClose = React.useCallback(() => {
		setShowCreateComponent(false);
		onClose();
	}, [onClose]);

	React.useLayoutEffect(() => {
		const onClick = (event: MouseEvent) => {
			const { target } = event;

			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			if (!showCreateComponent && wrapperDOM.contains(target as HTMLElement)) {
				onPopupClose();
				return;
			}
		};

		// Ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		document.addEventListener('mousedown', onClick);

		return () => {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			document.removeEventListener('mousedown', onClick);
		};
	}, [wrapperDOM, showCreateComponent, onPopupClose]);

	if (!showCreateComponent) {
		return (
			<Popup target={wrapperDOM} alignX="center" alignY="bottom">
				<div>
					<Button
						appearance="subtle"
						iconBefore={<AddCommentIcon LEGACY_size="medium" label="" />}
						isDisabled={!isAnnotationAllowed}
						testId="createInlineCommentButton"
						onClick={onToolbarCreateButtonClick}
					>
						Comment
					</Button>
				</div>
			</Popup>
		);
	}

	return <div>Comment Popup</div>;
};

export const SelectionInlineComponentMock =
	(setNewDocument: Callback) => (props: InlineCommentSelectionComponentProps) => {
		return <AnnotationSelectionComponentMock setNewDocument={setNewDocument} {...props} />;
	};
