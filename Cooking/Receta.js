import { Text, View } from 'react-native'
import React, { Component } from 'react'

export default class Receta extends Component {
	constructor(props) {
		super(props);
		this.recipe_id = props.id;
	}
	
  render() {
    return (
      <View>
        <Text>Receta {this.recipe_id}</Text>
      </View>
    )
  }
}
