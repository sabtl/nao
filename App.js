import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
    ActivityIndicator,
    Card,
    Provider as PaperProvider,
    Paragraph,
    Title,
} from "react-native-paper";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadMovies() {
    const response = await fetch(
      "https://www.omdbapi.com/?s=spider%20man&apikey=1cd66749"
    );

    const data = await response.json();

    setMovies(data.Search);

    setLoading(false);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() =>
              navigation.navigate("Detalhes", {
                movie: item,
              })
            }
          >
            <Card.Cover source={{ uri: item.Poster }} />

            <Card.Content>
              <Title>{item.Title}</Title>
              <Paragraph>{item.Year}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

function DetailsScreen({ route }) {
  const { movie } = route.params;

  return (
    <View style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: movie.Poster }} />

        <Card.Content>
          <Title>{movie.Title}</Title>

          <Paragraph>Ano: {movie.Year}</Paragraph>

          <Paragraph>Tipo: {movie.Type}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detalhes" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  card: {
    marginBottom: 15,
  },
});