import { useNavigation } from '@react-navigation/native';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import React, { useCallback, useRef } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import getValidationErros from '../../utils/getValidationErros';
import { Container, CreateAccountButton, CreateAccountButtonText, ForgotPassword, ForgotPasswordText, Title } from './styles';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {

    const navigation = useNavigation();
    const { signIn } = useAuth()
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const handleSignIn = useCallback(async (data: SignInFormData) => {
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

            // history.push('/dashboard');

        } catch (err) {
            if(err instanceof Yup.ValidationError) {
                const erros = getValidationErros(err);
                formRef.current?.setErrors(erros);
                return;
            }

            Alert.alert(
                'Erro na autenticação', 
                'Ocorreu um erro ao fazer login, cheque as credenciais'
            );
        }
    }, [signIn]);


    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1 }}
                >

                    <Container>
                        <Image source={logoImg} />
                        <View>
                            <Title>Faça seu logon</Title>
                        </View>
                        <Form onSubmit={handleSignIn} ref={formRef} >
                            <Input 
                                name="email" 
                                icon="mail" 
                                placeholder="E-mail"
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus()
                                }}
                            />
                            <Input 
                                ref={passwordInputRef}
                                name="password" 
                                icon="lock" 
                                placeholder="Senha"
                                secureTextEntry
                                returnKeyType="send"
                                onSubmitEditing={() => {
                                    formRef.current?.submitForm();
                                }}
                            />
                            <Button
                                onPress={() => {
                                    formRef.current?.submitForm();
                                }}
                            >
                                Entrar
                        </Button>
                        </Form>

                        <ForgotPassword>
                            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                    <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
                        <Icon name="log-in" size={20} color="#ff9000" />
                        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
                    </CreateAccountButton>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default SignIn;