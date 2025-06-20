// @ts-nocheck
import postMessage from '../../src/common/postmessage';
describe('PostMessage', function () {
	it('calls init when postmessage is triggered', function (done) {
		let called = false,
			pm = new postMessage();
		pm._messageHandlers = {
			//spies don't seem to work on this method.
			init: function () {
				called = true;
			},
		};

		pm._checkOrigin = function () {
			return true;
		};
		window.postMessage(
			{
				type: 'init',
			},
			'*',
		);

		setTimeout(function () {
			expect(called).toBe(true);
			done();
		}, 200);
	});

	it('calls the message handler', function () {
		let e = {
				data: {
					type: 'init',
				},
			},
			pm = new postMessage();
		pm._messageHandlers = {
			init: function () {},
		};
		pm._checkOrigin = function () {
			return true;
		};
		jest.spyOn(pm._messageHandlers, 'init').mockImplementation(() => {});
		pm._receiveMessage(e);
		expect(pm._messageHandlers.init).toHaveBeenCalled();
	});

	it('passes the registered extension', function (done) {
		let e = {
				data: {
					type: 'init',
					eid: 'some-id',
				},
			},
			pm = new postMessage();
		pm._registeredExtensions = {};
		pm._registeredExtensions[e.data.eid] = jest.fn();
		pm._messageHandlers = {
			init: function (event, reg) {
				expect(event).toBe(e);
				expect(reg).toBe(pm._registeredExtensions[e.data.eid]);
				done();
			},
		};

		pm._checkOrigin = function () {
			return true;
		};
		pm._receiveMessage(e);
	});
});
