import React from 'react';

import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { cardClient } from '@atlaskit/media-integration-test-helpers/card-client';
import type { MentionProvider } from '@atlaskit/mention/types';
import type { RendererProps } from '@atlaskit/renderer';
import { ReactRenderer } from '@atlaskit/renderer';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';

import { Editor } from '../src';
import type { EditorProps } from '../src/editor';

function useRendererProviderFactory() {
  return React.useMemo(() => {
    const mediaProvider = storyMediaProviderFactory();
    const emojiProvider = getEmojiProvider();
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const mentionProvider = Promise.resolve({
      shouldHighlightMention: (mention: { id: string }) =>
        mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE',
    } as MentionProvider);
    const taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());

    return ProviderFactory.create({
      mediaProvider,
      mentionProvider,
      emojiProvider,
      contextIdentifierProvider,
      taskDecisionProvider,
    });
  }, []);
}

function useProps<T>() {
  const ref = React.createRef<HTMLDivElement>();
  const [props, setProps] = React.useState<T>();
  return [{ ref, props }, setProps] as const;
}

function useWindowBinding(props: { [key: string]: Function }) {
  React.useEffect(() => {
    const win = window as any;
    Object.entries(props).map(([key, fn]) => (win[key] = fn));
    return () => Object.keys(props).forEach((key) => delete win[key]);
  }, [props]);
}

const WysiwygEditor = React.forwardRef<
  HTMLDivElement,
  { props: EditorProps | undefined }
>(function WysiwygEditor(props, ref) {
  return (
    <div ref={ref} id="editor-container">
      {props.props ? (
        <Editor
          {...props.props}
          appearance="chromeless"
          allowTables={true}
          disabled
        />
      ) : null}
    </div>
  );
});

const WysiwygRenderer = React.forwardRef<
  HTMLDivElement,
  { props: RendererProps | undefined }
>(function WysiwygRenderer(props, ref) {
  const providerFactory = useRendererProviderFactory();

  return (
    <div ref={ref} id="renderer-container">
      {props.props ? (
        <SmartCardProvider client={cardClient}>
          <ReactRenderer
            dataProviders={providerFactory}
            extensionHandlers={extensionHandlers}
            {...props.props}
          />
        </SmartCardProvider>
      ) : null}
    </div>
  );
});

export default function WysiwygTesting() {
  const [{ ref: editorRef, props: editorProps }, __mountEditor] =
    useProps<EditorProps>();

  const [{ ref: rendererRef, props: rendererProps }, __mountRenderer] =
    useProps<RendererProps>();

  const __mount = React.useCallback(
    (
      content: any,
      {
        editorProps = {},
        rendererProps = {},
      }: { editorProps: any; rendererProps: any },
    ) => {
      __mountEditor({ ...editorProps, defaultValue: content });
      __mountRenderer({ ...rendererProps, document: content });
    },
    [__mountEditor, __mountRenderer],
  );

  useWindowBinding({ __mountEditor, __mountRenderer, __mount });

  return (
    <>
      <WysiwygEditor ref={editorRef} props={editorProps} />
      <WysiwygRenderer ref={rendererRef} props={rendererProps} />
    </>
  );
}
