export const createLogger = (prefix: string, color: string = 'blue') => (
  msg: string,
  data: any = null,
) => {
  if ((window as any).COLLAB_PROVIDER_LOGGER) {
    // eslint-disable-next-line no-console
    console.log(
      `%cCollab-${prefix}: ${msg}`,
      `color: ${color}; font-weight: bold`,
    );
    if (data) {
      // eslint-disable-next-line no-console
      console.log(data);
    }
  }
};

export const getParticipant = (userId: string) => {
  // eslint-disable-next-line no-bitwise
  const name = 'Demo User';
  return Promise.resolve({
    userId,
    name,
    avatar: `https://api.adorable.io/avatars/80/${name.replace(/\s/g, '')}.png`,
    email: `${name.replace(/\s/g, '').toLocaleLowerCase()}@atlassian.com`,
  });
};

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
