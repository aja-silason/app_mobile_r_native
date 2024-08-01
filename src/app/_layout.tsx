import "@/styles/global.css";

import { Slot }  from "expo-router";
import { View, StatusBar } from "react-native";

import { useFonts, Inter_500Medium, Inter_400Regular, Inter_600SemiBold, } from "@expo-google-fonts/inter";
import { Loading } from "@/components/loading";

export default function Layout(){
      
      const [fontLoaded] = useFonts({
            Inter_500Medium,
            Inter_400Regular,
            Inter_600SemiBold,
      })

      if(!fontLoaded){
            return <Loading/>
      }

      return(
            <View className="flex-1 bg-zinc-950">
                  <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
                  <Slot/>
            </View>
      )
}