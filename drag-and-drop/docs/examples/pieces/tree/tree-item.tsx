/** @jsx jsx */

import {
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';

import {
  Instruction,
  ItemMode,
} from '@atlaskit/drag-and-drop-hitbox/experimental/tree-item';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import FocusRing from '@atlaskit/focus-ring';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import { token } from '@atlaskit/tokens';

import { TreeItem as TreeItemType } from '../../data/tree';

import { indentPerLevel } from './constants';
import { DependencyContext, TreeContext } from './tree-context';

const iconColor = token('color.icon', '#44546F');

function ChildIcon() {
  return (
    <svg aria-hidden={true} width={24} height={24} viewBox="0 0 24 24">
      <circle cx={12} cy={12} r={2} fill={iconColor} />
    </svg>
  );
}

function GroupIcon({ isOpen }: { isOpen: boolean }) {
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;
  return <Icon label="" primaryColor={iconColor} />;
}

function Icon({ item }: { item: TreeItemType }) {
  if (!item.children.length) {
    return <ChildIcon />;
  }
  return <GroupIcon isOpen={item.isOpen ?? false} />;
}

const outerButtonStyles = css({
  '--grid': '8px',
  /**
   * Without this Safari renders white text on drag.
   */
  color: token('color.text', 'currentColor'),

  border: 0,
  width: '100%',
  position: 'relative',
  background: 'transparent',
  margin: 0,
  padding: 0,
});

const outerHoverStyles = css({
  ':hover': {
    cursor: 'pointer',
  },

  ':hover > *': {
    background: token(
      'color.background.neutral.subtle.hovered',
      'rgba(9, 30, 66, 0.06)',
    ),
  },
});

const innerDraggingStyles = css({
  opacity: 0.5,
  background: token(
    'color.background.neutral.subtle.hovered',
    'rgba(9, 30, 66, 0.06)',
  ),
});

const innerButtonStyles = css({
  padding: 'var(--grid)',
  alignItems: 'center',
  // display: 'grid',
  // gap: 4,
  // gridTemplateColumns: 'auto 1fr auto',
  display: 'flex',
  flexDirection: 'row',

  background: token('color.background.neutral.subtle', 'transparent'),
  // background: 'red',
  borderRadius: 3,
});

const idStyles = css({
  margin: 0,
  color: token('color.text.disabled', '#8993A5'),
});

const labelStyles = css({
  flexGrow: 1,
  overflow: 'hidden',
  textAlign: 'left',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const debugStyles = css({
  position: 'absolute',
  right: 'var(--grid)',
  bottom: 0,
  fontSize: '6px',
});

const previewStyles = css({
  // re-declaring variable for the portal as it will have a different parent in the DO
  '--grid': '8px',
  // so we don't cause the page to reflow
  position: 'absolute',
  display: 'flex',
  // padding: "var(--grid)"
  // offsets inner element
  // in Chrome and Safari we could use `padding`:
  // padding: 'var(--grid)',
  // But it does not work in Firefox which trims the padding (or inner margin)
  // Using a transparent border works in all browsers
  borderLeft: 'calc(var(--grid) * 2) solid transparent',
  borderTop: 'var(--grid) solid transparent',
});
const previewInnerStyles = css({
  background: token('elevation.surface.raised', 'red'),
  padding: 'var(--grid)',
  borderRadius: 3,
});

const reparentingToStyles = css({
  background: token('color.background.selected.hovered', 'transparent'),
});

function createPreview({ item }: { item: TreeItemType }): {
  element: HTMLElement;
  cleanup: () => void;
} {
  const element = document.createElement('div');
  document.body.appendChild(element);
  ReactDOM.render(
    <div css={previewStyles}>
      <span css={previewInnerStyles}>Item {item.id}</span>
    </div>,
    element,
  );
  function cleanup() {
    ReactDOM.unmountComponentAtNode(element);
    document.body.removeChild(element);
  }
  return { element, cleanup };
}

function delay({
  waitMs: timeMs,
  fn,
}: {
  waitMs: number;
  fn: () => void;
}): () => void {
  let timeoutId: number | null = window.setTimeout(() => {
    timeoutId = null;
    fn();
  }, timeMs);
  return function cancel() {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}

const TreeItem = memo(function TreeItem({
  item,
  mode,
  level,
}: {
  item: TreeItemType;
  mode: ItemMode;
  level: number;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [state, setState] = useState<
    'idle' | 'dragging' | 'preview' | 'reparenting-to'
  >('idle');
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const cancelExpandRef = useRef<(() => void) | null>(null);

  const { dispatch, uniqueContextId, getPathToItem } = useContext(TreeContext);
  const { DropIndicator, attachInstruction, extractInstruction } =
    useContext(DependencyContext);
  const toggleOpen = useCallback(() => {
    dispatch({ type: 'toggle', itemId: item.id });
  }, [dispatch, item]);

  const cancelExpand = useCallback(() => {
    cancelExpandRef.current?.();
    cancelExpandRef.current = null;
  }, []);

  const clearReparentingToState = useCallback(() => {
    setState(current => {
      if (current === 'reparenting-to') {
        return 'idle';
      }
      return current;
    });
  }, []);

  useEffect(() => {
    invariant(buttonRef.current);
    let cleanupPreview: null | (() => void) = null;

    return combine(
      draggable({
        element: buttonRef.current,
        getInitialData: () => ({
          id: item.id,
          type: 'tree-item',
          isOpenOnDragStart: item.isOpen,
          uniqueContextId,
        }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const preview = createPreview({ item });
          nativeSetDragImage?.(preview.element, 0, 0);
          cleanupPreview = preview.cleanup;
          // setState('preview');
        },
        onDragStart: ({ source }) => {
          cleanupPreview?.();
          cleanupPreview = null;
          setState('dragging');
          // collapse open items during a drag
          if (source.data.isOpenOnDragStart) {
            dispatch({ type: 'collapse', itemId: item.id });
          }
        },
        onDrop: ({ source }) => {
          cleanupPreview?.();
          cleanupPreview = null;
          setState('idle');
          if (source.data.isOpenOnDragStart) {
            dispatch({ type: 'expand', itemId: item.id });
          }
        },
      }),
      dropTargetForElements({
        element: buttonRef.current,
        getData: ({ input, element }) => {
          const data = { id: item.id };

          return attachInstruction(data, {
            input,
            element,
            indentPerLevel,
            currentLevel: level,
            mode,
            block: item.isDraft ? ['make-child'] : [],
          });
        },
        canDrop: ({ source }) =>
          source.data.type === 'tree-item' &&
          source.data.uniqueContextId === uniqueContextId,
        getIsSticky: () => true,
        onDrag: ({ self, source }) => {
          const instruction = extractInstruction(self.data);

          if (source.data.id !== item.id) {
            // expand after 500ms if still merging
            if (
              instruction?.type === 'make-child' &&
              item.children.length &&
              !item.isOpen &&
              !cancelExpandRef.current
            ) {
              cancelExpandRef.current = delay({
                waitMs: 500,
                fn: () => dispatch({ type: 'expand', itemId: item.id }),
              });
            }
            if (instruction?.type !== 'make-child' && cancelExpandRef.current) {
              cancelExpand();
            }

            setInstruction(instruction);
            return;
          }
          if (instruction?.type === 'reparent') {
            setInstruction(instruction);
            return;
          }
          setInstruction(null);
        },
        onDragLeave: () => {
          cancelExpand();
          setInstruction(null);
        },
        onDrop: () => {
          cancelExpand();
          setInstruction(null);
        },
      }),
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === uniqueContextId,
        onDrag({ location }) {
          // TODO: tidy up
          const target = location.current.dropTargets[0];

          if (!target) {
            clearReparentingToState();
            return;
          }

          const instruction = extractInstruction(target.data);
          if (instruction?.type !== 'reparent') {
            clearReparentingToState();
            return;
          }
          const targetId = target.data.id;
          invariant(typeof targetId === 'string');
          const path = getPathToItem(targetId);
          const parentId = path[instruction.desiredLevel];
          if (parentId !== item.id) {
            clearReparentingToState();
            return;
          }
          setState('reparenting-to');
        },
        onDrop() {
          clearReparentingToState();
        },
      }),
      () => {
        cleanupPreview?.();
        cleanupPreview = null;
      },
    );
  }, [
    dispatch,
    item,
    mode,
    level,
    cancelExpand,
    uniqueContextId,
    extractInstruction,
    attachInstruction,
    getPathToItem,
    clearReparentingToState,
  ]);

  useEffect(
    function mount() {
      return function unmount() {
        cancelExpand();
      };
    },
    [cancelExpand],
  );

  const aria = (() => {
    if (!item.children.length) {
      return undefined;
    }
    return {
      'aria-expanded': item.isOpen,
      'aria-controls': `tree-item-${item.id}--subtree`,
    };
  })();

  return (
    <Fragment>
      <FocusRing isInset>
        <button
          {...aria}
          css={[
            outerButtonStyles,
            state === 'idle' ? outerHoverStyles : undefined,
          ]}
          id={`tree-item-${item.id}`}
          onClick={toggleOpen}
          ref={buttonRef}
          type="button"
          style={{ paddingLeft: level * indentPerLevel }}
        >
          <span
            css={[
              innerButtonStyles,
              state === 'dragging'
                ? innerDraggingStyles
                : state === 'reparenting-to'
                ? reparentingToStyles
                : undefined,
            ]}
          >
            <Icon item={item} />
            <span css={labelStyles}>Item {item.id}</span>
            <small css={idStyles}>
              {item.isDraft ? <code>Draft</code> : null}
              <code css={debugStyles}>({mode})</code>
            </small>
          </span>
          {instruction ? <DropIndicator instruction={instruction} /> : null}
        </button>
      </FocusRing>
      {item.children.length && item.isOpen ? (
        <div id={aria?.['aria-controls']}>
          {item.children.map((child, index, array) => {
            const childType: ItemMode = (() => {
              if (child.children.length && child.isOpen) {
                return 'expanded';
              }

              if (index === array.length - 1) {
                return 'last-in-group';
              }

              return 'standard';
            })();
            return (
              <TreeItem
                item={child}
                key={child.id}
                level={level + 1}
                mode={childType}
              />
            );
          })}
        </div>
      ) : null}
    </Fragment>
  );
});
export default TreeItem;
