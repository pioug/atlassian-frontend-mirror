/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Editor } from '../../../index';
import adf from '../../visual-regression/floating-toolbar/__fixtures__/toolbar-adf-with-custom-panel.json';
// eslint-disable-next-line
import mockEmojiProvider from '@atlaskit/editor-mobile-bridge/src/providers/mockEmojiProvider';

//Added a wrapper to esure the popup doesn't come up as a scrollable content
export const wrapper: any = css`
  height: 900px;
`;

export const content: any = css`
  height: 100%;
`;

export function EditorFloatingToolbarWithFullWidthApperance() {
  return (
    <div css={wrapper} data-testid="ak-editor-content-area">
      <div css={content}>
        <Editor
          appearance="full-width"
          defaultValue={adf}
          allowPanel={{
            allowCustomPanel: true,
            allowCustomPanelEdit: true,
          }}
          emojiProvider={Promise.resolve(mockEmojiProvider)}
        />
      </div>
    </div>
  );
}

export function EditorFloatingToolbarWithCommentApperance() {
  return (
    <div css={wrapper} data-testid="ak-editor-content-area">
      <div css={content}>
        <Editor
          defaultValue={adf}
          appearance="comment"
          allowPanel={{
            allowCustomPanel: true,
            allowCustomPanelEdit: true,
          }}
          emojiProvider={Promise.resolve(mockEmojiProvider)}
        />
      </div>
    </div>
  );
}

export function EditorFloatingToolbarWithChromelessApperance() {
  return (
    <div css={wrapper} data-testid="ak-editor-content-area">
      <div css={content}>
        <Editor
          defaultValue={adf}
          appearance="chromeless"
          allowPanel={{
            allowCustomPanel: true,
            allowCustomPanelEdit: true,
          }}
          emojiProvider={Promise.resolve(mockEmojiProvider)}
        />
      </div>
    </div>
  );
}
