import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { renderEmoji } from './00-simple-emoji';
import EmojiPickerWithUpload from './05-standard-emoji-picker-with-upload';

const Page: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <div>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 20,
};

export default () => {
  const serverOnlySingleId = 'container-ssr-simple';
  const hydrationSingleId = 'container-hydration-simple';
  const serverOnlyPickerId = 'container-ssr-picker';
  const hydrationPickerId = 'container-hydration-picker';

  const runSSR = async (
    containerId: string,
    node: React.ReactNode,
    hydrate?: boolean,
  ) => {
    try {
      const txt = ReactDOMServer.renderToString(
        <Page title={'SSR Only'}>{node}</Page>,
      );
      const elem = document.querySelector(`#${containerId}`);

      if (elem) {
        elem.innerHTML = txt;
        hydrate &&
          ReactDOM.hydrate(<Page title={'SSR + Hydration'}>{node}</Page>, elem);
      }
    } catch (e) {
      console.error(containerId, e);
    }
  };

  useEffect(() => {
    // TODO: add ssr prop to components, e.g. <EmojiPickerWithUpload ssr={true} />
    runSSR(serverOnlySingleId, renderEmoji(40));
    runSSR(hydrationSingleId, renderEmoji(40), true);
    runSSR(serverOnlyPickerId, <EmojiPickerWithUpload />);
    runSSR(hydrationPickerId, <EmojiPickerWithUpload />, true);
  }, []);

  return (
    <div
      style={{
        maxWidth: 1300,
        margin: 'auto',
        marginTop: 20,
      }}
    >
      <div>
        <h2>Simple Emoji</h2>
        <div style={rowStyle}>
          <div style={{ marginRight: 20 }} id={serverOnlySingleId}></div>
          <div style={{ marginRight: 20 }} id={hydrationSingleId}></div>
        </div>
        <hr />
        <h2>Emoji Picker</h2>
        <div style={rowStyle}>
          <div style={{ marginRight: 20 }} id={serverOnlyPickerId}></div>
          <div style={{ marginRight: 20 }} id={hydrationPickerId}></div>
        </div>
        <hr />
      </div>
    </div>
  );
};
