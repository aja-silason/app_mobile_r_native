import {Image, StyleSheet, Text, View} from "react-native";
import {MapPin, Calendar as IconCalendar, Settings2, UserRoundPlus, ArrowRight  } from "lucide-react-native";
import { colors } from "@/styles/colors";

import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { useState } from "react";

const styles = StyleSheet.create({
    textColor: {
        color: colors.zinc[400]
    },
    text: {
        textDecorationLine: "underline"
    }

})

enum StepForm {
    TRIP_DETAILS = 1,
    ADD_EMAIL = 2,
}

export default function Index(){

    const [stepForm, setSepForm] = useState(StepForm.TRIP_DETAILS);

    function handleNextStepForm(){
        if(stepForm === StepForm.TRIP_DETAILS) return setSepForm(StepForm.ADD_EMAIL)
    }
    
    return (
        <View className="flex-1 items-center justify-center px-5">
            <Image source={require("../../assets/images/icon.png")} className="h-8" resizeMode="contain"/>

            <Image source={require("@/assets/bg.png")} className="absolute"/>

            <Text className="text-zinc-400 font-regular text-center text-lg mt-3">Convide seus amigos e planeje{"\n"}sua proxima viagem</Text>
            
            <View className="w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800">
                <Input>
                    <MapPin color={colors.zinc[400]} size={20}/>
                    <Input.Field placeholder="Para onde?" editable={stepForm === StepForm.TRIP_DETAILS}/>
                </Input> 
                <Input>
                    <IconCalendar color={colors.zinc[400]} size={20}/>
                    <Input.Field placeholder="Quando?" editable={stepForm === StepForm.TRIP_DETAILS }/>
                </Input>
                
                {
                    stepForm === StepForm.ADD_EMAIL && (
                        <View>
                            <View className="w-full border-b py-3 border-zinc-800">
                                <Button variant="secundary" onPress={() => setSepForm(StepForm.TRIP_DETAILS)}>
                                    <Button.Title>Alterar local/data</Button.Title>
                                    <Settings2 color={colors.zinc[200]} size={20}/>
                                </Button>
                            </View>

                            <Input>
                                <UserRoundPlus color={colors.zinc[400]} size={20}/>
                                <Input.Field placeholder="Quem estará na viagem?"/>
                            </Input>
                        </View>
                    )
                }

                <Button onPress={handleNextStepForm}>
                    <Button.Title>
                        { stepForm === StepForm.TRIP_DETAILS ? "Continuar" : "Confirmar viagem" }
                    </Button.Title>
                    <ArrowRight color={colors.lime[950]} size={20}/>
                </Button>
            </View>

            <Text className="font-regular text-center justify-center text-base" style={styles.textColor}>Ao planejar sua viagem pela plann.er você automaticamente concorda com nossos {" "} <Text style={styles.text}>termos de uso e politicas de privacidade.</Text></Text>
            
        </View>
    )
}