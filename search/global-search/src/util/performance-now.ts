export default (window.performance &&
  window.performance.now.bind(performance)) ||
  Date.now;
