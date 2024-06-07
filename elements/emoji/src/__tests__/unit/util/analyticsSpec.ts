import { withSampling } from '../../../util/analytics/samplingUfo';
import { pickerClickedEvent, ufoExperiences } from '../../../util/analytics';

const attributesForId = (emojiId: string) =>
	pickerClickedEvent({
		queryLength: 0,
		emojiId,
		category: 'PEOPLE',
		type: 'STANDARD',
		duration: 1,
	}).attributes;

const makeMatcher = (attrs: any) =>
	expect.objectContaining({
		packageName: expect.any(String),
		packageVersion: expect.any(String),
		...attrs,
		queryLength: 0,
		category: 'PEOPLE',
		type: 'STANDARD',
		duration: 1,
	});

describe('Picker clicked', () => {
	describe('SkinToneModifier', () => {
		it('should detect skin tones', () => {
			expect(attributesForId('1f3c2-1f3fb')).toEqual(
				makeMatcher({
					skinToneModifier: 'light',
					baseEmojiId: '1f3c2',
				}),
			);

			expect(attributesForId('1f9d7-1f3fc')).toEqual(
				makeMatcher({
					skinToneModifier: 'mediumLight',
					baseEmojiId: '1f9d7',
				}),
			);

			expect(attributesForId('1f939-1f3fd')).toEqual(
				makeMatcher({
					skinToneModifier: 'medium',
					baseEmojiId: '1f939',
				}),
			);

			expect(attributesForId('1f3c4-1f3fe')).toEqual(
				makeMatcher({
					skinToneModifier: 'mediumDark',
					baseEmojiId: '1f3c4',
				}),
			);

			expect(attributesForId('1f6c0-1f3ff')).toEqual(
				makeMatcher({
					skinToneModifier: 'dark',
					baseEmojiId: '1f6c0',
				}),
			);
		});
	});
});

describe('Sampling UFO experience', () => {
	test('start UFO Experience with sampling rate 1 should start successfully', () => {
		const experience = ufoExperiences['emoji-rendered'].getInstance('test-1');

		const startSpy = jest.spyOn(experience, 'start');

		withSampling(experience).start({ samplingRate: 1 });

		expect(startSpy).toHaveBeenCalled();
	});

	test('sampling rate 0 with UFO Experience should not start experience', () => {
		const experience = ufoExperiences['emoji-rendered'].getInstance('test-2');

		const startSpy = jest.spyOn(experience, 'start');

		withSampling(experience).start({ samplingRate: 0 });

		expect(startSpy).not.toHaveBeenCalled();
	});

	test('sampling rate -1 with UFO Experience should start experience', () => {
		const experience = ufoExperiences['emoji-rendered'].getInstance('test-3');

		const startSpy = jest.spyOn(experience, 'start');

		withSampling(experience).start({ samplingRate: -1 });

		expect(startSpy).toHaveBeenCalled();
	});

	test('sampling rate should not be override if same instance has already started with UFO Experience', () => {
		const experience = ufoExperiences['emoji-rendered'].getInstance('test-5');

		const startSpy = jest.spyOn(experience, 'start');
		withSampling(experience).start({ samplingRate: 1 });
		withSampling(experience).start({
			samplingRate: 0.2,
			samplingFunc: () => true,
		});

		// should only start with the first one
		expect(startSpy).toHaveBeenCalledTimes(1);
	});

	test('sampling rate 0.5 with start UFO Experience should not start 50% of instances', () => {
		const experience = ufoExperiences['emoji-rendered'];
		const instances1 = experience.getInstance('test-10');
		const instances2 = experience.getInstance('test-11');
		const instances3 = experience.getInstance('test-12');
		const instances4 = experience.getInstance('test-13');

		const startSpy1 = jest.spyOn(instances1, 'start');
		const startSpy2 = jest.spyOn(instances2, 'start');
		const startSpy3 = jest.spyOn(instances3, 'start');
		const startSpy4 = jest.spyOn(instances4, 'start');
		const successSpy1 = jest.spyOn(instances1, 'success');
		const successSpy2 = jest.spyOn(instances2, 'success');
		const successSpy3 = jest.spyOn(instances3, 'success');
		const successSpy4 = jest.spyOn(instances4, 'success');

		// make sampling func to return true/false to mimic 50% chance
		withSampling(instances1).start({
			samplingRate: 0.5,
			samplingFunc: () => true,
		});
		withSampling(instances2).start({
			samplingRate: 0.5,
			samplingFunc: () => false,
		});
		withSampling(instances3).start({
			samplingRate: 0.5,
			samplingFunc: () => true,
		});
		withSampling(instances4).start({
			samplingRate: 0.5,
			samplingFunc: () => false,
		});

		withSampling(instances1).success();
		withSampling(instances2).success();
		withSampling(instances3).success();
		withSampling(instances4).success();

		expect(startSpy1).toHaveBeenCalled();
		expect(startSpy2).not.toHaveBeenCalled();
		expect(startSpy3).toHaveBeenCalled();
		expect(startSpy4).not.toHaveBeenCalled();

		// not sampled experience should ignore success call
		expect(successSpy1).toHaveBeenCalled();
		expect(successSpy2).not.toHaveBeenCalled();
		expect(successSpy3).toHaveBeenCalled();
		expect(successSpy4).not.toHaveBeenCalled();
	});
});
