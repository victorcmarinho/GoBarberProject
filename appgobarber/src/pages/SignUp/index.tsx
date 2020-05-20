import { useNavigation } from '@react-navigation/native';
import { Form, FormHandles } from '@unform/core';
import React, { useCallback, useRef } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';
import getValidationErros from '../../utils/getValidationErros';
import { BackToSignInButton, BackToSignInButtonText, Container, Title } from './styles';

interface SignUpFromData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const formEmailRef = useRef<TextInput>(null);
    const formPasswordRef = useRef<TextInput>(null);
    
    const navigation = useNavigation();

    const handleSignUp = useCallback(async (data: SignUpFromData) => {
        try {
            formRef.current?.setErrors({});
            const shema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos')
            })

            await shema.validate(data, { abortEarly: false });

            await api.post('/users', data);
            Alert.alert('Cadastro realizado com sucesso', 'Você já pode realizar o login na aplicação')

            navigation.goBack();

        } catch (err) {
            if(err instanceof Yup.ValidationError){
                const erros = getValidationErros(err)
                formRef.current?.setErrors(erros)
                return;
            }
            Alert.alert(
                'Error no cadastro',
                'Ocorreu um erro ao fazer cadastro, tente novamente.',
            );

        }
    }, []);


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
                            <Title>Crie sua conta</Title>
                        </View>
                        <Form ref={formRef} onSubmit={handleSignUp}>
                            <Input 
                                autoCapitalize="words"
                                name="name" 
                                icon="user" 
                                placeholder="Nome"
                                returnKeyType="next"
                                onSubmitEditing={() => formEmailRef.current?.focus()}
                            />
                            <Input
                                ref={formEmailRef}
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                name="email" 
                                icon="mail" 
                                placeholder="E-mail"
                                returnKeyType="next"
                                onSubmitEditing={() => formPasswordRef.current?.focus()}
                            />
                            <Input
                                ref={formPasswordRef}
                                name="password" 
                                icon="lock" 
                                placeholder="Senha"
                                secureTextEntry
                                returnKeyType="send"
                                onSubmitEditing={() => formRef.current?.submitForm()}
                            />
                            <Button onPress={() => formRef.current?.submitForm()}>Entrar</Button>
                        </Form>
                    </Container>
                    <BackToSignInButton onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={20} color="#fff" />
                        <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
                    </BackToSignInButton>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    )
}

export default SignUp;