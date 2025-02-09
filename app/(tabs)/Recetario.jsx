import { Text, View } from 'react-native'
import React, { Component } from 'react'
import ListaRecetas from '../../components/Recetas/ListaRecetas'

export default class Recetario extends Component {
  render() {
    return (
      <View >
        <ListaRecetas/>
      </View>
    )
  }
}