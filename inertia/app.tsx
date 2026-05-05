import './css/app.css'
import { ReactElement } from 'react'
import { client } from './client'
import AppLayout from '~/layouts/AppLayout'
import { LanguageProvider } from '~/context/language'
import { Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'Dorker'

createInertiaApp({
  title: (title) => (title ? `${title} — ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) => <AppLayout>{page}</AppLayout>
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <LanguageProvider>
          <App {...props} />
        </LanguageProvider>
      </TuyauProvider>
    )
  },
  progress: {
    color: '#00d4ff',
  },
})
