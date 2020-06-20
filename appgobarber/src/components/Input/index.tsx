import { useField } from '@unform/core';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TextInputProps } from 'react-native';
import { Container, Icon, TextInput } from './styles';



interface InputProps extends TextInputProps {
    name: string;
    icon: string;
    containerStyle?: {};
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.RefForwardingComponent<InputRef,InputProps> = ({ name, icon, containerStyle, ...rest }, ref) => {

    const inputElementRef = useRef<any>(null);

    const { registerField, defaultValue = '', fieldName, error} = useField(name);
    
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue});

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);
        setIsFilled(!! inputValueRef.current.value);

    }, []);

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus();
        }
    }));

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref:any, value: string) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({text: value});
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear()
            }
        })
    }, [registerField, fieldName])

    return (
        <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
            <Icon name={icon} size={20} color={isFocused || isFilled ? '#ff9000' : '#666360'} />
            <TextInput
                {...rest}
                ref={inputElementRef}
                placeholderTextColor="#666360"
                keyboardAppearance="dark"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChangeText={(value) => {
                    inputValueRef.current.value = value
                }}
            />
        </Container>

    )
}
    ;

export default forwardRef(Input);