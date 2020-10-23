import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import EstablishmentService from "./services/establishment_service";

import Establishment from './components/Establisment';
import NearstCoffee from "./components/NearstCoffee";

export default function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locations, setLocations] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ative as permissões de uso do GPS para acessar o App");
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      }
    })();

    loadCoffees();
  }, []);

  async function loadCoffees() {
    try {
      const response = await EstablishmentService.index(latitude, longitude);
      setLocations(response.data.results);
    } catch (error) {
      setLocations([]);
    }
  }

  return (
    <View style={styles.container}>
      <NearstCoffee latitude={latitude} longitude={longitude} />
      { (selected) && <Establishment place={selected} setSelected={setSelected} /> }

      <MapView
        style={styles.map}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }} >

        <Marker
          title={`Seu Local`}
          icon={require("./images/my-location-pin-1.png")}
          coordinate={{ latitude, longitude }}
        />

        {   
          locations && locations.map((location, indexForIndex) => {
            return (
              <Marker
                key={indexForIndex}
                title={location.name}
                icon={require("./images/coffee-big-pin.png")}
                coordinate={{
                  latitude: location.geometry.location.lat,
                  longitude: location.geometry.location.lng,
                }}
                onPress={() => setSelected(location)}
              />
            );
          })
        }
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },

  map: {
    height: "100%",
    width: "100%",
  },
});
