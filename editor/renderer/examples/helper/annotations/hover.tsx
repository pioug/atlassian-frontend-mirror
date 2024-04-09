/** @jsx jsx */
import Button from '@atlaskit/button/new';
import type { InlineCommentHoverComponentProps } from '@atlaskit/editor-common/types';
import { Popup } from '@atlaskit/editor-common/ui';
import AddCommentIcon from '@atlaskit/icon/glyph/comment';
import { css, jsx } from '@emotion/react';
import React from 'react';
import uuid from 'uuid/v4';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';
import { ExampleCreateInlineCommentComponent } from '@atlaskit/editor-test-helpers/example-helpers';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { token } from '@atlaskit/tokens';

const whiteBoxStyles = css({
  backgroundColor: token('color.background.input', 'rgb(255, 255, 255)'),
  boxShadow: token(
    'elevation.shadow.overlay',
    'rgba(9, 30, 66, 0.6) 0px 4px 8px 0px, rgba(9, 30, 66, 0.31) 0px 0px 1px',
  ),
});

type Callback = (doc: JSONDocNode) => void;

const Component = (
  props: InlineCommentHoverComponentProps & { setNewDocument: Callback },
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
        <div css={whiteBoxStyles}>
          <Button
            appearance="subtle"
            iconBefore={AddCommentIcon}
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

  return (
    <ExampleCreateInlineCommentComponent
      dom={domTarget}
      onCreate={onPopupCreate}
      onClose={onPopupClose}
    />
  );
};

export const ExampleHoverInlineComponent =
  (setNewDocument: Callback) => (props: InlineCommentHoverComponentProps) => {
    return <Component setNewDocument={setNewDocument} {...props} />;
  };
