import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from "react-native";

import EstablishmentService from "../../services/establishment_service";
import ListRatings from "./ListRating";

const Separator = () => {
  return <View style={styles.separator} />;
};

const Establishment = (props) => {
  const [establisment, setEstablishment] = useState(null);

  useEffect(() => {
    getEstablishmentInformations();
  }, [props.place]);

  async function getEstablishmentInformations() {
    try {
      const response = await EstablishmentService.show(props.place.place_id);
      console.log(response.data);
      setEstablishment(response.data.result);
    } catch (error) {
      setEstablishment(null);
    }
  }

  function renderEstablishmentImage() {
    if (establisment.photos) {
      const apiImageGoogle = "https://maps.googleapis.com/maps/api/place/photo";
      const maxwidth = 400;
      const sensor = false;
      const key = "AIzaSyC3BPqGiBnUCryC_ZXTg_h8FqC3t3482tM";
      const photoreference = establisment.photos[0].photo_reference;
      return (
        <Image
          style={styles.photo}
          source={{
            uri: `${apiImageGoogle}?maxwidth=${maxwidth}&photoreference=${photoreference}&sensor=${sensor}&key=${key}`,
          }}
        />
      );
    } else {
      return (
        <Image
          style={styles.photo}
          source={require("./../../images/no_photo-1.jpg")}
        />
      );
    }
  }

  function renderOpeningHours() {
    if (establisment.opening_hours) {
      if (establisment.opening_hours.open_now === true) {
        return (
          <View>
            <Text style={{ color: "white", fontWeight: "bold", marginTop: 10 }}>
              Aberto
            </Text>
            <Separator />
            {renderSchedules()}
          </View>
        );
      } else {
        return (
          <View>
            <Text style={{ color: "white", fontWeight: "bold", marginTop: 10 }}>
              Fechado
            </Text>
            <Separator />
            {renderSchedules()}
          </View>
        );
      }
    }
  }

  function renderSchedules() {
    return establisment.opening_hours.weekday_text.map((schedule) => {
      return (
        <Text key={schedule} style={{ color: "white" }}>
          {schedule}
        </Text>
      );
    });
  }

  return (
    <View style={styles.container}>
      {establisment != null && (
        <View style={styles.background}>
          <ScrollView style={{ height: 600 }}>
            <View style={{ marginHorizontal: 30 }}>
              <View style={{ alignSelf: "flex-end" }}>
                <Button
                  title="❌"
                  color="black"
                  onPress={() => {
                    setEstablishment(null);
                    props.setSelected(null);
                  }}
                />
              </View>

              {renderEstablishmentImage()}

              <Text style={styles.title}>{props.place.name}</Text>

              {renderOpeningHours()}

              <Separator />

              <Text style={{ color: "white" }}>
                {establisment.formatted_address}
              </Text>

              <Separator />

              <ListRatings place={props.place} />
            </View>
          </ScrollView>
          <View style={styles.rodape}>
            <Text style={{ color: "white", marginLeft: 10, fontSize: 11 }}>
              Café Selecionado
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    zIndex: 2,
    flex: 1,
    width: "80%",
    alignSelf: "center",
    height: "100%",
  },
  background: {
    backgroundColor: "black",
    paddingTop: 20,
    borderRadius: 20,
  },
  photo: {
    height: 200,
    width: 200,
  },
  title: {
    color: "#f56d50",
    fontSize: 17,
    marginTop: 10,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rodape: {
    flexDirection: "row",
    paddingLeft: 20,
    backgroundColor: "#393939",
    padding: 10,
    marginTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default Establishment;
