/** @jsx jsx */
import {
  CSSProperties,
  Fragment,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { CodeBlock } from '@atlaskit/code';
import { draggable } from '@atlaskit/drag-and-drop/adapter/element';
import { cancelUnhandled } from '@atlaskit/drag-and-drop/util/cancel-unhandled';
import { disableNativeDragPreview } from '@atlaskit/drag-and-drop/util/disable-native-drag-preview';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import battery from './icons/battery.png';
import cloud from './icons/cloud.png';
import drill from './icons/drill.png';
import koala from './icons/koala.png';
import ui from './icons/ui.png';
import wallet from './icons/wallet.png';
import yeti from './icons/yeti.png';
import { fallbackColor } from './util/fallback';
import { GlobalStyles } from './util/global-styles';

// The list example we have here was lifted from
// packages/design-system/menu/examples/menu.tsx
const iconStyles = css({
  height: 'calc(var(--grid) * 3)',
  width: 'calc(var(--grid) * 3)',
  borderRadius: 'var(--border-width)',
});
function Icon({ src, alt }: { src: string; alt: string }) {
  return <img alt={alt} src={src} css={iconStyles} />;
}
const Menu = memo(function Menu() {
  return (
    <MenuGroup>
      <Section title="Starred">
        <ButtonItem
          iconBefore={<Icon src={yeti} alt={'Yeti'} />}
          description="Next-gen software project"
        >
          Navigation System
        </ButtonItem>
        <ButtonItem
          iconBefore={<Icon src={drill} alt={'Drill'} />}
          description="Next-gen service desk"
        >
          Analytics Platform
        </ButtonItem>
      </Section>
      <Section title="Recent">
        <ButtonItem
          iconBefore={<Icon src={battery} alt={'Battery'} />}
          description="Next-gen software project"
        >
          Fabric Editor
        </ButtonItem>
        <ButtonItem
          iconBefore={<Icon src={cloud} alt={'Cloud'} />}
          description="Classic business project"
        >
          Content Services
        </ButtonItem>
        <ButtonItem
          iconBefore={<Icon src={wallet} alt={'Wallet'} />}
          description="Next-gen software project"
        >
          Trinity Mobile
        </ButtonItem>
        <ButtonItem
          iconBefore={<Icon src={koala} alt={'Koala'} />}
          description="Classic service desk"
        >
          Customer Feedback
        </ButtonItem>
        <ButtonItem
          iconBefore={<Icon src={ui} alt={'UI icon'} />}
          description="Classic software project"
        >
          Design System
        </ButtonItem>
      </Section>
      <Section hasSeparator>
        <ButtonItem>View all projects</ButtonItem>
        <ButtonItem>Create project</ButtonItem>
      </Section>
    </MenuGroup>
  );
});

const sidebarStyles = css({
  width: 'var(--local-width)',
  flexShrink: '0',
  flexGrow: '0',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
});

const sidebarContentStyles = css({
  flexGrow: '1',
  flexShrink: '1',
  width: 'var(--local-width)',
});

// Quite a large draggable area,
// but the line itself is fairly small
const sidebarDividerStyles = css({
  width: 'calc(var(--grid) * 4)',
  cursor: 'ew-resize',
  flexGrow: '0',
  flexShrink: '0',
  position: 'relative',
  background: 'transparent',

  '::before': {
    background: token('color.border.brand', fallbackColor),
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 'var(--border-width)',
  },
});

// Preventing items getting :hover effects during a drag
const noPointerEventsStyles = css({
  pointerEvents: 'none',
});

type State =
  | {
      type: 'idle';
      width: number;
    }
  | {
      type: 'dragging';
      startedFromWidth: number;
      width: number;
    };

const widths = {
  start: 260,
  min: 150,
  max: 450,
};

function Sidebar() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>({
    type: 'idle',
    width: widths.start,
  });

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        // we will be moving the line to indicate a drag
        // we can disable the native drag preview
        disableNativeDragPreview({ nativeSetDragImage });
        // we don't want any native drop animation for when the user
        // does not drop on a drop target. we want the drag to finish immediately
        cancelUnhandled.start();
      },
      onDragStart() {
        setState(current => ({
          type: 'dragging',
          startedFromWidth: current.width,
          width: current.width,
        }));
      },
      onDrag({ location }) {
        setState(state => {
          if (state.type !== 'dragging') {
            return state;
          }
          const diffX =
            location.current.input.clientX - location.initial.input.clientX;
          const proposed = state.startedFromWidth + diffX;

          const width = Math.min(Math.max(widths.min, proposed), widths.max);

          return {
            ...state,
            width,
          };
        });
      },
      onDrop() {
        cancelUnhandled.stop();
        setState(current => ({ type: 'idle', width: current.width }));
      },
    });
  }, []);

  return (
    <div css={sidebarStyles}>
      <div
        css={[
          sidebarContentStyles,
          state.type === 'dragging' ? noPointerEventsStyles : undefined,
        ]}
        style={{ '--local-width': `${state.width}px` } as CSSProperties}
      >
        <Menu />
      </div>
      <div css={sidebarDividerStyles} ref={ref}></div>
    </div>
  );
}

const stackStyles = css({
  // It would be great if we had a `Stack` component :)
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '> *': {
    paddingTop: 'calc(var(--grid) * 2)',
  },
});

function Content() {
  return (
    <div css={stackStyles}>
      <h2>Code review</h2>
      <div>
        <CodeBlock language="tsx" text="console.log('hello world');" />
      </div>
    </div>
  );
}

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',
  width: 600,
  border: `var(--border-width) solid ${token('color.border', fallbackColor)}`,
  borderRadius: 'var(--border-radius)',
  margin: 'calc(var(--grid) * 2) auto',
});

export default function Container() {
  return (
    <Fragment>
      <GlobalStyles />
      <div css={containerStyles}>
        <Sidebar />
        <Content />
      </div>
    </Fragment>
  );
}
