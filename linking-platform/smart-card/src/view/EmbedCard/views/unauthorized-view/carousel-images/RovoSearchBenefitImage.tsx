/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
import React from 'react';

import IconSlot from './IconSlot';

type RovoSearchBenefitImageProps = {
	productIcon?: React.ReactNode;
	productIconAlt?: React.ReactNode;
	providerIcon?: React.ReactNode;
};

const RovoSearchBenefitImage = ({
	productIcon,
	productIconAlt,
	providerIcon,
}: RovoSearchBenefitImageProps): JSX.Element => {
	const productIconSlots = [178, 394, 430].map((y, i) => (
		<IconSlot key={i} icon={productIcon} x={70} y={y} w={20} h={20} />
	));

	const productIconAltSlots = [214, 286].map((y, i) => (
		<IconSlot key={i} icon={productIconAlt} x={70} y={y} w={20} h={20} />
	));

	const providerIconSlots = [106, 142, 250, 322, 358].map((y, i) => (
		<IconSlot key={i} icon={providerIcon} x={70} y={y} w={20} h={20} />
	));

	return (
		<svg
			width="100%"
			viewBox="0 0 440 660"
			preserveAspectRatio="xMidYMin meet"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clipPath="url(#clip0_3069_81)">
				<g transform="scale(1.3)">
					<rect x="44" y="42" width="417" height="465" fill="white" rx="12" />
					<path
						d="M58 106C58 101.582 61.5817 98 66 98H418C422.418 98 426 101.582 426 106V134H58V106Z"
						fill="white"
					/>
					<rect x="102" y="106" width="246" height="8" fill="#F0F1F2" />
					<rect x="102" y="118" width="161" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 134)" fill="white" />
					<rect x="102" y="142" width="316" height="8" fill="#F0F1F2" />
					<rect x="102" y="154" width="296" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 170)" fill="white" />
					<rect x="102" y="178" width="271" height="8" fill="#F0F1F2" />
					<rect x="102" y="190" width="205" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 206)" fill="white" />
					<rect x="102" y="214" width="271" height="8" fill="#F0F1F2" />
					<rect x="102" y="226" width="248" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 242)" fill="white" />
					<rect x="102" y="250" width="316" height="8" fill="#F0F1F2" />
					<rect x="102" y="262" width="182" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 278)" fill="white" />
					<rect x="102" y="286" width="271" height="8" fill="#F0F1F2" />
					<rect x="102" y="298" width="195" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 314)" fill="white" />
					<rect x="102" y="322" width="316" height="8" fill="#F0F1F2" />
					<rect x="102" y="334" width="182" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 350)" fill="white" />
					<rect x="102" y="358" width="274" height="8" fill="#F0F1F2" />
					<rect x="102" y="370" width="256" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 386)" fill="white" />
					<rect x="102" y="394" width="271" height="8" fill="#F0F1F2" />
					<rect x="102" y="406" width="214" height="8" fill="#F0F1F2" />
					<rect width="368" height="36" transform="translate(58 422)" fill="white" />
					<rect x="102" y="430" width="271" height="8" fill="#F0F1F2" />
					<rect x="102" y="442" width="126" height="8" fill="#F0F1F2" />
					<rect x="70" y="58" width="342" height="24" rx="4" fill="white" />
					<rect
						x="69.25"
						y="57.25"
						width="343.5"
						height="25.5"
						rx="4.75"
						stroke="#0B120E"
						strokeOpacity="0.14"
						strokeWidth="1.5"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M77.8472 68.4714C77.8472 72.1299 80.8177 75.0957 84.482 75.0957C85.6584 75.0957 86.7634 74.79 87.7214 74.2539L91.6268 78.153L94.153 75.6309L90.2549 71.7389C90.8036 70.7747 91.1169 69.6596 91.1169 68.4714C91.1169 64.813 88.1464 61.8472 84.482 61.8472C80.8177 61.8472 77.8472 64.813 77.8472 68.4714ZM80.399 68.4714C80.399 70.7228 82.2271 72.5479 84.482 72.5479C86.737 72.5479 88.565 70.7228 88.565 68.4714C88.565 66.2201 86.737 64.395 84.482 64.395C82.2271 64.395 80.399 66.2201 80.399 68.4714Z"
						fill="#292A2E"
					/>
					<rect x="108" y="66" width="198" height="8" fill="#F0F1F2" />
					<g clipPath="url(#clip31_3069_81)">
						<path
							d="M35.8357 129.579C35.0008 129.694 34.375 128.048 35.0662 127.581C36.0588 126.92 37.1392 126.363 38.5854 125.792C40.2727 125.235 40.814 125.428 41.9116 124.966C43.8108 124.249 46.8161 122.578 47.5437 122.164C47.6577 122.106 47.7568 122.054 47.8815 122.026C48.0009 121.983 47.9275 122.06 48.0576 122.047C48.0874 122.036 48.1077 122.046 48.1322 122.02C48.1322 122.02 48.1364 121.985 48.1459 121.964L48.1352 121.935C48.0976 121.83 48.06 121.726 48.0224 121.621C47.5828 120.633 47.0435 119.462 46.4659 118.372C45.4732 116.269 44.8557 114.974 44.5288 114.3C43.7836 112.697 43.3721 111.413 43.1151 110.09C42.9725 109.366 44.3662 108.696 44.8412 109.266C45.7034 110.304 46.4421 111.421 47.2171 113.013C47.5076 113.633 48.5172 114.752 49.4527 116.556C49.6102 116.853 49.723 117.167 49.791 117.496C50.0182 118.409 50.3522 119.384 50.6988 120.254L50.8169 120.582C50.9112 120.75 50.9703 120.914 51.0442 121.073C51.2029 121.421 51.3563 121.753 51.4893 122.076C51.7852 122.711 52.0543 123.272 52.2762 123.748C51.0485 124.223 50.3579 124.505 50.3579 124.505C50.3579 124.505 44.8596 126.602 42.533 127.489C40.9024 128.11 40.1169 128.409 39.6395 128.581C38.1825 129.122 36.996 129.431 35.8208 129.584L35.8357 129.579Z"
							fill="#292A2E"
						/>
						<path
							d="M54.5177 69.6516C56.6966 69.9462 56.4373 71.7079 54.463 71.7947C51.6442 72.0168 48.7203 72.4621 45.1893 73.7494C43.1898 74.4689 41.9686 75.0094 40.9277 75.5356C39.8813 76.0469 39.0057 76.5641 37.874 77.4938C35.9394 79.0494 33.8089 81.6529 32.4304 84.2387C31.708 85.5098 31.2524 86.8197 30.8505 87.8575C30.5501 88.9431 30.3142 89.7863 30.1948 90.2506C30.1464 90.5377 30.0831 90.8301 30.0144 91.1077C29.7116 92.0929 29.0397 94.8627 29.1889 98.4156C29.2059 100.196 29.5827 102.133 30.11 104.067C30.7118 105.974 31.4897 107.902 32.5774 109.567C33.2534 110.79 34.0589 111.764 34.7427 112.681C35.5053 113.535 36.1802 114.287 36.8121 114.919C38.1154 116.152 39.1871 116.93 39.9265 117.439C43.464 119.823 46.4962 120.99 49.5822 121.886C51.2729 122.322 51.1742 123.874 49.2656 123.769C45.8482 123.499 42.2544 122.55 38.2639 119.891C36.7798 118.857 33.2314 116.865 30.1163 112.188C29.6515 111.411 29.1419 110.651 28.8359 109.8C27.2872 106.246 26.3319 101.904 26.2161 98.4908C26.1458 97.6398 26.1472 96.8472 26.1956 96.1388C26.2441 95.4303 26.2042 94.8043 26.3022 94.2803C26.4331 93.2389 26.4989 92.6253 26.4989 92.6253C26.4989 92.6253 26.5335 92.3938 26.5891 91.9862C26.6799 91.5827 26.8214 90.9925 26.9851 90.2763C27.307 88.8291 27.9734 86.8872 28.9341 84.8731C30.7987 80.781 34.4376 76.8426 36.9422 74.9977C40.683 72.1856 42.9086 71.4859 44.1704 70.9645C48.1246 69.5418 51.4758 69.3472 54.5177 69.6516Z"
							fill="#292A2E"
						/>
					</g>
					{providerIconSlots}
					{productIconSlots}
					{productIconAltSlots}
				</g>
			</g>
			<defs>
				<clipPath id="clip0_3069_81">
					<rect width="440" height="660" fill="white" />
				</clipPath>
				<clipPath id="clip31_3069_81">
					<rect
						width="39.9619"
						height="52.68"
						fill="white"
						transform="matrix(-0.940948 0.338552 0.338552 0.940948 55.1064 67.0317)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
};

export default RovoSearchBenefitImage;
