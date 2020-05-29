import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/ToastContext';
import getValidationErros from '../../utils/getValidationErros';
import { AnimationContainer, Background, Container, Content } from './style';
import api from '../../services/api';


interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {

    const [loading, setLoading] = useState(false)

    const formRef = useRef<FormHandles>(null);


    const { addToast } = useToast();

    const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
        try {

            setLoading(true);

            formRef.current?.setErrors({});
            const shema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido')
            })

            await shema.validate(data, { abortEarly: false });

            await api.post('/password/forgot', {
                email: data.email
            });

            addToast({
                type: 'success',
                title: "E-mail de recuperação enviado",
                description: "Enviamos um e-mail para confirmar a recuperação de senha, cheque a caixa de entrada"
            });

        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const erros = getValidationErros(err);
                formRef.current?.setErrors(erros);
                return;
            }

            addToast({
                type: 'error', 
                title:'Erro na recuperação de senha', 
                description: 'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.' 
            });
            
        } finally {
            setLoading(false);
        }
    }, [addToast]);
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />

                    <Form onSubmit={handleSubmit} ref={formRef}>
                        <h1>Recuperar senha</h1>


                        <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />
                        
                        
                        <Button loading={loading} type="submit">Recuperar</Button>

                    </Form>

                    <Link to="/"><FiLogIn /> Voltar ao login </Link>

                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    )
};

export default ForgotPassword;