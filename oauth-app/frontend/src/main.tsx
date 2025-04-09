import ThemeContextProvider from './context/ThemeContext.tsx';
import { createRoot } from 'react-dom/client';
import App from './App';
createRoot(document.getElementById('root')!).render(
	<>
		<ThemeContextProvider>
			<App />
		</ThemeContextProvider>
	</>
);