import { Text, View } from 'react-native';
import React, { Component } from 'react';


import { getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore';
import appFirebase from './credenciales';

// Inicializa Firestore
const firestore = getFirestore(appFirebase);

export default class CardFavReceta extends Component {
	constructor(props) {
		super(props);
		this.recipe_id = props.id;

		this.state = {
			recipe_data: {}
		};
	}

	async fetch_recipe_data() {
		// If the object is empty
		if (Object.keys(this.state.recipe_data).length === 0) {
			try {
				const recipeDoc = await getDoc(doc(firestore, "Recetas", this.recipe_id));
				if (recipeDoc.exists()) {
					const data = recipeDoc.data();
					this.setState((prev_state) => {
						return {
							recipe_data: data
						}
					}); 
				} else {
					console.log("Documento no existe :(");
				}
			} catch (error) {
				console.error("Error al obtener los datos de receta: ", error);
				alert("error al obtener los datos de receta");
			}
		}
	}
	
  render() {
		this.fetch_recipe_data();

		if (Object.keys(this.state.recipe_data).length === 0)
			return <View><Text>Cargando...</Text></View>;
		
    return (
      <View>
        <Text>Card recipe {this.recipe_id}</Text>
      </View>
    )
  }
}

