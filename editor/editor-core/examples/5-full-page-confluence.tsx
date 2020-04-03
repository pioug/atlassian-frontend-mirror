import React from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';
import { EditorProps, EditorAppearance } from './../src/editor';
import FullPageExample, {
  ExampleProps,
  getAppearance,
  LOCALSTORAGE_defaultDocKey,
} from './5-full-page';
import { InviteToEditButton } from './3-collab';
import SidebarContainer from '../example-helpers/SidebarContainer';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';

const DisabledBlanket = styled.div`
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
export default class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps,
  State
> {
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
    return (
      <SidebarContainer>
        {this.state.disabled && (
          <DisabledBlanket>
            <Spinner size="large" />
          </DisabledBlanket>
        )}
        <FullPageExample
          {...this.props}
          collabEdit={{
            provider: createCollabEditProvider({
              userId: this.collabSessionId,
              defaultDoc,
            }),
            inviteToEditComponent: InviteToEditButton,
          }}
          disabled={this.state.disabled}
          appearance={this.state.appearance}
          shouldFocus={true}
        />
      </SidebarContainer>
    );
  }
}
