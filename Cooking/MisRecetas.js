import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs} from 'firebase/firestore';
import appFirebase from './credenciales';
import React, { Component } from 'react';
import CardFavReceta from './CardFavReceta.js';

// Inicializa Firestore
const firestore = getFirestore(appFirebase);

export default class MisRecetas extends Component {
	constructor(props) {
		super(props);
		this.user_email = props.email;

		this.state = {
			fav_recipes: [],
			data_state: 1,
		};
	}

	async fetch_user_fav_recipes() {
		// Check if the fav recipes is empty
		if (this.state.fav_recipes.length === 0) {
			try {
				const collec = collection(firestore, "Usuarios", this.user_email, "RecetasFavoritas");
				const querySnapshot = await getDocs(collec);
				if (!querySnapshot.empty) {
					const firstDoc = querySnapshot.docs[0];
					// Fetch the data
					const data = firstDoc.data();
					const favoritas = data["recetas"];
					this.setState({
						// Set the favorites list
						fav_recipes: favoritas,
						data_state: 0,
					});
				} else {
					console.log("El documento no existe");
					this.setState({
						fav_recipes: [],
						data_state: 1,
					});
				}
			} catch (error) {
				console.error("Error al obtener la lista de favoritos del usuario: ", error);
				alert("error al obtener la lista de favoritos");
				this.setState({
					fav_recipes: [],
					data_state: -1,
				});
			}
		}
	}
	
  render() {
		this.fetch_user_fav_recipes();

		if (this.state.data_state === -1)
			return <View><Text style={styles.title}>Error...</Text></View>;
		
		else if (this.state.data_state === 1)
			return <View><Text style={styles.title}>Cargando...</Text></View>;

		else if (this.state.fav_recipes.length === 0)
			return <View><Text style={styles.title}>Lista de favoritas vacia...</Text></View>;
		
    return (
			<ScrollView style={styles.container}>
				<View>
					{
						/* Map each recipe from the user */
						this.state.fav_recipes.map((recipe, key) => <CardFavReceta
																													id={recipe}
																													navigation={this.props.navigation}
																													key={key}
																												/>)
					}
				</View>
			</ScrollView>
    )
  }
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
	title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
  },
});
