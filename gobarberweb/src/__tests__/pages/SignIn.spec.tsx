import React from 'react';
import SignIn from '../../pages/SignIn';
import { render, fireEvent, wait } from '@testing-library/react';


const mockedHistoryPush = jest.fn();
jest.mock('react-router-dom', () => {
    return {
        useHistory: () => ({
            push: mockedHistoryPush
        }),
        Link: ({children}: {children: React.ReactNode}) => children,
    }
});

const mockedUserAuthSignIn = jest.fn();
jest.mock('../../hooks/AuthContext', () => {
    return {
        useAuth: () => ({
            signIn: mockedUserAuthSignIn
        })
    }
});

const mockedAddToast = jest.fn();
jest.mock('../../hooks/ToastContext', () => {
    return {
        useToast: () => ({
            addToast: mockedAddToast
        })
    }
});

describe('SignIn Page', () => {


    beforeEach(() => {
        mockedHistoryPush.mockClear();
    });

    it('should be able to sign in', async () => {
        const { getByPlaceholderText, getByText } = render(<SignIn/>);
        
        const emailField = getByPlaceholderText('E-mail');
        const passwordFiled = getByPlaceholderText('Senha');
        const buttonElement = getByText('Entrar');

        fireEvent.change(emailField, {target:{value: "johndoe@example.com"}});
        fireEvent.change(passwordFiled, {target:{value: "123456"}});

        fireEvent.click(buttonElement);

        await wait(() => {expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')})

    });


    it('should not be able to sign in with invalid credentials', async () => {
        const { getByPlaceholderText, getByText } = render(<SignIn/>);
        
        const emailField = getByPlaceholderText('E-mail');
        const passwordFiled = getByPlaceholderText('Senha');
        const buttonElement = getByText('Entrar');

        fireEvent.change(emailField, {target:{value: "not-valid-email"}});
        fireEvent.change(passwordFiled, {target:{value: "123456"}});

        fireEvent.click(buttonElement);

        await wait(() => {expect(mockedHistoryPush).not.toHaveBeenCalled()})

    });


    it('should display an error if loggin fails', async () => {
        mockedUserAuthSignIn.mockImplementation(() => {throw new Error("")});

        const { getByPlaceholderText, getByText } = render(<SignIn/>);
        
        const emailField = getByPlaceholderText('E-mail');
        const passwordFiled = getByPlaceholderText('Senha');
        const buttonElement = getByText('Entrar');

        fireEvent.change(emailField, {target:{value: "johndoe@example.com"}});
        fireEvent.change(passwordFiled, {target:{value: "123456"}});

        fireEvent.click(buttonElement);

        await wait(() => {
            expect(mockedAddToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "error"
                })
            );
        });

    });
});