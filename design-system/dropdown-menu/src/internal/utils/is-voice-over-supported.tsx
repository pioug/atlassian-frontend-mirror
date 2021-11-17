const canUseDOM = () =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement,
  );

/*
 * Making sure we can fallback to browsers doesn't support voice over -
 * we would using menuitemcheckbox / menuitemradio for these that supports voice over, and
 * will fallback to checkbox / radio for these doesn't
 */
const isVoiceOverSupported = () =>
  /Mac OS X/.test(canUseDOM() ? navigator.userAgent : '');

export default isVoiceOverSupported;
