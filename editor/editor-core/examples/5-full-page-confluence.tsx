/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';
import { EditorAppearance } from './../src/editor';
import FullPageExample, {
  getAppearance,
  LOCALSTORAGE_defaultDocKey,
} from './5-full-page';
import { InviteToEditButton } from './3-collab';
import SidebarContainer from '../example-helpers/SidebarContainer';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';

const disabledBlanket = css`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.03);

  > * {
    margin-top: 50vh;
    margin-left: 50vw;
  }
`;

interface State {
  disabled: boolean;
  appearance: EditorAppearance;
}
/**
 * Example designed to be similar to how the editor is within Confluence's Edit mode
 * Has:
 *  - 64px sidebar on the left
 *  - collab editing enabled
 */
export default class ExampleEditorComponent extends React.Component<{}, State> {
  collabSessionId = 'quokka';

  state = {
    disabled: true,
    appearance: 'full-page' as EditorAppearance,
  };

  private appearanceTimeoutId: number | undefined;

  componentDidMount() {
    // Simulate async nature of confluence fetching appearance
    const timeout = Math.floor(Math.random() * (1500 - 750 + 1)) + 750;
    console.log(`async delay is ${timeout}`);
    this.appearanceTimeoutId = window.setTimeout(() => {
      this.setState(() => ({ disabled: false, appearance: getAppearance() }));
    }, timeout);
  }

  componentWillUnmount() {
    window.clearTimeout(this.appearanceTimeoutId);
  }

  render() {
    const defaultDoc =
      (localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
      undefined;
    const { disabled, appearance } = this.state;

    return (
      <SidebarContainer>
        {this.state.disabled && (
          <div css={disabledBlanket}>
            <Spinner size="large" />
          </div>
        )}
        <FullPageExample
          editorProps={{
            collabEdit: {
              provider: createCollabEditProvider({
                userId: this.collabSessionId,
                defaultDoc,
              }),
              inviteToEditComponent: InviteToEditButton,
            },
            disabled,
            appearance,
            shouldFocus: true,
          }}
        />
      </SidebarContainer>
    );
  }
}
