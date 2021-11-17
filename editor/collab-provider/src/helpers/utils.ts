export const createLogger = (prefix: string, color: string = 'blue') => (
  msg: string,
  data: any = null,
) => {
  if ((window as any).COLLAB_PROVIDER_LOGGER) {
    // eslint-disable-next-line no-console
    console.log(
      `%cCollab-${prefix}: ${msg}`,
      `color: ${color}; font-weight: bold`,
      data,
    );
  }
};

const logger = createLogger('Helper:util', 'black');

export const getParticipant = (userId: string) => {
  logger('getParticipant: ', userId);
  return {
    userId: userId,
    name: userId,
    avatar: '',
    email: `${userId.replace(/\s/g, '').toLocaleLowerCase()}@atlassian.com`,
  };
};

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
