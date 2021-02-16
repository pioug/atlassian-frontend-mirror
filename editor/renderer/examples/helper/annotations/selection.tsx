import React from 'react';
import Button from '@atlaskit/button/standard-button';
import AddCommentIcon from '@atlaskit/icon/glyph/comment';
import uuid from 'uuid/v4';
import { InlineCommentSelectionComponentProps } from '@atlaskit/editor-common';
import styled from 'styled-components';
import { Popup } from '@atlaskit/editor-common';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';
import { ExampleCreateInlineCommentComponent } from '@atlaskit/editor-test-helpers/example-inline-comment-component';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';

const WhiteBox = styled.div`
  background-color: rgb(255, 255, 255);
  box-shadow: rgba(9, 30, 66, 0.6) 0px 4px 8px 0px,
    rgba(9, 30, 66, 0.31) 0px 0px 1px;
`;

type Callback = (doc: JSONDocNode) => void;

const Component = (
  props: InlineCommentSelectionComponentProps & { setNewDocument: Callback },
) => {
  const {
    range,
    isAnnotationAllowed,
    onCreate,
    onClose,
    applyDraftMode,
    removeDraftMode,
    wrapperDOM,
    setNewDocument,
  } = props;
  const [showCreateComponent, setShowCreateComponent] = React.useState(false);
  const onToolbarCreateButtonClick = React.useCallback(() => {
    applyDraftMode();
    setShowCreateComponent(true);
  }, [applyDraftMode]);

  const onPopupClose = React.useCallback(() => {
    setShowCreateComponent(false);
    onClose();
  }, [onClose]);

  const onPopupCreate = React.useCallback(() => {
    removeDraftMode();
    setShowCreateComponent(false);
    onClose();

    const id = uuid();
    const result = onCreate(id);

    if (result) {
      setNewDocument(result.doc);
    }
  }, [onClose, onCreate, removeDraftMode, setNewDocument]);

  const domTarget = React.useMemo(() => {
    let element = range.commonAncestorContainer as HTMLElement;
    if (element instanceof Text) {
      element = element.parentElement!;
    }

    return element;
  }, [range]);

  const firstRangeDOMRect: DOMRect = React.useMemo(() => {
    if (showCreateComponent && firstRangeDOMRect) {
      return firstRangeDOMRect;
    }

    return range.getClientRects()[0] as DOMRect;
  }, [range, showCreateComponent]);

  const onPositionCalculated = React.useCallback(
    (nextPos: Position): Position => {
      const containerRect = wrapperDOM.getBoundingClientRect() as DOMRect;
      const firstRangeReact = firstRangeDOMRect;

      return {
        ...nextPos,
        left: firstRangeReact.right - firstRangeReact.width / 2,
        top: Math.abs(
          Math.abs(containerRect.y) +
            firstRangeReact.y +
            firstRangeReact.height +
            10,
        ),
      };
    },
    [firstRangeDOMRect, wrapperDOM],
  );

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
      <Popup
        target={wrapperDOM}
        alignX="center"
        alignY="bottom"
        onPositionCalculated={onPositionCalculated}
      >
        <WhiteBox>
          <Button
            appearance="subtle"
            iconBefore={<AddCommentIcon size="medium" label="" />}
            isDisabled={!isAnnotationAllowed}
            testId="createInlineCommentButton"
            onClick={onToolbarCreateButtonClick}
          >
            Comment
          </Button>
        </WhiteBox>
      </Popup>
    );
  }

  return (
    <ExampleCreateInlineCommentComponent
      dom={domTarget}
      onCreate={onPopupCreate}
      onClose={onPopupClose}
    />
  );
};

export const ExampleSelectionInlineComponent = (setNewDocument: Callback) => (
  props: InlineCommentSelectionComponentProps,
) => {
  return <Component setNewDocument={setNewDocument} {...props} />;
};
