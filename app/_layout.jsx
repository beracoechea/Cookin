import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {

     async getToken (key) {
      try{
        const item = await SecureStore.getItemAsync(key)
        if(item){
          console.log('${key} was used \n')
        }else{
          console.log('no values stored under key: '+ key)
        }
        return item
      }catch (error){
        console.error('SecureStore',error)
        await SecureStore.deleteItemAsync(key)
        return null
      }
  
},
async saveToken(key , value){
  try{
    return SecureStore.setItemAsync(key,value)
  }catch(err){
    return
  }
}
}
export default function RootLayout() {


  useFonts({
    'outfit':require('../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium':require('../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold':require('../assets/fonts/Outfit-Bold.ttf'),

  })
  return(
    <ClerkProvider
     tokenCache={tokenCache}
     publishableKey={publishableKey}
    
     >  
    <Stack>
      <Stack.Screen name="index" options={{
          title: 'Home',
          headerShown: false,}}/>
      <Stack.Screen name="(tabs)"
      options={{
        headerShown:false,
      }}/>
      <Stack.Screen name="carga/index"
      options={{
        headerShown:false,
      }}/>

      
    </Stack>
    </ClerkProvider>

  )
}
