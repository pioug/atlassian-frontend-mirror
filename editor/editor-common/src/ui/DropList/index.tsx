/** @jsx jsx */
import { Component, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { DN50, DN600, N0, N50A, N60A, N900 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import Layer from '../Layer';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

const halfFocusRing = 1;
const dropOffset = `0, ${gridSize()}px`;

interface Props extends WithAnalyticsEventsProps {
  isOpen?: boolean;
  trigger?: typeof Component;
  position: string;
  onOpenChange?: (event: OpenChangedEvent) => void;
  onPositioned?: () => void;
  testId?: string;
  shouldFitContainer: boolean;
  children?: ReactNode;
}

type childContextTypes = {
  shouldAllowMultilineItems: boolean;
};

export type OpenChangedEvent = {
  isOpen: boolean;
  event: MouseEvent | KeyboardEvent;
};

class DropList extends Component<Props> {
  private dropContentRef?: HTMLDivElement;
  private triggerRef?: HTMLDivElement;

  private wrapperStyles = css`
    ${this.props.shouldFitContainer
      ? 'display: block; flex: 1 1 auto;'
      : 'display: inline-flex;'}
    transition-duration: 0.2s;
    transition: box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
  `;

  private triggerStyles = css`
    transition-duration: 0.2s;
    transition: box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
    ${this.props.shouldFitContainer
      ? 'display: block; box-sizing: border-box;'
      : 'display: inline-flex;'}
  `;

  /* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
  private menuWrapper = (theme: ThemeProps) => {
    return css`
      color: ${themed({
        light: token('color.text', N900),
        dark: token('color.text', DN600),
      })(theme)};
      background-color: ${themed({
        light: token('elevation.surface.overlay', N0),
        dark: token('elevation.surface.overlay', DN50),
      })(theme)};
      border-radius: ${borderRadius()}px;
      box-shadow: 0 ${gridSize() / 2}px ${gridSize()}px -${gridSize() / 4}px ${N50A},
        0 0 1px ${N60A};
      box-sizing: border-box;
      overflow: auto;
      padding: ${gridSize() / 2}px 0;
      max-height: 90vh;
    `;
  };
  /* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

  getChildContext(): childContextTypes {
    return { shouldAllowMultilineItems: false };
  }

  componentDidMount = () => {
    this.setContentWidth();
    // We use a captured event here to avoid a radio or checkbox dropdown item firing its
    // click event first, which would cause a re-render of the element and prevent DropList
    // from detecting the actual source of this original click event.
    document.addEventListener('click', this.handleClickOutside, true);
    document.addEventListener('keydown', this.handleEsc);
  };

  componentDidUpdate = () => {
    if (this.props.isOpen) {
      this.setContentWidth();
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClickOutside, true);
    document.removeEventListener('keydown', this.handleEsc);
  };

  setContentWidth = () => {
    const { dropContentRef, triggerRef } = this;
    const { shouldFitContainer } = this.props;

    // We need to manually set the content width to match the trigger width
    if (shouldFitContainer && dropContentRef && triggerRef) {
      dropContentRef.style.width = `${
        triggerRef.offsetWidth - halfFocusRing * 2
      }px`;
    }
  };

  handleEsc = (event: KeyboardEvent) => {
    if ((event.key === 'Escape' || event.key === 'Esc') && this.props.isOpen) {
      this.close(event);
    }
  };

  handleClickOutside = (event: MouseEvent) => {
    if (this.props.isOpen) {
      if (event.target instanceof Node) {
        // Rather than check for the target within the entire DropList, we specify the trigger/content.
        // This aids with future effort in scroll-locking DropList when isMenuFixed is enabled; the scroll
        // blanket which stretches to the viewport should not stop 'close' from being triggered.
        const withinTrigger =
          this.triggerRef && this.triggerRef.contains(event.target);
        const withinContent =
          this.dropContentRef && this.dropContentRef.contains(event.target);

        if (!withinTrigger && !withinContent) {
          this.close(event);
        }
      }
    }
  };

  close = (event: MouseEvent | KeyboardEvent) => {
    if (this.props.onOpenChange) {
      this.props.onOpenChange({ isOpen: false, event });
    }
  };

  handleContentRef = (ref: HTMLDivElement) => {
    this.dropContentRef = ref;

    // If the dropdown has just been opened, we focus on the containing element so the
    // user can tab to the first dropdown item. We will only receive this ref if isOpen
    // is true or null, so no need to check for truthiness here.
    if (ref) {
      ref.focus();
    }
  };

  handleTriggerRef = (ref: HTMLDivElement) => {
    this.triggerRef = ref;
  };

  render() {
    const {
      children,
      isOpen,
      position,
      trigger,
      onPositioned,
      testId,
    } = this.props;

    let layerContent = isOpen ? (
      <div
        css={(theme: ThemeProps) => this.menuWrapper({ theme: theme })}
        data-role="droplistContent"
        data-testid={testId && `${testId}--content`}
        ref={this.handleContentRef}
      >
        {children}
      </div>
    ) : null;

    return (
      <div css={this.wrapperStyles}>
        <Layer
          content={layerContent}
          offset={dropOffset}
          position={position}
          onPositioned={onPositioned}
        >
          <div css={this.triggerStyles} ref={this.handleTriggerRef}>
            {trigger}
          </div>
        </Layer>
      </div>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'droplist',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onOpenChange: createAndFireEventOnAtlaskit({
      action: 'toggled',
      actionSubject: 'droplist',

      attributes: {
        componentName: 'droplist',
        packageName,
        packageVersion,
      },
    }),
  })(DropList),
);
