// backup real global Date object
// @ts-ignore
const _Date = global.Date;

export default {
  setToday: function setToday(today: Date = new Date()) {
    // @ts-ignore
    function MockDate(y, m, d, h, M, s, ms) {
      let returnDate;

      switch (arguments.length) {
        case 0:
          returnDate = new _Date(today);
          break;

        case 1:
          returnDate = new _Date(y);
          break;

        default:
          returnDate = new _Date(
            y,
            m,
            typeof d === 'undefined' ? 1 : d,
            h || 0,
            M || 0,
            s || 0,
            ms || 0,
          );
          break;
      }

      return returnDate;
    }

    MockDate.UTC = _Date.UTC;

    MockDate.now = function now() {
      // @ts-ignore
      return new MockDate().valueOf();
    };

    MockDate.parse = function parse(dateString: string) {
      return _Date.parse(dateString);
    };

    MockDate.prototype = _Date.prototype;
    // @ts-ignore
    global.Date = MockDate;
  },

  reset: function reset() {
    // @ts-ignore
    global.Date = _Date;
  },
};
