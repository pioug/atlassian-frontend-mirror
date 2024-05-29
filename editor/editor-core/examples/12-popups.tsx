/* eslint-disable no-console */
/** @jsx jsx */
import { PureComponent } from 'react';

import { css, jsx } from '@emotion/react';

import { imageUploadHandler } from '@atlaskit/editor-test-helpers/example-helpers';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { content } from '../example-helpers/styles';
import { Editor } from '../src';

const boundary = css({
  border: `2px solid ${token('color.border', N40)}`,
  padding: `130px 60px 10px ${token('space.500', '40px')}`,
});

class CustomBoundryExample extends PureComponent<any, any> {
  state = { boundary: undefined };

  handleBoundryRef = (boundary: HTMLDivElement) => {
    this.setState({ boundary });
  };

  render() {
    const props = this.props;

    return (
      <div css={boundary} ref={this.handleBoundryRef}>
        <Editor
          appearance="comment"
          onCancel={props.onCancel}
          onSave={props.onSave}
          mentionProvider={props.mentionProvider}
          emojiProvider={props.emojiProvider}
          popupsBoundariesElement={this.state.boundary}
          quickInsert={true}
        />
      </div>
    );
  }
}

class PortalExample extends PureComponent<any, any> {
  state = {
    portal: undefined,
  };

  handleRef = (portal: HTMLDivElement) => {
    this.setState({ portal });
  };

  render() {
    const props = this.props;

    return (
      <div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ overflow: 'hidden' }}>
          <Editor
            appearance="comment"
            onCancel={props.onCancel}
            onSave={props.onSave}
            mentionProvider={props.mentionProvider}
            emojiProvider={props.emojiProvider}
            popupsMountPoint={this.state.portal}
            quickInsert={true}
          />
        </div>
        <div ref={this.handleRef} />
      </div>
    );
  }
}

class PortalWithCustomBoundaryExample extends PureComponent<any, any> {
  state = { portal: undefined, boundary: undefined };

  handlePortalRef = (portal: HTMLDivElement) => {
    this.setState({ portal });
  };

  handleBoundryRef = (boundary: HTMLDivElement) => {
    this.setState({ boundary });
  };

  render() {
    const props = this.props;

    return (
      <div>
        <div css={boundary} ref={this.handleBoundryRef}>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
          <div style={{ overflow: 'hidden' }}>
            <Editor
              appearance="comment"
              onCancel={props.onCancel}
              onSave={props.onSave}
              mentionProvider={props.mentionProvider}
              emojiProvider={props.emojiProvider}
              popupsMountPoint={this.state.portal}
              popupsBoundariesElement={this.state.boundary}
              quickInsert={true}
            />
          </div>
        </div>
        <div ref={this.handlePortalRef} />
      </div>
    );
  }
}

class PortalInScrollContainerExample extends PureComponent<any, any> {
  state = { portal: undefined, boundary: undefined };

  handlePortalRef = (portal: HTMLDivElement) => {
    this.setState({ portal });
  };

  handleBoundryRef = (boundary: HTMLDivElement) => {
    this.setState({ boundary });
  };

  render() {
    const props = this.props;

    return (
      <div
        style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          overflow: 'scroll',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          height: 200,
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          position: 'relative',
          border: `1px solid ${token('color.border', N40)}`,
        }}
        ref={this.handleBoundryRef}
      >
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ minHeight: 500, width: '120%' }}>
          <Editor
            appearance="comment"
            onCancel={props.onCancel}
            onSave={props.onSave}
            mentionProvider={props.mentionProvider}
            emojiProvider={props.emojiProvider}
            popupsMountPoint={this.state.portal}
            popupsBoundariesElement={this.state.boundary}
            quickInsert={true}
          />
        </div>

        <div ref={this.handlePortalRef} />

        <Editor
          appearance="comment"
          onCancel={props.onCancel}
          onSave={props.onSave}
          mentionProvider={props.mentionProvider}
          emojiProvider={props.emojiProvider}
          popupsMountPoint={this.state.portal}
          popupsBoundariesElement={this.state.boundary}
          quickInsert={true}
        />
      </div>
    );
  }
}

class JiraSidebarEditor extends PureComponent<any, any> {
  state = { portal: undefined, boundary: undefined, scrollable: undefined };

  handlePortalRef = (portal: HTMLDivElement) => {
    this.setState({ portal });
  };

  handleBoundryRef = (boundary: HTMLDivElement) => {
    this.setState({ boundary });
  };

  handleScrollableRef = (scrollable: HTMLDivElement) => {
    this.setState({ scrollable });
  };

  render() {
    return (
      <div ref={this.handleBoundryRef}>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ display: 'table' }}>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
          <div style={{ display: 'table-cell', width: 480 }}>JIRA</div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
          <div style={{ display: 'table-cell' }}>
            <div
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
              style={{ width: 300, overflowY: 'scroll', height: 200 }}
              ref={this.handleScrollableRef}
            >
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
              <div style={{ height: 500 }}>
                <Editor
                  onCancel={CANCEL_ACTION}
                  onSave={SAVE_ACTION}
                  mentionProvider={mentionProvider}
                  emojiProvider={emojiProvider}
                  popupsMountPoint={this.state.portal}
                  popupsBoundariesElement={this.state.boundary}
                  popupsScrollableElement={this.state.scrollable}
                  quickInsert={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div ref={this.handlePortalRef} />
      </div>
    );
  }
}

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

const mentionProvider = new Promise<any>((resolve) =>
  resolve(mentionResourceProvider),
);
const emojiProvider = getEmojiProvider();

export default function Example() {
  return (
    <div>
      <div css={content}>
        <h2>Intentionally Broken Example</h2>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <p style={{ marginBottom: token('space.150', '12px') }}>
          Boundries: document.body | Container: 300px, overflow: hidden.
        </p>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ width: 300, overflow: 'hidden' }}>
          <Editor
            appearance="comment"
            onCancel={CANCEL_ACTION}
            onSave={SAVE_ACTION}
            mentionProvider={mentionProvider}
            emojiProvider={emojiProvider}
            quickInsert={true}
          />
        </div>
      </div>

      <hr />

      <div css={content}>
        <h2>Basic</h2>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <p style={{ marginBottom: token('space.150', '12px') }}>
          Boundries: document.body | Container: 300px, no overflow.
        </p>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ width: 300 }}>
          <Editor
            appearance="comment"
            onCancel={CANCEL_ACTION}
            onSave={SAVE_ACTION}
            mentionProvider={mentionProvider}
            emojiProvider={emojiProvider}
            quickInsert={true}
          />
        </div>
      </div>

      <div css={content}>
        <h2>Basic with Custom Boundry</h2>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <p style={{ marginBottom: token('space.150', '12px') }}>
          Boundries: custom | Container: 500px, no overflow.
        </p>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ width: 500 }}>
          <CustomBoundryExample
            appearance="comment"
            imageUploadHandler={imageUploadHandler}
            onCancel={CANCEL_ACTION}
            onSave={SAVE_ACTION}
            mentionProvider={mentionProvider}
            emojiProvider={emojiProvider}
          />
        </div>
      </div>

      <hr />

      <div css={content}>
        <h2>Basic Portal</h2>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <p style={{ marginBottom: token('space.150', '12px') }}>
          Boundries: document.body | Container: 300px, overflow: hidden.
        </p>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ width: 300 }}>
          <PortalExample
            imageUploadHandler={imageUploadHandler}
            onCancel={CANCEL_ACTION}
            onSave={SAVE_ACTION}
            mentionProvider={mentionProvider}
            emojiProvider={emojiProvider}
            devTools={true}
          />
        </div>
      </div>

      <div css={content}>
        <h2>Portal with Custom Boundry</h2>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <p style={{ marginBottom: token('space.150', '12px') }}>
          Boundries: custom | Container: 500px, overflow: hidden.
        </p>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ width: 500 }}>
          <PortalWithCustomBoundaryExample
            imageUploadHandler={imageUploadHandler}
            onCancel={CANCEL_ACTION}
            onSave={SAVE_ACTION}
            mentionProvider={mentionProvider}
            emojiProvider={emojiProvider}
          />
        </div>
      </div>

      <div css={content}>
        <h2>Portal in Scroll Container</h2>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <p style={{ marginBottom: token('space.150', '12px') }}>
          Boundries: custom | Container: 700px, overflow: hidden.
        </p>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={{ maxWidth: 700 }}>
          <PortalInScrollContainerExample
            imageUploadHandler={imageUploadHandler}
            onCancel={CANCEL_ACTION}
            onSave={SAVE_ACTION}
            mentionProvider={mentionProvider}
            emojiProvider={emojiProvider}
          />
        </div>
      </div>

      <hr />

      <div css={content}>
        <h2>Portal with custom scroll container</h2>
        <JiraSidebarEditor />
      </div>
    </div>
  );
}
