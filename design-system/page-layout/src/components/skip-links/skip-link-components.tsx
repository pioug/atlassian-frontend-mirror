/** @jsx jsx */
import {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';

import { css, jsx } from '@emotion/core';

import { easeOut, prefersReducedMotion } from '@atlaskit/motion';
import { N30A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { PAGE_LAYOUT_CONTAINER_SELECTOR } from '../../common/constants';
import { SkipLinkData, useSkipLinks } from '../../controllers';

import { SkipLinkWrapperProps } from './types';

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const prefersReducedMotionStyles = css(prefersReducedMotion());

const skipLinkStyles = css({
  margin: 10,
  padding: '0.8rem 1rem',
  position: 'fixed',
  zIndex: -1,
  left: -999999,
  background: token('elevation.surface.overlay', 'white'),
  border: 'none',
  borderRadius: 3,
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 0 0 1px ${N30A}, 0 2px 10px ${N30A}, 0 0 20px -4px ${N60A}`,
  ),
  opacity: 0,

  /* Do the transform when focused */
  transform: 'translateY(-50%)',
  transition: `transform 0.3s ${easeOut}`,

  ':focus-within': {
    /**
     * Max z-index is 2147483647. Skip links always be on top,
     * but giving a few digits extra space just in case there's a future need.
     */
    zIndex: 2147483640,
    left: 0,
    opacity: 1,
    transform: 'translateY(0%)',
  },
});

const skipLinkListStyles = css({
  marginTop: 4,
  paddingLeft: 0,
  listStylePosition: 'outside',
  listStyleType: 'none',
});

const skipLinkListItemStyles = css({ marginTop: 0 });

const assignIndex = (num: number, arr: number[]): number => {
  if (!arr.includes(num)) {
    return num;
  }

  return assignIndex(num + 1, arr);
};
export const SkipLinkWrapper = ({ skipLinksLabel }: SkipLinkWrapperProps) => {
  const { skipLinksData } = useSkipLinks();

  if (skipLinksData.length === 0) {
    return null;
  }

  const sortSkipLinks = (arr: SkipLinkData[]) => {
    const customLinks = arr.filter((link: SkipLinkData) =>
      Number.isInteger(link.listIndex),
    );

    if (customLinks.length === 0) {
      return arr;
    }

    const usedIndexes = customLinks.map((a) => a.listIndex) as number[];
    const regularLinksWithIdx = arr
      .filter((link) => link.listIndex === undefined)
      .map((link, idx, currArr) => {
        const listIndex = assignIndex(idx, usedIndexes);
        usedIndexes.push(listIndex);

        return {
          ...link,
          listIndex,
        };
      });

    return [...customLinks, ...regularLinksWithIdx].sort(
      (a, b) => a.listIndex! - b.listIndex!,
    );
  };

  const escapeHandler = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      const container = document.querySelector(
        `[${PAGE_LAYOUT_CONTAINER_SELECTOR}="true"]`,
      ) as HTMLElement;
      if (container !== null) {
        container.focus();
      }
    }
  };

  const attachEscHandler = () =>
    window.addEventListener('keydown', escapeHandler, false);

  const removeEscHandler = () =>
    window.removeEventListener('keydown', escapeHandler, false);

  return (
    <div
      onFocus={attachEscHandler}
      onBlur={removeEscHandler}
      css={[skipLinkStyles, prefersReducedMotionStyles]}
      data-skip-link-wrapper
    >
      <h5>{skipLinksLabel}</h5>
      <ol css={skipLinkListStyles}>
        {sortSkipLinks(skipLinksData).map(
          ({ id, skipLinkTitle }: SkipLinkData) => (
            <SkipLink
              key={id}
              href={`#${id}`}
              isFocusable
              title={`${skipLinksLabel} ${skipLinkTitle}`}
            >
              {skipLinkTitle}
            </SkipLink>
          ),
        )}
      </ol>
    </div>
  );
};

const handleBlur = (event: ReactMouseEvent | ReactKeyboardEvent) => {
  // @ts-ignore
  event.target.removeAttribute('tabindex');
  // @ts-ignore
  event.target.removeEventListener('blur', handleBlur);
};

const focusTargetRef = (href: string) => (
  event: ReactMouseEvent | ReactKeyboardEvent,
) => {
  event.preventDefault();
  const targetRef = document.querySelector(href);

  // @ts-ignore
  const key = event.which || event.keycode;
  // if it is a keypress and the key is not
  // space or enter, just ignore it.
  if (key && key !== 13 && key !== 32) {
    return;
  }

  if (targetRef) {
    targetRef.setAttribute('tabindex', '-1');
    // @ts-ignore
    targetRef.addEventListener('blur', handleBlur);
    // @ts-ignore
    targetRef.focus();
    document.activeElement &&
      document.activeElement.scrollIntoView({
        behavior: 'smooth',
      });
    window.scrollTo(0, 0);
  }

  return false;
};

export const SkipLink = ({
  href,
  children,
  isFocusable,
  title,
}: {
  href: string;
  children: ReactNode;
  isFocusable: boolean;
  title: string;
}) => {
  return (
    <li css={skipLinkListItemStyles}>
      <a
        tabIndex={isFocusable ? 0 : -1}
        href={href}
        onClick={focusTargetRef(href)}
        title={title}
      >
        {children}
      </a>
    </li>
  );
};
