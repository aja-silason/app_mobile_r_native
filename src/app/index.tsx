import { useEffect, useState } from "react"
import { View, Text, Image, Keyboard, Alert, StyleSheet } from "react-native"
import {
  MapPin,
  Calendar as IconCalendar,
  Settings2,
  UserRoundPlus,
  ArrowRight,
  AtSign,
} from "lucide-react-native"
import { DateData } from "react-native-calendars"
import dayjs from "dayjs"

import { tripStorage } from "@/storage/trip"
import { tripServer } from "@/server/trip-server"

import { colors } from "@/styles/colors"
import { validateInput } from "@/utils/validateInput"
import { DatesSelected, calendarUtils } from "@/utils/calendarUtils"

import { Modal } from "@/components/modal"
import { Input } from "@/components/input"
import { Button } from "@/components/button"
import { GuestEmail } from "@/components/email"
import { Calendar } from "@/components/calendar"
import { router } from "expo-router"
import { Loading } from "@/components/loading"


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

enum MODAL {
    NONE = 0,
    CALENDAR = 1,
    GUESTS = 2
}

export default function Index(){

    //Loading
    const [isCreatingTrip, setIsCreatingTrip] = useState(false);

    //DATA
    const [stepForm, setSepForm] = useState(StepForm.TRIP_DETAILS);
    const [selectedDates, setSelectedDates] = useState({} as DatesSelected);
    const [destination, setDestination] = useState("");
    const [emailToInvite, setEmailToInvite] = useState("");
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

    //MODAL
    const [showModal, setShowModal] = useState(MODAL.NONE);

    function handleNextStepForm() {
        if (
          destination.trim().length === 0 ||
          !selectedDates.startsAt ||
          !selectedDates.endsAt
        ) {
          return Alert.alert(
            "Detalhes da viagem",
            "Preencha todos as informações da viagem para seguir."
          )
        }
    
        if (destination.length < 4) {
          return Alert.alert(
            "Detalhes da viagem",
            "O destino deve ter pelo menos 4 caracteres."
          )
        }
    
        if (stepForm === StepForm.TRIP_DETAILS) {
          return setSepForm(StepForm.ADD_EMAIL)
        }
    
        Alert.alert("Nova viagem", "Confirmar viagem?", [
          {
            text: "Não",
            style: "cancel",
          },
          {
            text: "Sim",
            onPress: createTrip,
          },
        ])
      }

    function handleSelectedDate(selectedDay: DateData){
        const dates = calendarUtils.orderStartsAtAndEndsAt({
            startsAt: selectedDates.startsAt,
            endsAt: selectedDates.endsAt,
            selectedDay,
        })
        setSelectedDates(dates)
    }

    function handleRemoveEmail(emailToRemove: string){
        setEmailsToInvite((prevState) => 
            prevState.filter((email) => email !== emailToRemove)
    )}

    function handleAddEmail(){
        if(!validateInput.email(emailToInvite)){
            return Alert.alert("Convidado", "E-mail inválido.");
        }

        const emailAlreadyExist = emailsToInvite.find((email) => email === emailToInvite)

        if(emailAlreadyExist){
            return Alert.alert("Convidado", "E-mail já foi adicionado."); 
        }

        setEmailsToInvite((prevState) => [...prevState, emailToInvite]);
        setEmailToInvite("");

    }

    async function saveTrip(tripId: string) {
        try {
          await tripStorage.save(tripId)
          router.navigate("/trip/" + tripId)
        } catch (error) {
          Alert.alert(
            "Salvar viagem",
            "Não foi possível salvar o id da viagem no dispositivo."
          )
          console.log(error)
        }
      }

      async function createTrip() {
        try {
          setIsCreatingTrip(true)
    
          const newTrip = await tripServer.create({
            destination,
            starts_at: dayjs(selectedDates.startsAt?.dateString).toString(),
            ends_at: dayjs(selectedDates.endsAt?.dateString).toString(),
            emails_to_invite: emailsToInvite,
          })
    
          Alert.alert("Nova viagem", "Viagem criada com sucesso!", [
            {
              text: "OK. Continuar.",
              onPress: () => saveTrip(newTrip.tripId),
            },
          ])
        } catch (error) {
          console.log(error)
          setIsCreatingTrip(false)
        }
      }
    
    return (
        <View className="flex-1 items-center justify-center px-5">
            <Image source={require("@/assets/logo.png")} className="h-8" resizeMode="contain"/>

            <Image source={require("@/assets/bg.png")} className="absolute"/>

            <Text className="text-zinc-400 font-regular text-center text-lg mt-3">Convide seus amigos e planeie{"\n"}sua proxima viagem</Text>
            
            <View className="w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800">
                <Input>
                    <MapPin color={colors.zinc[400]} size={20}/>
                    <Input.Field placeholder="Para onde?" editable={stepForm === StepForm.TRIP_DETAILS} onChangeText={setDestination} value={destination}/>
                </Input> 
                <Input>
                    <IconCalendar color={colors.zinc[400]} size={20}/>
                    <Input.Field placeholder="Quando?" editable={stepForm === StepForm.TRIP_DETAILS } onFocus={() => Keyboard.dismiss()} showSoftInputOnFocus={false} onPressIn={()=> stepForm === StepForm.TRIP_DETAILS && setShowModal(MODAL.CALENDAR)} value={selectedDates.formatDatesInText}/>
                </Input>
                
                {
                    stepForm === StepForm.ADD_EMAIL && (
                        <View>
                            <View className="w-full border-b py-3 border-zinc-800">
                                <Button
                                    variant="secundary"
                                    onPress={() => setSepForm(StepForm.TRIP_DETAILS)}
                                >
                                    <Button.Title>
                                        Alterar local/data
                                    </Button.Title>
                                    <Settings2
                                        color={colors.zinc[200]}
                                        size={20}
                                    />
                                </Button>
                            </View>

                            <Input>
                                <UserRoundPlus
                                    color={colors.zinc[400]}
                                    size={20}
                                />
                                <Input.Field 
                                    placeholder="Quem estará na viagem?"
                                    autoCorrect={false}
                                    value={emailsToInvite.length > 0 ? `${emailsToInvite.length} pessoas convidadas` : ""} 
                                    onPress={() => {Keyboard.dismiss, setShowModal(MODAL.GUESTS)
                                    }}
                                    showSoftInputOnFocus={false} 
                                />
                            </Input>
                        </View>
                    )
                }

                <Button onPress={handleNextStepForm} isLoading={isCreatingTrip}>
                    <Button.Title>
                        { stepForm === StepForm.TRIP_DETAILS ? "Continuar" : "Confirmar viagem" }
                    </Button.Title>
                    <ArrowRight color={colors.lime[950]} size={20}/>
                </Button>
            </View>

            <Text className="font-regular text-center justify-center text-base" style={styles.textColor}>Ao planejar sua viagem pela plann.er você automaticamente concorda com nossos {" "} <Text style={styles.text}>termos de uso e politicas de privacidade.</Text></Text>

            <Modal title="Selecionar Dados" subtitle="Selecione a data de ida e volta da viagem" visible={showModal === MODAL.CALENDAR  } onClose={() => setShowModal(MODAL.NONE)}>

                <View className="gap-4 mt-4">
                    <Calendar minDate={dayjs().toISOString()}
                    onDayPress={handleSelectedDate} markedDates={selectedDates.dates}
                    />
                    <Button onPress={() => setShowModal(MODAL.NONE)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>

            </Modal>

            <Modal title="Selecionar convidados" subtitle="os convidados irão receber e-mails para ocnfirma a participação na viagem" visible={showModal === MODAL.GUESTS} onClose={() => setShowModal(MODAL.NONE)}>

                <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
                     
                    {
                        emailsToInvite.length > 0 ? (
                            emailsToInvite.map((email) => (
                                <GuestEmail key={email} email={email} onRemove={() => handleRemoveEmail(email)}/>
                            ))
                        ) : (
                            <Text className="text-zinc-600 font-regular">Nenhum e-mail adicionado.</Text>
                        )
                    }

                </View>

                <View className="gap-4 mt-4">
                    <Input variant="secundary">
                        <AtSign color={colors.zinc[400]} size={20}/>
                        <Input.Field placeholder="Digite o e-mail do convidado" keyboardType="email-address" onChangeText={(text) => setEmailToInvite(text.toLowerCase())} value={emailToInvite} returnKeyType="send"   onSubmitEditing={handleAddEmail}/>
                    </Input>
                    <Button onPress={handleAddEmail}>
                        <Button.Title>Convidar</Button.Title>
                    </Button>
                </View>

            </Modal>
            
        </View>
    )
}
