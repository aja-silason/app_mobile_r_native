import { createContext, useContext } from "react";

import { StyleSheet, Text, TextProps, TouchableOpacity, ActivityIndicator,TouchableOpacityProps, View } from "react-native";
import clsx from "clsx";
import { colors } from "@/styles/colors";

type Variants = "primary" | "secundary";

type ButtonProps = TouchableOpacityProps & {
    variant?: Variants,
    isLoading?: boolean
}

const ThemeContext = createContext<{variant?: Variants}>({})

const styles: any = StyleSheet.create({
    buttonCommomStyles: {
      backgroundColor: colors.lime[300],
      height: 40,
      flexDirection: 'row',
      borderRadius: 5,
      gap: 8,
      alignItems: 'center',
      justifyContent: 'center'
    },
    primary: {
        backgroundColor: colors.lime[300]
    },
    secundary: {
        backgroundColor: colors.zinc[800],
    },
    textlime950: {
        color: colors.lime[950]
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 'semibold'
    },
    buttonTextPrimary: {
      color: colors.zinc[950],
    },
    buttonTextSecundary: {
        color: colors.zinc[200],
    }

  });

function Button ({ variant = "primary", children, isLoading, ...rest}: ButtonProps){

    const buttonStyle = [styles.buttonCommomStyles];
    const lime950 = styles.textlime950;
    const text = [styles.text];

    if(variant == "primary") {
        buttonStyle.push(styles.primary);
        text.push(styles.buttonTextPrimary);
    } else if (variant == "secundary") {
        buttonStyle.push(styles.secundary);
        text.push(styles.buttonTextPrimary);
    }

    return (
        <TouchableOpacity 
            style={buttonStyle}
            disabled={isLoading}
            activeOpacity={0.7}
            {...rest}>
                <ThemeContext.Provider value={{variant}}>
                    {isLoading ? <ActivityIndicator style={lime950}/> : children}
                </ThemeContext.Provider>
        </TouchableOpacity>
    )
}

function Title({children,}: TextProps){
    const {variant} = useContext(ThemeContext);

    const text = [styles.text];

    if(variant == "primary") text.push(styles.buttonTextPrimary); 
    if (variant == "secundary") text.push(styles.buttonTextSecundary);
    
    return <Text style={text}>{children}</Text>
}

Button.Title = Title;

export { Button }