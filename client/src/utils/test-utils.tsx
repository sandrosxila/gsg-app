// test-utils.jsx
import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
// Import your own reducer
import rootReducer, { RootState } from '../reducers';

type Params = {
    preloadedState?: RootState;
    store?: ReturnType<typeof createStore>;
} & RenderOptions

function render(
    ui: Parameters<typeof rtlRender>[0],
    {
        preloadedState,
        store = createStore(rootReducer, preloadedState),
        ...renderOptions
    }: Params = {}
) {
    const Wrapper: React.FC = ({ children }) => {
        return <Provider store={ store }>{children}</Provider>;
    };
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };