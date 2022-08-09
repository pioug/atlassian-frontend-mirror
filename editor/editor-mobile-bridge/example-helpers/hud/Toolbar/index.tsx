import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import WebBridgeImpl from '../../../src/editor/native-to-web';
import Button from './Button';
import Seperator from './Seperator';
import { colorPalette } from '@atlaskit/adf-schema';

interface Props {
  bridge: WebBridgeImpl;
}

interface ButtonToolbarItem {
  type: 'button';
  title?: string;
  iconName?: string;
  showTitle?: boolean;
  key?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownToolbarItem {
  type: 'dropdown';
  title?: string;
  iconName?: string;
  key?: string;
  disabled?: boolean;
  options: ToolbarMenuItem[];
}

interface ToolbarMenuItem {
  key?: string;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

interface SeperatorToolbarItem {
  type: 'separator';
}

type ToolbarItem =
  | ButtonToolbarItem
  | DropdownToolbarItem
  | SeperatorToolbarItem;

const getDefaultToolbar = (bridge: WebBridgeImpl): ToolbarItem[] => [
  {
    type: 'dropdown',
    iconName: 'EditorAddIcon',
    options: [
      {
        title: 'Insert Table',
        onClick: () => bridge.insertBlockType('table'),
      },
      {
        title: 'Insert Panel',
        onClick: () => bridge.insertBlockType('panel'),
      },
      {
        title: 'Insert Action',
        onClick: () => bridge.insertBlockType('action'),
      },
      {
        title: 'Insert Code block',
        onClick: () => bridge.insertBlockType('codeblock'),
      },
      {
        title: 'Insert Decision',
        onClick: () => bridge.insertBlockType('decision'),
      },
      {
        title: 'Insert Divider',
        onClick: () => bridge.insertBlockType('divider'),
      },
      {
        title: 'Insert Expand',
        onClick: () => bridge.insertBlockType('expand'),
      },
      {
        title: 'Insert Quote',
        onClick: () => bridge.insertBlockType('blockquote'),
      },
      {
        title: 'Insert Mention',
        onClick: () => {
          bridge.insertMentionQuery();
        },
      },
      {
        title: 'Insert Emoji',
        onClick: () => {
          bridge.insertEmojiQuery();
        },
      },
      {
        title: 'Insert Status',
        onClick: () => bridge.insertNode('status'),
      },
      {
        title: 'Insert Date',
        onClick: () => bridge.insertNode('date'),
      },
    ],
  },
  {
    iconName: 'EditorTextStyleIcon',
    type: 'dropdown',
    options: [
      {
        title: 'Normal Text',
        onClick: () => {
          bridge.onBlockSelected('normal');
        },
      },
      {
        title: 'Heading 1',
        onClick: () => {
          bridge.onBlockSelected('heading1');
        },
      },
      {
        title: 'Heading 2',
        onClick: () => {
          bridge.onBlockSelected('heading2');
        },
      },
      {
        title: 'Heading 3',
        onClick: () => {
          bridge.onBlockSelected('heading3');
        },
      },
      {
        title: 'Heading 4',
        onClick: () => {
          bridge.onBlockSelected('heading4');
        },
      },
      {
        title: 'Heading 5',
        onClick: () => {
          bridge.onBlockSelected('heading5');
        },
      },
      {
        title: 'Heading 6',
        onClick: () => {
          bridge.onBlockSelected('heading6');
        },
      },
    ],
  },
  {
    type: 'separator',
  },
  {
    type: 'button',
    iconName: 'EditorBoldIcon',
    onClick: () => bridge.onBoldClicked(),
  },
  {
    type: 'button',
    iconName: 'EditorItalicIcon',
    onClick: () => bridge.onItalicClicked(),
  },
  {
    type: 'button',
    iconName: 'EditorUnderlineIcon',
    onClick: () => bridge.onUnderlineClicked(),
  },
  {
    type: 'button',
    iconName: 'EditorStrikethroughIcon',
    onClick: () => bridge.onStrikeClicked(),
  },
  {
    type: 'button',
    iconName: 'EditorCodeIcon',
    onClick: () => bridge.onCodeClicked(),
  },
  {
    type: 'button',
    title: 'Sub',
    showTitle: true,
    onClick: () => bridge.onSubClicked(),
  },
  {
    type: 'button',
    title: 'Super',
    showTitle: true,
    onClick: () => bridge.onSuperClicked(),
  },
  {
    type: 'separator',
  },
  {
    type: 'dropdown',
    title: 'Text Color',
    options: [...colorPalette.entries()].map(([color, label]) => ({
      title: label,
      onClick: () => bridge.setTextColor(color),
    })),
  },
  {
    type: 'separator',
  },
  {
    type: 'button',
    iconName: 'EditorNumberedListIcon',
    onClick: () => bridge.onOrderedListSelected(),
  },
  {
    type: 'button',
    iconName: 'EditorBulletListIcon',
    onClick: () => bridge.onBulletListSelected(),
  },
  {
    type: 'button',
    iconName: 'EditorOutdentIcon',
    onClick: () => bridge.onOutdentList(),
  },
  {
    type: 'button',
    iconName: 'EditorIndentIcon',
    onClick: () => bridge.onIndentList(),
  },
];

const generateMenuItems = (items: ToolbarMenuItem[], bridge: WebBridgeImpl) => {
  return items.map((item) => {
    const onClick = () => item.key && bridge.performEditAction(item.key);

    return (
      <Button
        disabled={item.disabled}
        title={item.title}
        iconName={item.selected ? 'EditorSelectedIcon' : undefined}
        onClick={item.onClick || onClick}
      />
    );
  });
};

const generateToolbarItems = (
  items: ToolbarItem[] | null,
  bridge: WebBridgeImpl,
  setMenuItems: (items: {}[] | null) => void,
) => {
  if (items === null) {
    return [];
  }

  const children: ReactNode[] = [];

  for (const item of items) {
    if (item.type === 'button') {
      const onClick = () => {
        item.key && bridge.performEditAction(item.key);
      };
      children.push(
        <Button
          iconName={item.iconName}
          onClick={item.onClick || onClick}
          key={item.key}
          disabled={item.disabled}
          title={item.showTitle ? item.title : undefined}
        />,
      );
    }

    if (item.type === 'dropdown' && Array.isArray(item.options)) {
      children.push(
        <Button
          iconName={item.iconName}
          title={item.title}
          dropdown={true}
          onClick={() => {
            Array.isArray(item.options) && setMenuItems(item.options);
          }}
        />,
      );
    }

    if (item.type === 'separator') {
      children.push(<Seperator />);
    }
  }

  return children;
};

const Toolbar = ({ bridge }: Props) => {
  const [toolbarConfig, setToolbarConfig] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any>(null);

  useEffect(() => {
    (window as any).messageHandler.on(
      'onNodeSelected',
      ({ items, nodeType }: any) => {
        setMenuItems(null);
        setToolbarConfig(JSON.parse(items));
      },
    );

    (window as any).messageHandler.on('onNodeDeselected', () => {
      setMenuItems(null);
      setToolbarConfig(null);
    });
  }, []);

  const children = useMemo(() => {
    const items: JSX.Element[] = [];

    if (menuItems) {
      items.push(...generateMenuItems(menuItems, bridge));
      items.push(
        <Button
          onClick={() => setMenuItems(null)}
          iconName="EditorCloseIcon"
        />,
      );

      return items;
    } else {
      const items: JSX.Element[] = generateToolbarItems(
        getDefaultToolbar(bridge),
        bridge,
        setMenuItems,
      ) as JSX.Element[];

      const dynamic = generateToolbarItems(
        toolbarConfig,
        bridge,
        setMenuItems,
      ) as JSX.Element[];

      if (dynamic.length) {
        items.push(<Seperator />, ...dynamic);
      }

      return items;
    }
  }, [toolbarConfig, bridge, menuItems]);

  return <div style={{ display: 'flex', height: 24 }}>{children}</div>;
};

export default Toolbar;
