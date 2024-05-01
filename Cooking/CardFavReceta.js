import { Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, { Component } from 'react';


import { getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore';
import appFirebase from './credenciales';

import Icon from 'react-native-vector-icons/FontAwesome';

// Inicializa Firestore
const firestore = getFirestore(appFirebase);

import imagenesRecetas from './imagenesRecetas.js';

export default class CardFavReceta extends Component {
	constructor(props) {
		super(props);
		this.recipe_id = props.id;

		this.state = {
			recipe_data: {},
			recipe_image: undefined,
			state_data: 1
		};
		
		this.showRecipe = this.showRecipe.bind(this);
	}

	async fetch_recipe_data() {
		// If the object is empty
		if (Object.keys(this.state.recipe_data).length === 0) {
			try {
				const recipeDoc = await getDoc(doc(firestore, "Recetas", this.recipe_id));
				if (recipeDoc.exists()) {
					const data = recipeDoc.data();
					const recipe_image = imagenesRecetas[data.Imagen];
					this.setState({
						recipe_data: data,
						recipe_image: recipe_image,
						state_data: 0
					});
				} else {
					console.log("Documento no existe :(");
					this.setState({
						recipe_data: {},
						recipe_image: undefined,
						state_data: -1
					});
				}
			} catch (error) {
				console.error("Error al obtener los datos de receta: ", error);
				alert("error al obtener los datos de receta");
				this.setState({
					recipe_data: {},
					recipe_image: undefined,
					state_data: -1
				});
			}
		}
	}

	showRecipe(recipe_data, recipe_image) {
		console.log(recipe_data);
		this.props.navigation.navigate('Receta', { recipe_data, imagenesRecetas });
	}
	
  render() {
		this.fetch_recipe_data();


		if (this.state.state_data === -1)
			return <View style={styles.cardContainer}><Text style={styles.title}>Error con la receta...</Text></View>;

		else if (this.state.state_data === 1)
			return <View style={styles.cardContainer}><Text style={styles.title}>Cargando receta...</Text></View>;

		// Fetch the image
		const imagenReceta = imagenesRecetas[this.state.recipe_data.Imagen];


		// Crear una matriz de íconos de estrella
    const estrellas = [];
    for (let i = 0; i < this.state.recipe_data.Estrellas; i++)
      estrellas.push(<Icon key={i} name="star" size={24} color="gold" />);
		

    return (
			<TouchableOpacity onPress={() => this.showRecipe(this.state.recipe_data, this.state.recipe_image)}>
				<View style={styles.cardContainer}>
					<Image
            source={imagenReceta}
            style={styles.image}
          />
					
					<View style={styles.infoContainer}>
						<Text style={styles.title}>{this.state.recipe_data.Nombre}</Text>
						<Text style={styles.subTitle}>Tipo: {this.state.recipe_data.Tipo}</Text>
						<Text style={styles.subTitle}>Tiempo: {this.state.recipe_data.Tiempo} minutos</Text>
						<View style={styles.detalle}>
							{estrellas}
						</View>
					</View>
				</View>
			</TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  ingredients: {
    fontSize: 16,
  },
  process: {
    fontSize: 16,
  },
	detalle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

