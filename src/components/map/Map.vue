<template>
  <div id="map">
    <ResetMapExtentControl ref="reset-map-extent-control" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch, computed, ref, type Ref, useTemplateRef } from 'vue'
import maplibregl, { GeoJSONSource } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import ResetMapExtentControl from '@/components/map/controls/ResetMapExtentControl.vue'
import { useApplicationStore } from '@/stores/applicationStore'
import { IControl } from '@/services/map/MapService'
import limitData from '@/assets/map_data/limit.json';
import * as turf from '@turf/turf';

const applicationStore = useApplicationStore()
const triggerZoomReset = computed(() => applicationStore.triggerZoomReset)
const map: Ref<maplibregl.Map | null> = ref(null)
const resetMapExtentControl = useTemplateRef('reset-map-extent-control')
const props = withDefaults(
  defineProps<{
    bounds?: maplibregl.LngLatBounds
  }>(),
  {
    bounds: () => new maplibregl.LngLatBounds([9.3361339, 3.8856846], [ 9.8644121, 4.2252363])
  }
)
const popup = ref(new maplibregl.Popup({ closeOnClick: false }))
const hoveredFeatureId: Ref<string | null> = ref(null)
const activeFeatureId: Ref<string | null> = ref(null)

onMounted(() => {
  //const apiKey = import.meta.env.VITE_MAPTILER_API_KEY
  map.value = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=HcIfhRHjeTAYtM7kuhvr',
    center: [0, 0],
    zoom: 1,
    attributionControl: false
  });

  map.value.on('load',()=>{
        map.value?.addSource('world-mask', {
            type: 'geojson',
            data: createInverseMaskGeometry(limitData)
        });

        // Ajouter une couche de masque noir
        map.value?.addLayer({
            id: 'world-mask-layer',
            type: 'fill',
            source: 'world-mask',
            paint: {
                'fill-color': 'black',
                'fill-opacity': 0.5
            }
            });
        })

  map.value.dragRotate.disable()
  map.value.touchZoomRotate.disableRotation()

  const nav = new maplibregl.NavigationControl({
    showCompass: false
  })

  map.value.addControl(nav, 'top-right')
  map.value.addControl(new IControl(resetMapExtentControl), 'top-right')
  map.value.addControl(new maplibregl.AttributionControl(), 'bottom-left')
  setBBox()
})

const removeSource = (sourceName: string) => {
  if (map.value?.getSource(sourceName)) {
    map.value.removeSource(sourceName)
  }
}

const removeLayer = (layerName: string) => {
  if (map.value && map.value?.getLayer(layerName)) {
    map.value.removeLayer(layerName)
  }
}

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

const setData = (sourceName: string, geojson: GeoJSON.GeoJSON) => {
  const source = map.value?.getSource(sourceName.toString()) as GeoJSONSource
  if (source) source.setData(geojson)
}

const getData = async (sourceName: string | number) => {
  const source = map.value?.getSource(sourceName.toString()) as GeoJSONSource
  if (source) return await source.getData()
}

const addSource = (sourceName: string, geojson: GeoJSON.GeoJSON) => {
  if (map.value?.getSource(sourceName)) return
  map.value?.addSource(sourceName, {
    type: 'geojson',
    data: geojson
  })
}

const setLayoutProperty = (layerName: string, property: string, value: any) => {
  if (map.value?.getLayer(layerName)) {
    map.value?.setLayoutProperty(layerName, property, value)
  }
}

const setPaintProperty = (layerName: string, property: string, value: any) => {
  if (map.value?.getLayer(layerName)) {
    map.value?.setPaintProperty(layerName, property, value)
  }
}

const addLayer = async (
  layerName: string,
  options: { layout: maplibregl.LayerSpecification['layout'] }
) => {
  if (map.value && map.value?.getLayer(layerName)) return
  map.value?.addLayer({
    id: layerName,
    type: 'symbol',
    source: layerName,
    layout: options.layout,
    metadata: { isPersistent: true } // used to have persistent layers when switching basemaps
  })
}

const addImage = async (path: string, name: string) => {
  if (map.value?.hasImage(name)) return
  const image = await map.value?.loadImage(path)
  if (!image) return
  map.value?.addImage(name, image.data)
  return
}

const addPopup = (coordinates: maplibregl.LngLatLike, popupHtml: any) => {
  if (map.value == null) return
  flyTo(coordinates)
  popup.value.setLngLat(coordinates).setDOMContent(popupHtml.$el).addTo(map.value)
  popup.value.addClassName('show')
  popup.value._onClose = () => {
    activeFeatureId.value = null
    popup.value.removeClassName('show')
  }
}

const addPopupOnClick = (layerName: string, popupHtml: any) => {
  if (map.value == null) return
  map.value.on('click', layerName, (e: any) => {
    if (map.value == null) return
    activeFeatureId.value = e.features[0].properties.id
    const coordinates = e.features[0].geometry.coordinates.slice()
    addPopup(coordinates, popupHtml)
  })
}

const flyTo = (coordinates: maplibregl.LngLatLike) => {
  if (map.value == null) return
  map.value.flyTo({
    center: coordinates,
    zoom: 12,
    speed: 0.5
  })
}

const listenToHoveredFeature = (layerName: string) => {
  if (map.value == null) return
  map.value.on('mouseenter', layerName, (e: any) => {
    if (map.value == null) return
    map.value.getCanvas().style.cursor = 'pointer'
    hoveredFeatureId.value = e.features[0].properties.id
  })

  map.value.on('mouseleave', layerName, () => {
    if (map.value == null) return
    map.value.getCanvas().style.cursor = ''
    hoveredFeatureId.value = null
  })
}

const setBBox = () => {
  if (!map.value) return
  map.value.fitBounds(props.bounds, { padding: 75 })
}

watch(triggerZoomReset, () => {
  setBBox()
})

defineExpose({
  map,
  activeFeatureId,
  hoveredFeatureId,
  addSource,
  addPopup,
  addPopupOnClick,
  addImage,
  addLayer,
  listenToHoveredFeature,
  removeLayer,
  removeSource,
  setData,
  getData,
  setLayoutProperty,
  setPaintProperty
})
</script>

<style lang="scss">
.maplibregl-popup {
  transition: opacity 0.15s ease-in-out;
  opacity: 0;
  user-select: none;

  &.show {
    opacity: 1;
    .maplibregl-popup-close-button {
      display: inherit;
    }
  }

  $dim-popup-offset: 2rem;
  &.maplibregl-popup-anchor-right .maplibregl-popup-content {
    transform: translateX(-$dim-popup-offset);
  }
  &.maplibregl-popup-anchor-left .maplibregl-popup-content {
    transform: translateX($dim-popup-offset);
  }
  &.maplibregl-popup-anchor-bottom .maplibregl-popup-content {
    transform: translateY(-$dim-popup-offset);
  }
  &.maplibregl-popup-anchor-top .maplibregl-popup-content {
    transform: translateY($dim-popup-offset);
  }
  &.maplibregl-popup-anchor-top-right .maplibregl-popup-content {
    transform: translate(-$dim-popup-offset, $dim-popup-offset);
  }
  &.maplibregl-popup-anchor-top-left .maplibregl-popup-content {
    transform: translate($dim-popup-offset, $dim-popup-offset);
  }
  &.maplibregl-popup-anchor-bottom-right .maplibregl-popup-content {
    transform: translate(-$dim-popup-offset, -$dim-popup-offset);
  }
  &.maplibregl-popup-anchor-bottom-left .maplibregl-popup-content {
    transform: translate($dim-popup-offset, -$dim-popup-offset);
  }

  .maplibregl-popup-content {
    padding: inherit;
    width: fit-content;
    transform: translateY(-2rem);
  }
  .maplibregl-popup-close-button {
    display: none;
    margin: 0.5rem;
    background: white;
    box-shadow: 0 0.25rem 0.25rem -0.125rem rgba(0, 0, 0, 0.15);
    color: black;
    $dim-map-btn-w: 2rem;
    background-image: url(@/assets/images/icons/map/mdi-close.svg);
    background-position: center;
    width: $dim-map-btn-w;
    height: $dim-map-btn-w;
    border-radius: 50%;
    transition: none;
  }

  .maplibregl-popup-tip {
    display: none;
    pointer-events: none;
  }
}

#map {
  width: 100%;
  height: 100%;

  .maplibregl-ctrl-top-left,
  .maplibregl-ctrl-top-right {
    margin: 1.5rem;
    display: flex;
    flex-flow: column nowrap;
    gap: 0.62rem;
  }

  .maplibregl-ctrl-group {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.62rem;
    background: none;
    box-shadow: none;
    margin: 0;
    transition: all 0.15s ease-in;

    button {
      background: white;
      box-shadow: 0 0.25rem 0.25rem -0.125rem rgba(0, 0, 0, 0.15);
      color: black;
      $dim-map-btn-w: 2.5rem;
      width: $dim-map-btn-w;
      height: $dim-map-btn-w;
      border-radius: 50%;
      border-width: 0;
      position: relative;

      &.maplibregl-ctrl-zoom-in {
        .maplibregl-ctrl-icon {
          background-image: url(@/assets/images/icons/map/mdi-plus.svg);
        }
      }

      &.maplibregl-ctrl-zoom-out {
        .maplibregl-ctrl-icon {
          background-image: url(@/assets/images/icons/map/mdi-minus.svg);
        }
      }
    }
  }
}
</style>
