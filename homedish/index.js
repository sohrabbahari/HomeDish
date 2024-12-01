import { registerRootComponent } from 'expo';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function ReduxApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

registerRootComponent(ReduxApp);
