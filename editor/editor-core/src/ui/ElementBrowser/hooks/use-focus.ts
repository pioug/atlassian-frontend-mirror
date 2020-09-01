import { useRef, useLayoutEffect } from 'react';

/**
 * A custom hook that handles focus on a DOM element.
 * Takes in a boolean value and calls element.focus
 *
 * @param {boolean} focus
 *
 * Example usage:
 *******************************************************************************
 *    const SearchBar = ({ focus }) => {
 *      const ref = useFocus(focus);
 *      return <input ref={ref} />
 *    }
 *******************************************************************************
 *    const ItemList = ({ items, focus }) => (
 *       <ul>
 *        {items.map((item, index) => (
 *          <Item key={item.uuid} item={item} focus={focus} />
 *        ))}
 *       </ul>
 *     );
 *
 *    const Item = ({ item, focus }) => {
 *      const ref = useFocus(focus);
 *      return (
 *        <li ref={ref}>
 *          {item.name}
 *        </li>
 *      )
 *    }
 *******************************************************************************
 */

type RefType = null | HTMLInputElement | HTMLDivElement;

export default function useFocus(focus: boolean) {
  const ref = useRef<RefType>(null);

  useLayoutEffect(() => {
    const { current } = ref;
    if (focus && current && document.activeElement !== current) {
      current.focus({ preventScroll: true });
    }
  }, [focus]);

  return ref;
}
