import { useRef, useLayoutEffect } from 'react';

/**
 * A custom hook that handles focus and scroll.
 * Takes in boolean values and calls element.focus and/or element.scroll.
 *
 * @param {boolean} focus
 * @param {boolean?} scroll - optional
 *
 * Example usage:
 *
 *    const SearchBar = ({ focus }) => {
 *      const ref = useRefToFocusOrScroll(focus);
 *      return <input ref={ref} />
 *    }
 *
 *    const ItemList = ({ items, focus, scroll }) => (
 *       <ul>
 *        {items.map((item, index) => (
 *          <Item key={item.uuid} item={item} focus={focus} scroll={scroll} />
 *        ))}
 *       </ul>
 *     );
 *
 *    const Item = ({ item, focus, scroll }) => {
 *      const ref = useRefToFocusOrScroll(focus, scroll);
 *      return (
 *        <li ref={ref}>
 *          {item.name}
 *        </li>
 *      )
 *    }
 *
 */

type ScrollIntoViewIfNeeded = {
  scrollIntoViewIfNeeded: (center?: boolean) => void;
};

type RefType =
  | null
  | (HTMLInputElement & ScrollIntoViewIfNeeded)
  | (HTMLDivElement & ScrollIntoViewIfNeeded);

export default function useRefToFocusOrScroll(
  focus: boolean,
  scroll?: boolean,
) {
  const ref = useRef<RefType>(null);

  useLayoutEffect(() => {
    const { current } = ref;
    if (current && document.activeElement !== current) {
      if (focus) {
        current.focus({ preventScroll: true });
      }
      if (scroll) {
        scrollIntoViewIfNeeded(current);
      }
    }
  }, [focus, scroll]);

  return ref;
}

/**
 * For browsers that don't support scrollIntoViewIfNeeded
 *
 * @param {HTMLElement} element
 *
 * If not using the above useRefToFocusOrScroll hook,
 * you can manually useEffect with this function to scrollIntoViewIfNeeded.
 *
 * Example usage:
 *
 *    const ItemList = ({ items, scroll }) => (
 *       <ul>
 *        {items.map((item, index) => (
 *          <Item key={item.uuid} item={item} scroll={scroll} />
 *        ))}
 *       </ul>
 *     );
 *
 *    const Item = ({ item, scroll }) => {
 *      const ref = useRef();
 *
 *      useEffect(() => {
 *        if (ref.current) {
 *          scrollIntoViewIfNeeded(ref.current);
 *        }
 *      },[scroll])
 *
 *      return (
 *        <li ref={ref}>
 *          {item.name}
 *        </li>
 *      )
 *    }
 * }
 */

function scrollIntoViewIfNeeded(
  element: HTMLDivElement & {
    scrollIntoViewIfNeeded: (center: boolean) => void;
  },
): void {
  if (element.scrollIntoViewIfNeeded) {
    return element.scrollIntoViewIfNeeded(false);
  } else if (element.scrollIntoView) {
    return element.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
    });
  }
}
