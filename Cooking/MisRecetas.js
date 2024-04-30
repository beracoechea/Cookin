import { Text, View } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore';
import appFirebase from './credenciales';
import React, { Component } from 'react';
import Receta from './Receta';

// Inicializa Firestore
const firestore = getFirestore(appFirebase);

export default class MisRecetas extends Component {
	constructor(props) {
		super(props);
		this.user_email = props.email;

		this.state = {
			fav_recipes: []
		};
	}

	async fetch_user_fav_recipes() {
		// Check if the fav recipes is empty
		if (this.state.fav_recipes.length === 0) {
			try {
				const userFavsDoc = await getDoc(doc(firestore, "RecetasFavoritas", this.user_email));
				if (userFavsDoc.exists()) {
					// Fetch the data
					const data = userFavsDoc.data();
					const favoritas = data.favoritas;
					this.setState((prev_state) => {
						return {
							// Set the favorites list
							fav_recipes: favoritas
						};
					});
				} else {
					console.log("El documento no existe");
				}
			} catch (error) {
				console.error("Error al obtener la lista de favoritos del usuario: ", error);
				alert("error al obtener la lista de favoritos");
			}
		}
	}
	
  render() {
		this.fetch_user_fav_recipes();
				
		if (this.state.fav_recipes.length === 0)
			return <View><Text>Cargando...</Text></View>;
		
		
    return (
      <View>
				{
					/* Map each recipe from the user */
					this.state.fav_recipes.map((recipe, key) => <Receta
																												id={recipe}
																												key={key}
																											/>)
				}
      </View>
    )
  }
}
