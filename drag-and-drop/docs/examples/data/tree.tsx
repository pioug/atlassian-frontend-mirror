import type { Edge } from '@atlaskit/drag-and-drop-hitbox/experimental/tree';

type Node = {
  id: string;
  label?: string;
};

export type TreeNode = Node & {
  // type: 'tree';
  children: TreeData;
  isOpen: boolean;
};

export type LeafNode = Node;

export type TreeItemData = TreeNode | LeafNode;

export type TreeData = TreeItemData[];

export function getInitialData(): TreeData {
  return [
    {
      id: 'A',
      isOpen: false,
      children: [{ id: 'A1' }, { id: 'A2' }, { id: 'A3' }],
    },
    { id: 'B' },
    { id: 'C' },
  ];
}

export type TreeAction =
  | {
      type: Extract<Edge, 'top'>;
      itemId: string;
      targetId: string;
    }
  | {
      type: Extract<Edge, 'bottom'>;
      itemId: string;
      targetId: string;
    }
  | {
      type: Extract<Edge, 'child'>;
      itemId: string;
      targetId: string;
    }
  | {
      type: 'toggle';
      itemId: string;
    }
  | {
      type: 'expand';
      itemId: string;
    }
  | {
      type: 'collapse';
      itemId: string;
    };

export const tree = {
  remove(data: TreeData, id: string): TreeData {
    return data
      .filter(item => item.id !== id)
      .map(item => {
        if (tree.hasChildren(item)) {
          return {
            ...item,
            children: tree.remove(item.children, id),
          };
        }
        return item;
      });
  },
  insertBefore(
    data: TreeData,
    targetId: string,
    newItem: TreeItemData,
  ): TreeData {
    return data.flatMap(item => {
      if (item.id === targetId) {
        return [newItem, item];
      }
      if (tree.hasChildren(item)) {
        return {
          ...item,
          children: tree.insertBefore(item.children, targetId, newItem),
        };
      }
      return item;
    });
  },
  insertAfter(
    data: TreeData,
    targetId: string,
    newItem: TreeItemData,
  ): TreeData {
    return data.flatMap(item => {
      if (item.id === targetId) {
        return [item, newItem];
      }

      if (tree.hasChildren(item)) {
        return {
          ...item,
          children: tree.insertAfter(item.children, targetId, newItem),
        };
      }

      return item;
    });
  },
  insertChild(
    data: TreeData,
    targetId: string,
    newItem: TreeItemData,
  ): TreeData {
    return data.flatMap(item => {
      if (item.id === targetId) {
        const children = tree.hasChildren(item) ? item.children : [];
        return { ...item, isOpen: true, children: [newItem, ...children] };
      }

      if (!tree.hasChildren(item)) {
        return item;
      }

      return {
        ...item,
        children: tree.insertChild(item.children, targetId, newItem),
      };
    });
  },
  find(data: TreeData, itemId: string): TreeItemData | undefined {
    for (const item of data) {
      if (item.id === itemId) {
        return item;
      }

      if (tree.hasChildren(item)) {
        const result = tree.find(item.children, itemId);
        if (result !== undefined) {
          return result;
        }
      }
    }
  },
  hasChildren(item: TreeItemData): item is TreeNode {
    return 'children' in item;
  },
  children(item: TreeItemData): TreeData {
    return tree.hasChildren(item) ? item.children : [];
  },
};

export const dataReducer = (data: TreeData, action: TreeAction) => {
  console.log(action);

  const item = tree.find(data, action.itemId);
  if (!item) {
    return data;
  }

  switch (action.type) {
    case 'top': {
      data = tree.remove(data, action.itemId);
      data = tree.insertBefore(data, action.targetId, item);
      return data;
    }

    case 'bottom': {
      data = tree.remove(data, action.itemId);
      data = tree.insertAfter(data, action.targetId, item);
      return data;
    }

    case 'child': {
      data = tree.remove(data, action.itemId);
      data = tree.insertChild(data, action.targetId, item);
      return data;
    }

    case 'toggle': {
      const toggle = (item: TreeItemData): TreeItemData => {
        if (!tree.hasChildren(item)) {
          return item;
        }

        if (item.id === action.itemId) {
          return { ...item, isOpen: !item.isOpen };
        }

        return { ...item, children: item.children.map(toggle) };
      };

      const result = data.map(toggle);
      console.log(data, result);
      return result;
    }

    case 'expand': {
      if (tree.hasChildren(item)) {
        item.isOpen = true;
      }
      return [...data];
    }

    case 'collapse': {
      if (tree.hasChildren(item)) {
        item.isOpen = false;
      }
      return [...data];
    }

    default:
      return data;
  }
};
