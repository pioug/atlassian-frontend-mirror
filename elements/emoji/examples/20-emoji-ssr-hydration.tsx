import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { renderEmoji } from './00-simple-emoji';
import EmojiPickerWithUpload from './05-standard-emoji-picker-with-upload';
import { EmojiImage } from '../src/components/common/EmojiImage';
import { getRealEmojiResource } from '../example-helpers/demo-resource-control';
import { ResourcedEmoji } from '../src';

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
  const serverOnlyResourceId = 'container-ssr-resource';
  const hydrationResourceId = 'container-hydration-resource';
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
    runSSR(
      serverOnlyResourceId,
      <EmojiImage
        showImageBeforeLoad
        emojiId={{ shortName: ':grimacing:', id: '1f603' }}
        imageUrl="https://pf-emoji-service--cdn.us-east-1.staging.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/64x64/1f603.png"
      />,
    );
    runSSR(
      hydrationResourceId,
      <ResourcedEmoji
        emojiId={{ shortName: ':grimacing:', id: '1f603' }}
        emojiProvider={getRealEmojiResource()}
        optimisticImageURL="https://pf-emoji-service--cdn.us-east-1.staging.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/64x64/1f603.png"
      />,
      true,
    );
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
        <h2>Emoji Image and Resourced Emoji</h2>
        <div style={rowStyle}>
          <div style={{ marginRight: 20 }} id={serverOnlyResourceId}></div>
          <div style={{ marginRight: 20 }} id={hydrationResourceId}></div>
        </div>
        <hr />
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
