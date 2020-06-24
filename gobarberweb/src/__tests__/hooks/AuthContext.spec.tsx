import { renderHook, act } from "@testing-library/react-hooks";
import { useAuth, AuthProvider } from "../../hooks/AuthContext";
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdapter(api);
describe('Auth Hook', () => {
    it('should be able to sign in', async () => {

        const apiResponse = {
            user: {
                id: "user123",
                name: "John Doe",
                email: "johndoe@example.com.br"
            },
            token:"123123"
        }

        apiMock.onPost('sessions').reply(200, apiResponse);

        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        result.current.signIn({
            email: 'johndoe@example.com.br',
            password: '123456'
        });

        await waitForNextUpdate();

        expect(setItemSpy).toHaveBeenCalledWith('@Gobarber:token', apiResponse.token);
        expect(setItemSpy).toHaveBeenCalledWith('@Gobarber:user', JSON.stringify(apiResponse.user));
        
        expect(result.current.user.email).toEqual('johndoe@example.com.br');

    });

    it('should restore saved data from storage when auth inits', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            switch(key) {
                case '@Gobarber:token':
                    return 'token-123';
                case '@Gobarber:user':
                    return JSON.stringify({
                        id: 'user-123',
                        name: 'John Doe',
                        email: 'johndoe@example.com.br'
                    });
                default:
                    return null;
            }
        });

        const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });
        
        expect(result.current.user.email).toEqual('johndoe@example.com.br')

    });


    it('should be able to sign out', async () => {

        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
            switch(key) {
                case '@Gobarber:token':
                    return 'token-123';
                case '@Gobarber:user':
                    return JSON.stringify({
                        id: 'user-123',
                        name: 'John Doe',
                        email: 'johndoe@example.com.br'
                    });
                default:
                    return null;
            }
        });
        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        act(() => {
            result.current.signOut();
        })

        expect(removeItemSpy).toHaveBeenCalledTimes(2);
        expect(result.current.user).toBeUndefined();

    });

    it('should be able to update user data', async() => {
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem' );
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        const user = {
            id: 'user-123',
            name: 'John Doe',
            email: 'johndoe@example.com.br',
            avatar_url: 'image-test.jpg',
            avatar: 'image-test.jpg',
            
        };

        act(() => {
            result.current.updateUser(user);
        });

        expect(setItemSpy).toHaveBeenCalledWith(
            '@Gobarber:user',
            JSON.stringify(user)
        );

        expect(result.current.user).toEqual(user);


        
    });
})