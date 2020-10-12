export type Reason = {
  name: string;
  status?: number;
};

export function errorToReason(error: any): Reason {
  const { name = 'Unknown', status = undefined } = error || {};

  return {
    name,
    status,
  };
}
