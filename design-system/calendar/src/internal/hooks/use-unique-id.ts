import { useUIDSeed } from 'react-uid';

export default function useUniqueId(prefix: string) {
  const seed = useUIDSeed();

  return `${prefix}-${seed(prefix)}`;
}
