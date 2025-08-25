/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

const isTriangular = (num: number) => {
	if (num < 0) {
		return false;
	}

	let sum = 0;
	for (let n = 1; sum <= num; n++) {
		sum = sum + n;
		if (sum === num) {
			return true;
		}
	}

	return false;
};

const nextPrime = (n: number): number => {
	let candidate = n + 1;
	while (!isPrime(candidate)) {
		candidate++;
	}
	return candidate;
};

const isPrime = (num: number) => {
	if (num <= 1) {
		return false;
	}
	for (let i = 2; i < num; i++) {
		if (num % i === 0) {
			return false;
		}
	}
	return true;
};

const invisibleStyles = css({
	width: '400px',
	height: '300px',
	backgroundColor: 'blue',
	position: 'absolute',
	visibility: 'hidden',
});

const mainStyles = css({
	minWidth: '100vw',
	minHeight: '100vh',
	maxHeight: '100vh',
	backgroundColor: '#c0c2c23d',
	display: 'grid',
	gridTemplateAreas: `
    "header   header"
    "sidenav  content"
  `,
	gridTemplateColumns: '200px 1fr', // Sidebar width and content width
	gridTemplateRows: 'auto 1fr', // Header height and content height
	gridColumnGap: '0px',
	gridRowGap: '0px',
});

const headerStyle = css({
	gridArea: 'header',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '10px',
	backgroundColor: '#f0f0f0',
});

const inputStyle = css({
	width: '80%',
	padding: '10px',
	fontSize: '16px',
});

const sidebarStyle = css({
	gridArea: 'sidenav',
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: '#e0e0e0',
	padding: '10px',
	overflowY: 'auto',
});

const buttonStyle = css({
	border: 'none',
	borderRadius: '4px',
	padding: '10px',
	marginBottom: '5px',
	cursor: 'pointer',
});

const triangularButtonStyle = css({
	borderColor: '#D496A7',
	borderStyle: 'solid',
	borderWidth: '2px',
});

const contentStyle = css({
	gridArea: 'content',
	overflowY: 'auto',
	padding: '10px',
	backgroundColor: '#fff',
});

const contentDivStyle = css({
	backgroundColor: '#f9f9f9',
	padding: '20px',
	marginBottom: '10px',
	borderRadius: '4px',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

const randomNames = [
	'Aretha Franklin',
	'Stevie Wonder',
	'Whitney Houston',
	'Michael Jackson',
	'Beyoncé',
	'Prince',
	'Marvin Gaye',
	'Nina Simone',
	'Ray Charles',
	'Ella Fitzgerald',
];

const primeContentDivStyle = css({
	backgroundColor: '#e0f7fa',
	borderColor: '#00796b',
	borderStyle: 'solid',
	borderWidth: '2px',
});

const InvibibleStuff = (props: { name: string }) => {
	return (
		<div css={invisibleStyles} data-testid={`invisbile-stuff__${props.name}`}>
			You should not see me
		</div>
	);
};

const SectionContent = ({ isLoading }: { isLoading: boolean }) => {
	const [toRender, setToRender] = useState(0);

	useEffect(() => {
		if (isLoading) {
			return;
		}

		let i = 0;
		let n = 0;
		let id: NodeJS.Timeout;
		const triggerNextUpdate = () => {
			id = setTimeout(() => {
				if (n >= 100 || i > 100) {
					return;
				}

				i = nextPrime(i);
				n = Math.min(n + i, 100);

				setToRender(n + 1);
				(window as any).__editor_metrics_tests_tick?.call();

				requestAnimationFrame(() => {
					triggerNextUpdate();
				});
			}, 200);
		};

		triggerNextUpdate();
		return () => {
			clearTimeout(id);
		};
	}, [isLoading]);

	if (isLoading) {
		return (
			<div id="no-content-yet" data-testid="fake-loading-no-content">
				LOADING...
			</div>
		);
	}

	return (
		<div
			data-testid="dynamic-content"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			className="slow-content-section"
		>
			<InvibibleStuff name="after-fake-loading" />
			{[...Array.from({ length: toRender }).keys()].map((i) => (
				<div
					key={i}
					css={[contentDivStyle, isPrime(i) && primeContentDivStyle]}
					data-content
					data-testid={`content-${i}`}
					data-is-prime={isPrime(i)}
				>
					Content Div {i + 1}
				</div>
			))}
		</div>
	);
};

const SideButton = ({
	name,
	index,
	onFinished,
}: {
	index: number;
	name: string;
	onFinished: (i: number) => void;
}) => {
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const forceLayoutShift = isTriangular(index);

	useEffect(() => {
		if (!forceLayoutShift || !buttonRef.current) {
			return;
		}

		const timeoutId = setTimeout(() => {
			if (!buttonRef.current) {
				return;
			}

			// yes, forced layout reflow for test purposes
			const rect = buttonRef.current.getBoundingClientRect();
			const height = rect.height;

			const heightToIncrease = 1 + index / 10;

			buttonRef.current.style.height = `${height * heightToIncrease}px`;

			(window as any).__editor_metrics_tests_tick?.call();
			setTimeout(() => {
				onFinished(index);
			}, 200);
		}, 200 * index);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [index, forceLayoutShift, onFinished]);

	if (forceLayoutShift) {
		return (
			<button
				data-testid={`side-button-${index}`}
				ref={buttonRef}
				css={[buttonStyle, triangularButtonStyle]}
			>
				{name}
			</button>
		);
	}

	return (
		<button data-testid={`side-button-${index}`} css={buttonStyle}>
			{name}
		</button>
	);
};

export default function Example() {
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const onButtonFinished = useCallback((i: number) => {
		if (i < 6) {
			return;
		}
		requestAnimationFrame(() => {
			(window as any).__editor_metrics_tests_tick?.call();
			setIsLoading(false);
		});
	}, []);

	return (
		<main id="app-main" data-testid="app-wrapper" css={mainStyles}>
			<header data-testid="app-header" css={headerStyle}>
				<input
					type="text"
					css={inputStyle}
					placeholder="Type here..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
			</header>
			<aside data-testid="app-side-nav" css={sidebarStyle}>
				{randomNames.map((name, index) => (
					// Ignored via go/ees005
					// eslint-disable-next-line react/no-array-index-key
					<SideButton key={index} name={name} index={index} onFinished={onButtonFinished} />
				))}
			</aside>
			<section data-testid="app-content" css={contentStyle}>
				<InvibibleStuff name="before-fake-loading" />
				<h1>My content go here</h1>
				<SectionContent isLoading={isLoading} />
			</section>
		</main>
	);
}
