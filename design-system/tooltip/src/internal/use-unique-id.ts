import { useUIDSeed } from 'react-uid';

export default function useUniqueId(prefix: string, shouldRenderId: boolean) {
  const seed = useUIDSeed();

  return shouldRenderId ? `${seed(prefix)}` : undefined;
}
