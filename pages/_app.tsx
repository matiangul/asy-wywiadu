import * as Sentry from '@sentry/browser'
import LogRocket from 'logrocket'
import App from 'next/app'
import '../src/css/tailwind.css'

LogRocket.init('g02q0r/asy-wywiadu')
Sentry.init({
  dsn: 'https://1d01be2d122a4ed0bbc013898e90df81@o383352.ingest.sentry.io/5213412',
})

class MyApp extends App {
  componentDidCatch(error, errorInfo) {
    LogRocket.getSessionURL((sessionURL) => {
      Sentry.withScope((scope) => {
        scope.setExtra('sessionURL', sessionURL)
        for (const key in errorInfo) {
          scope.setExtra(key, errorInfo[key])
        }
        Sentry.captureException(error)
      })
    })

    super.componentDidCatch(error, errorInfo)
  }
}

export default MyApp
