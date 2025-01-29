<!-- eslint-disable prettier/prettier -->
<template>
    <div id="map"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import limitData from '@/assets/map_data/limit.json';
import * as turf from '@turf/turf';


onMounted(() => {

    const map = new maplibregl.Map({
        container: 'map', // container id
        style: 'https://demotiles.maplibre.org/style.json', // style URL
        center: [0, 0], // starting position [lng, lat]
        zoom: 1 // starting zoom
    });


    map.on('load',()=>{
        map.addSource('world-mask', {
            type: 'geojson',
            data: createInverseMaskGeometry(limitData)
        });

        // Ajouter une couche de masque noir
        map.addLayer({
            id: 'world-mask-layer',
            type: 'fill',
            source: 'world-mask',
            paint: {
                'fill-color': 'black',
                'fill-opacity': 0.5
            }
            });
        })
   


    

  
})

const createInverseMaskGeometry=(limitData: any)=> {

  let maskedWorld: any;

  const world = turf.polygon([[
      [-180, -90],
      [180, -90],
      [180, 90], 
      [-180, 90],
      [-180, -90]
    ]]);

  // Parcourir chaque feature
  limitData.features.forEach((feature: any) => {
    // Vérifier si c'est un MultiPolygon
    if (feature.geometry.type === 'MultiPolygon') {
      // Transformer le multipolygone en feature Turf
      const multiPoly = turf.multiPolygon(
        feature.geometry.coordinates, 
        feature.properties
      );

      // Transformer le multipolygone en une collection de polygones individuels
      const polyFeatures = multiPoly.geometry.coordinates.map(coords => 
        turf.polygon(coords)
      );

      // Soustraire chaque polygone du monde masqué
      polyFeatures.forEach((poly: any) => {
        try {
          if(maskedWorld){
            maskedWorld=turf.difference(turf.featureCollection([maskedWorld, poly]))
          }else{
            maskedWorld = turf.difference(turf.featureCollection([world, poly]));
          }
        } catch (error) {
          console.error('Erreur lors de la soustraction du polygone:', error);
        }
      });
    }
  });

  return maskedWorld;
  };

</script>
<style>
#map{
    width: 300px;
    height: 300px;
}</style>