import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/ToastContext';
import api from '../../services/api';
import getValidationErros from '../../utils/getValidationErros';
import { AnimationContainer, Background, Container, Content } from './style';

interface SignUpFromData {
    name: string;
    email: string;
    password: string;
}


const SignUp: React.FC = () => {

    const formRef = useRef<FormHandles>(null);

    const {addToast} = useToast();

    const history = useHistory();
    const handleSubmit = useCallback(async (data: SignUpFromData) => {
        try {
            formRef.current?.setErrors({});
            const shema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos')
            })

            await shema.validate(data, { abortEarly: false });

            await api.post('/users', data);

            addToast({
                title: 'Cadastro realizado com sucesso',
                description: 'Você já pode fazer seu login no GoBarber!',
                type: 'success'
            })
            
            history.push('/');

        } catch (err) {
            if(err instanceof Yup.ValidationError){
                const erros = getValidationErros(err)
                formRef.current?.setErrors(erros)
                return;
            }

            addToast({
                title: 'Error no cadastro',
                description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
                type: 'error'
            })

        }
    }, [addToast, history]);

    return (
        <Container>
            <Background />
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <h1>Faça seu cadastro</h1>

                        <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
                        <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

                        <Button type="submit">Cadastar</Button>

                    </Form>

                    <Link to="/"> <FiArrowLeft /> Voltar para logon </Link>
                </AnimationContainer>
            </Content>

        </Container>
    )
};

export default SignUp;