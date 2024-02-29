import React from 'react';
import Button from '@atlaskit/button/standard-button';
import type { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common/types';
import AddCommentIcon from '@atlaskit/icon/glyph/comment';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Popup } from '@atlaskit/editor-common/ui';

type Callback = (doc: JSONDocNode) => void;

export const AnnotationSelectionComponentMock = (
  props: InlineCommentSelectionComponentProps & { setNewDocument: Callback },
) => {
  const { isAnnotationAllowed, onClose, applyDraftMode, wrapperDOM } = props;
  const [showCreateComponent, setShowCreateComponent] = React.useState(false);
  const onToolbarCreateButtonClick = React.useCallback(() => {
    applyDraftMode();
    setShowCreateComponent(true);
  }, [applyDraftMode]);

  const onPopupClose = React.useCallback(() => {
    setShowCreateComponent(false);
    onClose();
  }, [onClose]);

  React.useLayoutEffect(() => {
    const onClick = (event: MouseEvent) => {
      const { target } = event;

      if (!showCreateComponent && wrapperDOM.contains(target as HTMLElement)) {
        onPopupClose();
        return;
      }
    };

    document.addEventListener('mousedown', onClick);

    return () => {
      document.removeEventListener('mousedown', onClick);
    };
  }, [wrapperDOM, showCreateComponent, onPopupClose]);

  if (!showCreateComponent) {
    return (
      <Popup target={wrapperDOM} alignX="center" alignY="bottom">
        <div>
          <Button
            appearance="subtle"
            iconBefore={<AddCommentIcon size="medium" label="" />}
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
  (setNewDocument: Callback) =>
  (props: InlineCommentSelectionComponentProps) => {
    return (
      <AnnotationSelectionComponentMock
        setNewDocument={setNewDocument}
        {...props}
      />
    );
  };
