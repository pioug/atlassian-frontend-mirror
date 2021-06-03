/** @jsx jsx */
import {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';

import { jsx } from '@emotion/core';

import { PAGE_LAYOUT_CONTAINER_SELECTOR } from '../../common/constants';
import { SkipLinkData, useSkipLinks } from '../../controllers';

import { skipLinkStyles } from './styles';
import { SkipLinkWrapperProps } from './types';

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
      css={skipLinkStyles}
      data-skip-link-wrapper
    >
      <h5>{skipLinksLabel}</h5>
      <ol>
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
    <li>
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
