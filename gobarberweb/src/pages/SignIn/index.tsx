import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef } from 'react';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/AuthContext';
import { useToast } from '../../hooks/ToastContext';
import getValidationErros from '../../utils/getValidationErros';
import { AnimationContainer, Background, Container, Content } from './style';


interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { signIn } = useAuth();

    const { addToast } = useToast();

    const history = useHistory();

    const handleSubmit = useCallback(async (data: SignInFormData) => {
        try {
            formRef.current?.setErrors({});
            const shema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().required('Digite uma senha')
            })

            await shema.validate(data, { abortEarly: false });

            await signIn({
                email: data.email, 
                password: data.password
            });

            history.push('/dashboard');

        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const erros = getValidationErros(err);
                formRef.current?.setErrors(erros);
                return;
            }

            addToast({
                type: 'error', 
                title:'Erro na autenticação', 
                description: 'Ocorreu um erro ao fazer login, cheque as credenciais' 
            });
            
        }
    }, [signIn, addToast, history]);
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <h1>Faça seu login</h1>


                        <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

                        <Button type="submit">Entrar</Button>


                        <a>Esqueci minha senha</a>

                    </Form>

                    <Link to="/signup"><FiLogIn /> Criar Conta </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    )
};

export default SignIn;