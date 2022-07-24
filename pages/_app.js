import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { MetamaskProvider } from '../context/metamask';

function MyApp({ Component, pageProps }) {
  return(
    <MetamaskProvider>
      <Component {...pageProps} />
    </MetamaskProvider>
  )
}

export default MyApp
