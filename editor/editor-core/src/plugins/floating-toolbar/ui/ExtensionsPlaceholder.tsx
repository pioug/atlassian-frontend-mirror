import React, { useEffect, useState } from 'react';
import Loadable from 'react-loadable';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  ExtensionProvider,
  ExtensionToolbarButton,
  ExtensionManifest,
} from '@atlaskit/editor-common';
import Button from './Button';
import { getContextualToolbarlItemsFromModule } from '@atlaskit/editor-common';
import Separator from './Separator';
import ButtonGroup from '@atlaskit/button/button-group';
import { ADFEntity } from '@atlaskit/adf-utils';
import { nodeToJSON } from '../../../utils';

interface Props {
  node: PMNode;
  extensionProvider: ExtensionProvider;
  editorView: EditorView;
  separator?: 'start' | 'end' | 'both';
}

type ExtensionButtonProps = {
  item: ExtensionToolbarButton;
  editorView: EditorView;
  node: PMNode;
};

const ExtensionButton = (props: ExtensionButtonProps) => {
  const { item, node } = props;

  const ButtonIcon = item.icon
    ? Loadable<{ label: string }, never>({
        loader: item.icon,
        loading: () => null,
      })
    : undefined;

  const onClick = () => {
    const targetNodeAdf: ADFEntity = nodeToJSON(node);
    if (typeof item.action === 'function') {
      item.action(targetNodeAdf);
    } else {
      throw new Error(
        `'action' of context toolbar item '${item.key}' is not a function`,
      );
    }
  };

  return (
    <Button
      title={item.label}
      icon={ButtonIcon ? <ButtonIcon label={item.label || ''} /> : undefined}
      onClick={onClick}
      tooltipContent={item.tooltip}
    >
      {item.label}
    </Button>
  );
};

export const ExtensionsPlaceholder = (props: Props) => {
  const { node, editorView, extensionProvider, separator } = props;
  const [extensions, setExtensions] = useState<ExtensionManifest<any>[]>([]);
  useEffect(() => {
    if (extensionProvider) {
      getExtensions();
    }
    async function getExtensions() {
      setExtensions(await extensionProvider.getExtensions());
    }
    // leaving dependencies array empty so that this effect runs just once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extensionItems = React.useMemo(() => {
    return getContextualToolbarlItemsFromModule(extensions, node);
  }, [extensions, node]);

  if (!extensionItems.length) {
    return null;
  }

  // ButtonGroup wraps each child with another layer
  // but count fragment as 1 child, so here we create the children manually.
  const children: JSX.Element[] = [];
  if (separator && ['start', 'both'].includes(separator)) {
    children.push(<Separator />);
  }
  extensionItems.forEach((item: any, index) => {
    children.push(
      <ExtensionButton node={node} item={item} editorView={editorView} />,
    );
    if (index < extensionItems.length - 1) {
      children.push(<Separator />);
    }
  });
  if (separator && ['end', 'both'].includes(separator)) {
    children.push(<Separator />);
  }

  return <ButtonGroup children={children} />;
};
