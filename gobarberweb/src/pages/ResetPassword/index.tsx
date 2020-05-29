import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/AuthContext';
import { useToast } from '../../hooks/ToastContext';
import getValidationErros from '../../utils/getValidationErros';
import { AnimationContainer, Background, Container, Content } from './style';
import api from '../../services/api';


interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { signIn } = useAuth();

    const { addToast } = useToast();

    const location = useLocation();

    const history = useHistory();

    const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
        try {
            formRef.current?.setErrors({});
            const shema = Yup.object().shape({
                password: Yup.string().required('Digite uma senha'),
                password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Confrimação incorreta')
                
            })

            await shema.validate(data, { abortEarly: false });

            const { password , password_confirmation } = data;

            const token = location.search.replace('?token=','');
            
            if(!token)
                throw new Error();

            await api.post('/password/reset',{
                password,
                password_confirmation,
                token
            });

            history.push('/');

        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const erros = getValidationErros(err);
                formRef.current?.setErrors(erros);
                return;
            }

            addToast({
                type: 'error', 
                title:'Erro ao resetar senha', 
                description: 'Ocorreu um erro ao resetar sua senha, tente novamente.' 
            });
            
        }
    }, [addToast, history, location.search]);
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <h1>Resetar senha</h1>


                        <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
                        <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação da senha" />

                        <Button type="submit">Alterar Senha</Button>


                    </Form>

                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    )
};

export default ResetPassword;