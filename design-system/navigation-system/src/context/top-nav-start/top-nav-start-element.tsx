import { createContext } from 'react';

export const TopNavStartElement: import('react').Context<HTMLDivElement | null> =
	createContext<HTMLDivElement | null>(null);
