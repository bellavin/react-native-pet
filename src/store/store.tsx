import {createContext, useContext} from 'react';
import FileStore from './main-screen-file-data';

export default class RootStore {
  fileStore: FileStore;

  constructor() {
    this.fileStore = new FileStore(this);
  }
}

const StoreContext = createContext(new RootStore());

type StoreProvider = {
  children: JSX.Element;
  store: RootStore;
};

export const StoreProvider = ({
  children,
  store,
}: StoreProvider): JSX.Element => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);

// export const withStore = (Component: JSX.Element) => props =>
//   <Component {...props} store={useStore()} />;
