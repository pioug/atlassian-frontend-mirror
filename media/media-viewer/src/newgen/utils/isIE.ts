export const isIE = (navigator: Navigator = window.navigator) => {
  return (
    navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.appVersion.indexOf('Trident/') > 0
  );
};
