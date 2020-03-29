const canUseDOM = () =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );

const supportsVoiceOver = () =>
  /Mac OS X/.test(canUseDOM() ? navigator.userAgent : '');

export default supportsVoiceOver;
