import { useRef, useMemo, useLayoutEffect } from 'react';
import { ObjectKey, TaskState } from '@atlaskit/task-decision';
import { toNativeBridge } from '../web-to-native/implementation';
import { createTaskDecisionProvider } from '../../providers';
import {
  Providers,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import RendererBridgeImplementation from '../native-to-web/implementation';

const handleToggleTask = (key: ObjectKey, state: TaskState) => {
  toNativeBridge.call('taskDecisionBridge', 'updateTask', {
    taskId: key.localId,
    state,
  });
};

interface RendererProviders {
  mediaProvider: Providers['mediaProvider'];
  mentionProvider: Providers['mentionProvider'];
  emojiProvider: Providers['emojiProvider'];
}

export function useCreateProviderFactory(
  providers: RendererProviders,
  rendererBridge: RendererBridgeImplementation,
): ProviderFactory {
  const { current: taskDecisionProvider } = useRef(
    createTaskDecisionProvider(handleToggleTask),
  );

  useLayoutEffect(() => {
    rendererBridge.taskDecisionProvider = taskDecisionProvider;

    return () => {
      rendererBridge.taskDecisionProvider = undefined;
    };
  }, [rendererBridge, taskDecisionProvider]);

  return useMemo(() => {
    return ProviderFactory.create({
      mediaProvider: providers.mediaProvider,
      emojiProvider: providers.emojiProvider,
      mentionProvider: providers.mentionProvider,
      taskDecisionProvider: Promise.resolve(taskDecisionProvider),
    });
  }, [
    providers.emojiProvider,
    providers.mediaProvider,
    providers.mentionProvider,
    taskDecisionProvider,
  ]);
}
