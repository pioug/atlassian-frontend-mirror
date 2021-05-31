import fetchMock from 'fetch-mock/cjs/client';
import { Client, MAX_RETRY, RETRY_STEP_IN_MILLISECONDS } from '../../client';
import { EventType, Protocol } from '../../types';

const baseUrl = 'https://bogus/pubsub';

class MockProtocol implements Protocol {
  networkUp = jest.fn();
  networkDown = jest.fn();
  getType = jest.fn();
  on = jest.fn();
  off = jest.fn();
  unsubscribeAll = jest.fn();
  subscribe = jest.fn();
  getCapabilities = jest.fn();
}

const makeAProtocol = (type: string): MockProtocol => {
  const protocol = new MockProtocol();
  protocol.getCapabilities.mockReturnValue(type);
  protocol.getType.mockReturnValue(type);
  return protocol;
};

const protocolTypeCombos = [
  ['some-protocol'],
  ['some-protocol', 'nothing'],
  ['nothing', 'some-protocol'],
];

describe('Client', () => {
  protocolTypeCombos.forEach((protocolTypes) => {
    describe(`with protocols: ${protocolTypes}`, () => {
      let client: Client;
      let protocols: MockProtocol[];
      let protocol: MockProtocol;

      beforeEach(() => {
        fetchMock.mock(`${baseUrl}/subscribe`, {
          body: {
            protocol: {
              type: 'some-protocol',
            },
          },
        });

        protocols = protocolTypes.map(makeAProtocol);
        protocol = protocols.find(
          (protocol) => protocol.getType() === 'some-protocol',
        )!;

        client = new Client(
          {
            url: baseUrl,
            product: 'STRIDE',
            featureFlags: {},
          },
          protocols,
        );
      });

      afterEach(() => {
        fetchMock.restore();
      });

      describe('#join', () => {
        it('should call remote with channels', () => {
          return client.join(['ari:cloud:platform::site/666']).then(() => {
            const lastCall = fetchMock.lastCall(`${baseUrl}/subscribe`);
            expect(lastCall).toBeDefined();

            const options: RequestInit = lastCall[1];
            const body = JSON.parse(options.body as string);
            expect(body.channels[0]).toEqual('ari:cloud:platform::site/666');
          });
        });

        it('should call subscribe on supported protocol', () => {
          return client.join(['ari:cloud:platform::site/666']).then(() => {
            expect(protocol.subscribe).toHaveBeenCalled();
          });
        });

        it('should not call subscribe again if channel already joined', () => {
          return client
            .join(['ari:cloud:platform::site/666'])
            .then(() => client.join(['ari:cloud:platform::site/666']))
            .then(() => {
              expect(protocol.subscribe).toHaveBeenCalledTimes(1);
            });
        });

        it('should debounce call to subscribe', () => {
          client.join(['ari:cloud:platform::site/666']);
          client.join(['ari:cloud:platform::site/667']);
          expect(true).toBe(true);
          return client.join(['ari:cloud:platform::site/668']).then(() => {
            expect(protocol.subscribe).toHaveBeenCalledTimes(1);

            const lastCall = fetchMock.lastCall(`${baseUrl}/subscribe`);
            expect(lastCall).toBeDefined();

            const options: RequestInit = lastCall[1];
            const body = JSON.parse(options.body as string);

            expect(body.channels.length).toEqual(3);
            expect(body.channels[0]).toEqual('ari:cloud:platform::site/666');
            expect(body.channels[1]).toEqual('ari:cloud:platform::site/667');
            expect(body.channels[2]).toEqual('ari:cloud:platform::site/668');
          });
        });

        it('should not call pubnub.subscribe if protocol is unknown', () => {
          client = new Client(
            {
              url: baseUrl,
              product: 'STRIDE',
            },
            [protocol],
          );

          fetchMock.restore();
          fetchMock.mock(`${baseUrl}/subscribe`, {
            body: {
              protocol: {
                type: 'unknown',
              },
            },
          });

          return client.join(['ari:cloud:platform::site/666']).then(() => {
            expect(protocol.subscribe).not.toHaveBeenCalled();
          });
        });
      });

      describe('#leave', () => {
        it('should call remote with remaining channels', () => {
          return client
            .join([
              'ari:cloud:platform::site/333',
              'ari:cloud:platform::site/666',
            ])
            .then(() => client.leave(['ari:cloud:platform::site/666']))
            .then(() => {
              const lastCall = fetchMock.lastCall(`${baseUrl}/subscribe`);
              expect(lastCall).toBeDefined();

              const options: RequestInit = lastCall[1];
              const body = JSON.parse(options.body as string);

              expect(body.channels.length).toEqual(1);
              expect(body.channels[0]).toEqual('ari:cloud:platform::site/333');
            });
        });

        it('should call subscribe on supported protocol', () => {
          return client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => client.leave(['ari:cloud:platform::site/666']))
            .then(() => {
              expect(protocol.subscribe).toHaveBeenCalledTimes(2);
            });
        });

        it('should not call subscribe if channel unknown', () => {
          return client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => client.leave(['ari:cloud:platform::site/668']))
            .then(() => {
              expect(protocol.subscribe).toHaveBeenCalledTimes(1);
            });
        });
        // TODO: https://product-fabric.atlassian.net/browse/FS-4183
        it.skip('should debounce call to subscribe ', () => {
          client.join([
            'ari:cloud:platform::site/666',
            'ari:cloud:platform::site/667',
          ]);
          client.leave(['ari:cloud:platform::site/666']).then(() => {
            expect(protocol.subscribe).toHaveBeenCalledTimes(1);

            const lastCall = (fetchMock.lastCall(
              `${baseUrl}/subscribe`,
            ) as any) as [Request, undefined];
            expect(lastCall).toBeDefined();

            return lastCall[0].json().then((body) => {
              expect(body.channels.length).toEqual(1);
              expect(body.channels[0]).toEqual('ari:cloud:platform::site/667');
            });
          });
        });
      });

      describe('#on', () => {
        it('should not subscribe to base events until joining channels', () => {
          expect(protocol.on).toHaveBeenCalledTimes(0);
        });

        it('should subscribe to base events after joining channels', (done) => {
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => {
              // message, access denied, network up, reconnect
              expect(protocol.on).toHaveBeenCalledTimes(4);
              expect(protocol.unsubscribeAll).toHaveBeenCalledTimes(0);
              done();
            });
        });

        it('should not unsubscribe from base events after leaving some but not all channels', (done) => {
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => client.leave(['ari:cloud:platform::site/666']))
            .then(() => {
              expect(protocol.on).toHaveBeenCalledTimes(4);
              expect(protocol.unsubscribeAll).toHaveBeenCalledTimes(0);
              done();
            });
        });

        it('should unsubscribe from base events after leaving all channels', (done) => {
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() =>
              client.leave([
                'ari:cloud:platform::site/666',
                'ari:cloud:platform::site/667',
              ]),
            )
            .then(() => {
              expect(protocol.on).toHaveBeenCalledTimes(4);
              expect(protocol.unsubscribeAll).toHaveBeenCalledTimes(1);
              done();
            });
        });

        it('should resubscribe from base events after leaving all channels and joining channels', (done) => {
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() =>
              client.leave([
                'ari:cloud:platform::site/666',
                'ari:cloud:platform::site/667',
              ]),
            )
            .then(() =>
              client.join([
                'ari:cloud:platform::site/666',
                'ari:cloud:platform::site/667',
              ]),
            )
            .then(() => {
              // 4 from first join, 4 from the second join
              expect(protocol.on).toHaveBeenCalledTimes(8);
              // 1 from the leave
              expect(protocol.unsubscribeAll).toHaveBeenCalledTimes(1);
              done();
            });
        });

        it('should receive matching events', (done) => {
          const callback = jest.fn();
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => client.on('eventName', callback))
            .then(() => {
              const handler = protocol.on.mock.calls[0][1];
              handler('eventName', {});
              expect(callback).toHaveBeenCalledTimes(1);
              done();
            });
        });

        it('should receive matching events after leaving some but not all channels', (done) => {
          const callback = jest.fn();
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => client.on('eventName', callback))
            .then(() => client.leave(['ari:cloud:platform::site/666']))
            .then(() => {
              const handler = protocol.on.mock.calls[0][1];
              handler('eventName', {});
              expect(callback).toHaveBeenCalledTimes(1);
              done();
            });
        });

        it('should not receive a matching event after leaving all channels', (done) => {
          const callback = jest.fn();
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => client.on('eventName', callback))
            .then(() =>
              client.leave([
                'ari:cloud:platform::site/666',
                'ari:cloud:platform::site/667',
              ]),
            )
            .then(() => {
              const handler = protocol.on.mock.calls[0][1];
              handler('eventName', {});
              expect(callback).toHaveBeenCalledTimes(0);
              done();
            });
        });
      });

      describe('#onAccessDenied', () => {
        beforeEach(() => {
          jest.useFakeTimers();
        });

        afterEach(() => {
          jest.useRealTimers();
        });

        it('should call subscribe', (done) => {
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => {
              const handler = protocol.on.mock.calls[1][1];
              protocol.subscribe.mockReset();

              handler(EventType.ACCESS_DENIED, {}).then(() => {
                expect(protocol.subscribe).toHaveBeenCalledTimes(1);
                done();
              });

              jest.runTimersToTime(1100);
            });

          jest.runTimersToTime(100);
        });

        it('should use exponential retry', (done) => {
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => {
              const handler = protocol.on.mock.calls[1][1];
              protocol.subscribe.mockReset();

              handler(EventType.ACCESS_DENIED, {}).then(() => {
                expect(protocol.subscribe).toHaveBeenCalledTimes(1);

                handler(EventType.ACCESS_DENIED, {}).then(() => {
                  expect(protocol.subscribe).toHaveBeenCalledTimes(2);
                  done();
                });

                jest.runTimersToTime(RETRY_STEP_IN_MILLISECONDS ** 2);
              });

              jest.runTimersToTime(1000);
            });

          jest.runTimersToTime(100);
        });

        it('should not retry indefinitely', (done) => {
          client
            .join([
              'ari:cloud:platform::site/666',
              'ari:cloud:platform::site/667',
            ])
            .then(() => {
              const handler = protocol.on.mock.calls[1][1];
              protocol.subscribe.mockReset();

              function callAccessDeniedHandler(iteration: number) {
                if (iteration > MAX_RETRY) {
                  expect(protocol.subscribe).toHaveBeenCalledTimes(MAX_RETRY);
                  done();
                } else {
                  handler(EventType.ACCESS_DENIED, {})
                    .then(() => {
                      expect(protocol.subscribe).toHaveBeenCalledTimes(
                        iteration,
                      );
                      callAccessDeniedHandler(++iteration);
                    })
                    .catch(done.fail);
                }

                jest.runTimersToTime(RETRY_STEP_IN_MILLISECONDS ** iteration);
              }

              callAccessDeniedHandler(1);
            });

          jest.runTimersToTime(100);
        });
      });
    });
  });
});
