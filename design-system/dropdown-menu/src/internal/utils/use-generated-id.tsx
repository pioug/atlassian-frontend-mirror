import { useRef } from 'react';

const PREFIX = 'ds--dropdown--';
const generateRandomString = () =>
  // This string is used only on client side usually triggered after a user interaction.
  // Therefore, so there is no risk of mismatch
  // between server and client generated markup.
  // eslint-disable-next-line @repo/internal/react/disallow-unstable-values
  `${PREFIX}${Math.random().toString(16).substr(2, 8)}`;

/**
 * useGeneratedId generates a random string which remains constant across
 * renders when called without any parameter.
 */
export default function useGeneratedId() {
  const cachedId = useRef(generateRandomString());

  return cachedId.current;
}
