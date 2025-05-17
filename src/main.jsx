import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import { Yuphook } from './Yuphook.jsx'


createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
		<Yuphook />
	</StrictMode>,
)
