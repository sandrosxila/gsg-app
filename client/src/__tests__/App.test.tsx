import React from 'react';
import { Routes } from 'react-router-dom';
import * as ShallowRenderer from 'react-test-renderer/shallow';
import App from '../App';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: () => mockDispatch
}));

describe('<App/>', () => {
    let renderer: ShallowRenderer.ShallowRenderer;
    let result: React.ReactElement;
    

    beforeAll(() => {
        renderer = ShallowRenderer.createRenderer();
    });

    beforeEach(() => {
        renderer.render(<App />);
        result = renderer.getRenderOutput();
    });

    test('renders Routes', () => {
        expect(result).not.toBeNull();
        expect(result.type).toBe(Routes);
    });

});

