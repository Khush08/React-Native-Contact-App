import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Keyboard, AsyncStorage , Alert, TouchableWithoutFeedback, FlatList, Linking, Platform} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons, Fontisto, SimpleLineIcons  } from '@expo/vector-icons';
import { Form, Item, Input, Label, Button, Card } from 'native-base'

function ContactScreen({ navigation, props }) {
  const [data, setdata] = useState([]);
  useEffect(() => {
    navigation.addListener('focus', async() =>{
      await AsyncStorage.getAllKeys()
      .then(keys => {
        AsyncStorage.multiGet(keys)
        .then(result => {
          var datares =  result.sort(function(a, b){
            if(JSON.parse(a[1]).fname < JSON.parse(b[1]).fname){ return -1}
            if(JSON.parse(a[1]).fname > JSON.parse(b[1]).fname){ return 1}
            return 0;
          });
          setdata(datares);
          return ;
        })
        .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
    })
  },[navigation]);

  callOnNumber = phone =>{
    var phoneNumber = phone;
    if(Platform.OS !== 'android'){
      phoneNumber = `telprompt:${phone}`
    } else {
      phoneNumber = `tel:${phone}`
    }
    Linking.canOpenURL(phoneNumber)
    .then(supported =>{
      if(!supported){
        Alert.alert("Phone Number not availaible")
      } else{
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(error => console.log(error));
    
  }
  msgOnNumber = phone =>{
    var phoneNumber = phone;
    phoneNumber = `sms:${phone}`  
    Linking.canOpenURL(phoneNumber)
    .then(supported =>{
      if(!supported){
        Alert.alert("Phone Number not availaible")
      } else{
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(error => console.log(error));
    
  }
  return (
    <View style={{ flex: 1, backgroundColor : '#282A36'  }}>
      <FlatList
      data = {data}
      renderItem = { ({item}) => {
        contact = JSON.parse(item[1]);
        const phoneNum = contact.phone;
        return( 
          <View style = {styles.cardview}>
            <View>
              <TouchableOpacity
              onPress = {() => callOnNumber(phoneNum)}
              onLongPress = {()=> msgOnNumber(phoneNum)}
              >
                <View style={{flexDirection:'row'}}>
                  <View style = {styles.cardImg}>
                  <Text style = {{ color: '#282A36', fontSize: 14, letterSpacing: 2, fontWeight: 'bold' }}>{contact.fname[0]}{contact.lname[0]}</Text>
                  </View>
                  <View style={styles.info}>
                  <Text style = {{ color: 'white', marginBottom: 7, fontSize: 14, letterSpacing: 2, fontWeight: '900' }}>{contact.fname} {contact.lname}</Text>
                  <Text style = {{ color: '#61DAFB', fontSize: 10, letterSpacing: 1, fontWeight: 'bold' }}>{contact.phone}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style = {{justifyContent: 'center', alignSelf:'center'}}>
              <TouchableOpacity
              onPress = {() => navigation.navigate('ViewScreen', { key : item[0].toString()})}
              >
                <MaterialCommunityIcons name="information-variant" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        );

      }}
      keyExtractor = { (item, index) => item[0].toString() }
      />
      <TouchableOpacity 
      style={styles.floatBtn}
      onPress = { () => navigation.navigate('Add')}
      >
        <Ionicons name="ios-add" size={45} color='#61DAFB' />
      </TouchableOpacity>
    </View>
  );
}

function AddScreen({ navigation }) {

  const [fname, setfname] = useState('empty');
  const [lname, setlname] = useState('empty');
  const [phone, setphone] = useState('empty');
  const [email, setemail] = useState('empty');
  const [addr, setaddr] = useState('empty');

  _saveDetails = async () => {
    if((fname !== 'empty') && (lname !== 'empty') && (phone !== 'empty') && (email !== 'empty') && (addr !== 'empty')){
      var details = {
        fname: fname,
        lname: lname,
        phone: phone,
        email: email,
        addr: addr
      }
      await AsyncStorage.setItem( Date.now().toString(), JSON.stringify(details))
      .then(() => navigation.goBack())
      .catch(error => console.log(error));
    } else {
      Alert.alert('All Fields Required!!!!')
    }
  }
  
  return (

    <TouchableWithoutFeedback 
    onPress = { () => {Keyboard.dismiss()}}
    >
      <View style={styles.addcontainer}>
      <Form>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>First Name</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCapitalize = 'none'
          autoCompleteType = 'off'
          keyboardType = 'default'
          keyboardAppearance = 'dark'
          onChangeText = { fname => setfname(fname)}
          />
        </Item>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>Last Name</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCapitalize = 'none'
          autoCompleteType = 'off'
          keyboardType = 'default'
          keyboardAppearance = 'dark'
          onChangeText = { lname => setlname(lname)}
          />
        </Item>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>Contact Number</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCapitalize = 'none'
          autoCompleteType = 'off'
          keyboardType = 'number-pad'
          keyboardAppearance = 'dark'
          maxLength = {10}
          onChangeText = { phone => setphone(phone)}         
          />
        </Item>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>Email</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCapitalize = 'none'
          autoCompleteType = 'off'
          keyboardType = 'email-address'
          keyboardAppearance = 'dark'
          onChangeText = { email => setemail(email)}          
          />
        </Item>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>Address</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCompleteType = 'off'
          autoCapitalize = 'none'
          keyboardType = 'default'
          keyboardAppearance = 'dark'
          onChangeText = { addr => setaddr(addr)}          
          />
        </Item>
      </Form>
      <Button block style = {{ marginTop : 20, backgroundColor: '#61DAFB', marginHorizontal : 25 }}
      onPress = { () => _saveDetails()} 
      >
        <Text>Save Contact</Text>
      </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}

function ViewScreen({ navigation, route }) {
  const [fname, setfname] = useState('empty');
  const [lname, setlname] = useState('empty');
  const [phone, setphone] = useState('empty');
  const [email, setemail] = useState('empty');
  const [addr, setaddr] = useState('empty');
  const [itemKey, setkey] = useState('empty');
  useEffect(() =>{ 
    navigation.addListener('focus', () => {
      const {key} = route.params;
      setkey(`${key}`);
      _getContact(key);
    })
  },[navigation]);
  _getContact = async key =>{
    await AsyncStorage.getItem(key)
    .then(result => {
      var details = JSON.parse(result);
      setfname(details.fname);      
      setlname(details.lname);
      setphone(details.phone);
      setemail(details.email);
      setaddr(details.addr);    
    })
    .catch(error => console.log(error));
  }
  deleteContact = async () =>{
    await AsyncStorage.removeItem(`${itemKey}`)
    .then(() =>{
      navigation.navigate('Contacts')
    })
    .catch(error => console.log(error));
  }
  return (
    <View style={styles.viewcontainer}>
      <View style = {styles.viewImg}>
        <Text style = {{ color: '#fff', fontSize: 50, letterSpacing: 1}}>{fname[0]}{lname[0]}</Text>
      </View>
      <View style = {styles.viewName}>
        <Text style={{ color: '#ffffff', fontSize: 20, letterSpacing: 1}}>{fname} {lname}</Text>
      </View>
      <View style={{flexDirection : 'row', alignContent: 'flex-end', justifyContent: 'flex-end'}}>
        <TouchableOpacity 
        style = {{paddingRight: 10}}
        onPress = { () => navigation.navigate('Edit', {key : itemKey})}
        >
          <MaterialIcons name="mode-edit" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
        style = {{paddingLeft: 10}}
        onLongPress = { () => deleteContact()}
        >
          <AntDesign name="delete" size={25} color="#fff" /> 
        </TouchableOpacity>
      </View>
      <View style = {styles.emptyview}>
      </View>
      <View style = {styles.infoView}>
        <View style = {styles.infoContainer}>
          <SimpleLineIcons name="screen-smartphone" size={24} color="#61DAFB" />
          <Text style={styles.infotxt}>{phone}</Text>
        </View>
        <View style = {styles.infoContainer}>
          <Fontisto name="email" size={24} color="#61DAFB" /> 
          <Text style={styles.infotxt}>{email}</Text>
        </View>
        <View style = {styles.infoContainer}>
          <SimpleLineIcons name="location-pin" size={20} color="#61DAFB" />
          <Text style={styles.infotxt}>{addr}</Text>
        </View>
        </View>
    </View>
  );
}

function EditScreen({navigation, route}){
  const [fname, setfname] = useState('empty');
  const [lname, setlname] = useState('empty');
  const [phone, setphone] = useState('empty');
  const [email, setemail] = useState('empty');
  const [addr, setaddr] = useState('empty');
  const [itemKey, setkey] = useState('empty');
  useEffect(() =>{ 
    navigation.addListener('focus', () => {
      const {key} = route.params;
      setkey(`${key}`);
      _getContact(key);
    })
  },[navigation]);
  _getContact = async key =>{
    await AsyncStorage.getItem(key)
    .then(result => {
      var details = JSON.parse(result);
      setfname(details.fname);      
      setlname(details.lname);
      setphone(details.phone);
      setemail(details.email);
      setaddr(details.addr);    
    })
    .catch(error => console.log(error));
  }
  contactUpdate = async () =>{
    if((fname !== 'empty') && (lname !== 'empty') && (phone !== 'empty') && (email !== 'empty') && (addr !== 'empty')){
      var details = {
        fname: fname,
        lname: lname,
        phone: phone,
        email: email,
        addr: addr
      }
      await AsyncStorage.mergeItem( itemKey, JSON.stringify(details))
      .then(() => navigation.navigate('ViewScreen', {key : itemKey}))
      .catch(error => console.log(error));
    } else {
      Alert.alert('All Fields Required!!!!')
    }

  }

  return (

    <TouchableWithoutFeedback 
    onPress = { () => {Keyboard.dismiss()}}
    >
      <View style={styles.addcontainer}>
      <Form>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>First Name</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCapitalize = 'none'
          autoCompleteType = 'off'
          keyboardType = 'default'
          keyboardAppearance = 'dark'
          onChangeText = { fname => setfname(fname)}
          value = {fname}
          />
        </Item>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>Last Name</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCapitalize = 'none'
          autoCompleteType = 'off'
          keyboardType = 'default'
          keyboardAppearance = 'dark'
          onChangeText = { lname => setlname(lname)}
          value = {lname}
          />
        </Item>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>Contact Number</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCapitalize = 'none'
          autoCompleteType = 'off'
          keyboardType = 'number-pad'
          keyboardAppearance = 'dark'
          maxLength = {10}
          onChangeText = { phone => setphone(phone)}  
          value = {phone}       
          />
        </Item>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>Email</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCapitalize = 'none'
          autoCompleteType = 'off'
          keyboardType = 'email-address'
          keyboardAppearance = 'dark'
          onChangeText = { email => setemail(email)}     
          value = {email}     
          />
        </Item>
        <Item floatingLabel>
          <Label style = {styles.addLbl}>Address</Label>
          <Input style = {styles.addInput}
          autoCorrect = {false}
          autoCompleteType = 'off'
          autoCapitalize = 'none'
          keyboardType = 'default'
          keyboardAppearance = 'dark'
          onChangeText = { addr => setaddr(addr)}
          value = {addr}          
          />
        </Item>
      </Form>
      <Button block style = {{ marginTop : 20, backgroundColor: '#61DAFB', marginHorizontal : 25 }}
      onPress = { () => contactUpdate()} 
      >
        <Text>Save Changes</Text>
      </Button>
      </View>
    </TouchableWithoutFeedback>
  );


}


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Contacts" component={ContactScreen} 
          options={{
          title: 'Contacts',
          headerStyle: {
            backgroundColor: '#282A36',
          },
          headerTintColor: '#61DAFB',
          headerTitleStyle: {
            fontWeight: 'normal',
          },
          }}
        />
        <Stack.Screen name="Add" component={AddScreen}
          options={{
            title: 'Add Contact',
            headerStyle: {
              backgroundColor: '#282A36',
            },
            headerTintColor: '#61DAFB',
            headerTitleStyle: {
              fontWeight: 'normal',
            },
          }} 
        />
        <Stack.Screen name="ViewScreen" component={ViewScreen}
          options={{
            title: 'Details',
            headerStyle: {
              backgroundColor: '#282A36',
            },
            headerTintColor: '#61DAFB',
            headerTitleStyle: {
              fontWeight: 'normal',
            },
          }} 
        />
        <Stack.Screen name="Edit" component={EditScreen}
          options={{
            title: 'Edit Details',
            headerStyle: {
              backgroundColor: '#282A36',
            },
            headerTintColor: '#61DAFB',
            headerTitleStyle: {
              fontWeight: 'normal',
            },
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  floatBtn : {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor : '#282A36',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2.22,
    elevation: 9,
    width: 44,
    height: 44,
    borderRadius: 44/2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addcontainer : {
    flex: 1,
    backgroundColor: "#282A36",
    height: 500   
  },
  addLbl : {
    color : '#fff',
  },
  addInput : {
    width: 100,
    color: 'white',
  }, 
  cardview: {
    flexDirection: 'row',
    padding: 13,
    backgroundColor:'#282A36',
    marginBottom: 1, 
    borderBottomWidth: 0.17,
    borderColor: 'white',
    justifyContent: 'space-between'
  },
  cardImg : {
    backgroundColor : '#61DAFB',
    width: 44,
    height: 44,
    borderRadius: 44/2,
    alignItems: 'center',
    justifyContent: 'center'

  },
  info : {
    flexDirection:'column',
    paddingLeft: 15
  },
  viewcontainer : {
    flex: 1,
    backgroundColor: "#282A36",
    height: 500, 
    alignItems: 'center'   
  },
  viewImg : {
    marginTop : 20,
    backgroundColor : 'transparent',
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#61DAFB',
    borderRadius: 100/2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewName : {
    marginVertical: 20
  },
  emptyview : {
    marginTop: 20,
    width: '100%',
    height: 10,
    marginBottom: 10,
    backgroundColor: '#282A36',
    shadowColor: '#282A36',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 2,
  },
  infoView : {
    alignItems: 'flex-start',
    justifyContent: 'flex-start', 
    width: '95%'
  },
  infoContainer : {
    flexDirection: 'row', 
    marginBottom: 15, 
    padding: 5,
    borderBottomWidth: 5,
    borderColor: '#282A36',
    width: '100%',
    
  },
  infotxt:{ 
    marginLeft: 10,
    color: '#ffffff', 
    fontSize: 15, 
    letterSpacing : 1,

  }
})
