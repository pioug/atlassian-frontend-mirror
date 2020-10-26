// START: temporary code https://product-fabric.atlassian.net/browse/ED-10260
export const shouldForceTracking = (): boolean => {
  try {
    const { FRONTEND_VERSION = '' } = (window as any).__buildInfo || {};
    return (
      window.location.hostname === 'product-fabric.atlassian.net' &&
      FRONTEND_VERSION.includes('branch-deploy')
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
    return false;
  }
};
// END:  temporary code  https://product-fabric.atlassian.net/browse/ED-10260
