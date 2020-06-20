import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import ImageEditor from '@react-native-community/image-editor';

import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  BackButton,
  UserAvatar,
  UserAvatarButton,
} from './styles';
import { useAuth } from '../../hooks/auth';
import getValidationErros from '../../utils/getValidationErros';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const { goBack } = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);

          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar o seu perfil, tente novamente',
        );
      }
    },
    [goBack, updateUser],
  );

  const handleGoBack = useCallback(() => goBack(), [goBack]);

  const handleLogOut = useCallback(() => signOut(), [signOut]);

  const handleUpdateAvatar = useCallback(
    () =>
      ImagePicker.showImagePicker(
        {
          title: 'Selecione uma avatar',
          cancelButtonTitle: 'Cancelar',
          takePhotoButtonTitle: 'Usar câmera',
          chooseFromLibraryButtonTitle: 'Escolher da galeria',
        },
        async (response) => {
          if (response.didCancel) return;
          if (response.error) {
            Alert.alert('Erro ao atualizar seu avatar.');
            return;
          }

          const croppedImage = await ImageEditor.cropImage(response.uri, {
            offset: {
              x: 0,
              y: 0,
            },
            size: {
              width: 300,
              height: 300,
            },
            resizeMode: 'cover',
          });

          const data = new FormData();

          data.append('avatar', {
            type: 'image/jpeg',
            name: `${user.id}.jpg`,
            uri: croppedImage,
          });

          api
            .patch('/users/avatar', data)
            .then((apiResponse) => updateUser(apiResponse.data));
        },
      ),
    [updateUser, user.id],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu Perfil</Title>
            </View>
            <Form initialData={user} onSubmit={handleSignUp} ref={formRef}>
              <Input
                autoCapitalize="words"
                returnKeyType="next"
                name="name"
                icon="user"
                placeholder="Nome"
                onSubmitEditing={() => emailInputRef.current?.focus()}
                value={user.name}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                name="email"
                icon="mail"
                placeholder="E-mail"
                value={user.email}
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />
              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                name="old_password"
                icon="lock"
                placeholder="Senha Atual"
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                name="password"
                icon="lock"
                placeholder="Nova senha"
              />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                autoCapitalize="none"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar Senha"
              />

              <Button
                style={{ marginTop: 30 }}
                onPress={() => formRef.current?.submitForm()}
              >
                Confirmar mudanças
              </Button>
              <Button onPress={handleLogOut} style={{ marginTop: 30 }}>
                Logout
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;