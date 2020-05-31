import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef, FormEvent, ChangeEvent } from 'react';
import { FiArrowLeft, FiLock, FiMail, FiUser, FiCamera } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/ToastContext';
import api from '../../services/api';
import getValidationErros from '../../utils/getValidationErros';
import { Container, Content, AvatarInput } from './style';
import { useAuth } from '../../hooks/AuthContext';

interface ProfileFromData {
    name: string;
    email: string;
    old_password: string;  
    password: string;
    password_confirmation: string;

}


const Profile: React.FC = () => {

    const formRef = useRef<FormHandles>(null);

    const { user, updateUser } = useAuth();

    const { addToast } = useToast();

    const history = useHistory();
    const handleSubmit = useCallback(async (data: ProfileFromData) => {
        try {

            formRef.current?.setErrors({});

            const shema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                old_password: Yup.string(),
                password: Yup.string().when('old_password',{
                    is: val => !!val.length,
                    then: Yup.string().min(6, "Minimo 6 caracteres"),
                    otherwise: Yup.string()
                }),
                password_confirmation: Yup.string()
                .when('old_password',{
                    is: val => !!val.length,
                    then: Yup.string().required('Campo obrigatório'),
                    otherwise: Yup.string()
                })
                .oneOf(
                    [Yup.ref('password'), null],
                    'Confirmação incorreta'
                )
            });

            await shema.validate(data, { abortEarly: false });

            const { name, email, old_password, password, password_confirmation } = data;

            const formData = {
                name,
                email,
                ...(old_password ? {
                    old_password,
                    password,
                    password_confirmation
                } : {})
            };

            const response = await api.put('/profile', formData);

            updateUser(response.data);

            addToast({
                title: 'Perfil atualizado',
                description: 'Suas informações do perfil foram atualizadas com sucesso!',
                type: 'success'
            })

            history.push('/dashboard');

        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const erros = getValidationErros(err)
                formRef.current?.setErrors(erros)
                return;
            }

            addToast({
                title: 'Error na atualização',
                description: 'Ocorreu um erro ao atualizar perfil, tente novamente.',
                type: 'error'
            })

        }
    }, [addToast, history]);

    const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        
        if(e.target.files) {
            const data = new FormData();
            data.append('avatar', e.target.files[0]);

            api.patch('/users/avatar', data).then((response) => {
                updateUser(response.data);
                addToast({
                    type: 'success',
                    title: 'Avatar atualizado!'
                });
            });
        }

    }, [updateUser, addToast]);

    return (
        <Container>
            <header>
                <div>
                    <Link to="/dashboard">
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>
            <Content>

                <Form 
                    ref={formRef} 
                    initialData={{
                        name: user.name,
                        email: user.email
                    }} 
                    onSubmit={handleSubmit}
                >

                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />
                            <input type="file" name="" id="avatar" onChange={handleAvatarChange}/>
                        </label>
                    </AvatarInput>

                    <h1>Menu Perfil</h1>


                    <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
                    <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

                    <Input name="old_password" containerStyle={{ marginTop: '28px' }} icon={FiLock} type="password" placeholder="Senha atual" />
                    <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
                    <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar senha" />

                    <Button type="submit">Confirmar mudanças</Button>

                </Form>

            </Content>

        </Container>
    );
};

export default Profile;