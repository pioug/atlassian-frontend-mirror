import simultaneousPlayManager from '../../customMediaPlayer/simultaneousPlayManager';

class DummyVideo {
  pause = jest.fn();

  constructor() {
    this.pause = jest.fn();
    simultaneousPlayManager.subscribe(this);
  }
  play() {
    simultaneousPlayManager.pauseOthers(this);
  }
  unsubscribe() {
    simultaneousPlayManager.unsubscribe(this);
  }
}

describe('Simultaneous Play Manager', () => {
  it('should pause all subscribed players, but the current playing one', () => {
    const videoOne = new DummyVideo();
    const videoTwo = new DummyVideo();
    const videoThree = new DummyVideo();

    videoOne.play();

    expect(videoOne.pause).not.toBeCalled();
    expect(videoTwo.pause).toBeCalledTimes(1);
    expect(videoThree.pause).toBeCalledTimes(1);
  });

  it('should not pause unsubscribed players', () => {
    const videoOne = new DummyVideo();
    const videoTwo = new DummyVideo();
    const videoThree = new DummyVideo();

    videoTwo.unsubscribe();
    videoOne.play();

    expect(videoOne.pause).not.toBeCalled();
    expect(videoTwo.pause).not.toBeCalled();
    expect(videoThree.pause).toBeCalledTimes(1);
  });

  it('should subscribe players only once', () => {
    const videoOne = new DummyVideo(); // Subscribes
    simultaneousPlayManager.subscribe(videoOne); // tries to subscribe again

    simultaneousPlayManager.pauseOthers({ pause: () => {} });
    expect(videoOne.pause).toBeCalledTimes(1);
  });
});
