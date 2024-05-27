<template>
    <div>
        <yandex-map
            v-model="map"
            :settings="{
                location: LOCATION                
            }"
            width="100%"
            height="100vh"
            readonly-settings
        >
            <yandex-map-default-scheme-layer />
            <yandex-map-default-features-layer />
            <yandex-map-controls :settings="{ position: 'right' }">
                <yandex-map-zoom-control />
            </yandex-map-controls>

            <yandex-map-feature v-for="(feature, index) in features" 
              :key="index" 
              :settings="feature" 
              >
          </yandex-map-feature>
            <yandex-map-listener :settings="{
              onMouseEnter: createEvent('dom', 'mouseEnter'),
              onMouseLeave: createEvent('dom', 'mouseLeave'),
              onClick: createEvent('dom', 'click'),
            }">
            <yandex-map-listener
              :settings="{onClick: logMapClick}"  
            />
            </yandex-map-listener>
            <yandex-map-hint hint-property="hint">
              <template #default="{ content }">
                <div
                  class="hint-window"
                  v-html="content"
                />
              </template>
            </yandex-map-hint>

        </yandex-map>
        <div class="events-block"
          :class="{'events-block__visible' : isDialogInfo}"
        >
          <div class="events-block__header">
            <h1>
              {{ districtName }}
            </h1>
            <button @click="closeDialog">
              {{ 'close' }}
            </button> 
              <!-- <button @click="isDialogInfo = !isDialogInfo">Close</button> -->
          </div>
          <div class="events-block__content">
            <span>{{districtDescription}}</span>
          </div>
          </div>
    </div>
</template>

<script setup lang="ts">
import {  reactive, ref, shallowRef, } from 'vue';
// eslint-disable-next-line no-unused-vars
import type { YMap, YMapFeatureProps, BehaviorMapEventHandler, DomEvent, DomEventHandler } from '@yandex/ymaps3-types';
import type { YMapLocationRequest, } from '@yandex/ymaps3-types/imperative/YMap';
import {  YandexMap,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapFeature,
  YandexMapZoomControl,
  YandexMapListener,
  YandexMapHint,} from 'vue-yandex-maps';
import { districts } from '@/districts';

const isDialogInfo = ref(false)

const map = shallowRef<null | YMap>(null);

const LOCATION: YMapLocationRequest = {
    center: [ 53.2045, 56.8498 ],
    zoom: 7,
};

const defaultSettings = {
  geometry: {
    type: 'Polygon',
  },
  style: {
    stroke: [{
      color: '#006efc',
      width: 2,
    }],
    fill: 'rgba(56, 56, 219, 0.5)',
  },
  name: ''
} satisfies Omit<YMapFeatureProps, 'geometry'> & { geometry: Partial<YMapFeatureProps['geometry']>, name: string };

interface FeatureProps extends YMapFeatureProps {
  name: string;
  description: string;
}


const events = reactive({
  dom:{
    mouseEnter: false,
    mouseLeave: false,
    click: false
  }
});

// eslint-disable-next-line no-unused-vars
function debounce<T extends Function>(func: T, delay: number): (...args: any[]) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function _(this: any, ...args: any[]): void {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const createEvent = <T extends keyof typeof events, E = keyof typeof events[T]>(category: T, type: E | boolean): any => {
  const eventState = events[category] as any;

  if (typeof type !== 'boolean') {
    const endEvent = debounce(() => {
      eventState[type] = false;
    }, 250);

    // eslint-disable-next-line no-unused-vars
    return (object: Record<string, any>, event?: DomEvent) => {
      // console.log(`${type} Object: `, object, `\n`, `${type} Event: `, event);

      eventState[type] = true;
      endEvent();
    };
  }
  return (object: Parameters<BehaviorMapEventHandler>[0]) => {
    // console.log(`${type ? 'actionStart' : 'actionEnd'} Object:`, object);

    eventState[object.type] = type;
  };
};

const features: FeatureProps[] = districts.map((district) => ({
  ...defaultSettings,
  geometry: {
    ...defaultSettings.geometry,
    coordinates: district.coordinates,
  },
  style: {
    ...defaultSettings.style,
    fill: 'rgba(6, 160, 209, 0.5)',
  },
  properties:{
    hint: `<div>${district.name}</div>`,
    name: district.name,
    description: district.description,
  },
  name: district.name,
  description: district.description,
}));

const districtName = ref('')
const districtDescription = ref('')

// eslint-disable-next-line no-unused-vars
const logMapClick: DomEventHandler = (object, event) => {
  if (object?.type === 'feature'){    
    console.log(typeof(object?.entity?.properties?.description))
    
    districtName.value = object?.entity.properties?.name
    districtDescription.value = object?.entity.properties?.description
    isDialogInfo.value = true; 
  }
  else{
    console.log(event);
    
  }
}

const closeDialog = ()=>{
  isDialogInfo.value = !isDialogInfo.value;
}

// const features: FeatureProps[] = [
//   {
//     ...defaultSettings,
//     geometry: {
//       ...defaultSettings.geometry,
//       coordinates: [Debeskiy],
//     },
//     style:{
//       ...defaultSettings.style,
//       fill: 'rgba(46, 16, 29, 0.5)',
//     },
//     name: 'Ленинский район',
//     description: 'Описание Ленинский района',
//   },
//   {
//     ...defaultSettings,
//     geometry: {
//       ...defaultSettings.geometry,
//       coordinates: [Sharkanskiy],
//     },
//     style:{
//       ...defaultSettings.style,
//       fill: 'rgba(6, 160, 209, 0.5)',
//     },
//     name: 'Первомайский район',
//     description: 'Описание Первомайского района',
//   },
//   {
//     ...defaultSettings,
//     geometry: {
//       ...defaultSettings.geometry,
//       coordinates: [Yakshur],
//     },
//     style:{
//       ...defaultSettings.style,
//       fill: 'rgba(6, 160, 209, 0.5)',
//     },
//     name: 'Октябрьский район',
//     description: 'Описание Октябрьский района',
//   },
//   {
//     ...defaultSettings,
//     geometry: {
//       ...defaultSettings.geometry,
//       coordinates: [Kezskiy],
//     },
//     style:{
//       ...defaultSettings.style,
//       fill: 'rgba(6, 160, 209, 0.5)',
//     },
//     name: 'Индустриальный район',
//     description: 'Описание Индустриальный района',
//   },
//   {
//     ...defaultSettings,
//     geometry: {
//       ...defaultSettings.geometry,
//       coordinates: [Iarskiy],
//     },
//     style:{
//       ...defaultSettings.style,
//       fill: 'rgba(6, 160, 209, 0.5)',
//     },
//     name: 'Устиновский район',
//     description: 'Описание Устиновский района',
//   },
//   {
//     ...defaultSettings,
//     geometry: {
//       ...defaultSettings.geometry,
//       coordinates: [Sarapulskiy],
//     },
//     style:{
//       ...defaultSettings.style,
//       fill: 'rgba(6, 160, 209, 0.5)',
//     },
//     name: 'Устиновский район',
//     description: 'Описание Устиновский района',
//   },
//   {
//     ...defaultSettings,
//     geometry: {
//       ...defaultSettings.geometry,
//       coordinates: [Kambarskiy],
//     },
//     style:{
//       ...defaultSettings.style,
//       fill: 'rgba(6, 160, 209, 0.5)',
//     },
//     name: 'Устиновский район',
//     description: 'Описание Устиновский района',
//   },

// ];


</script>

<style scoped>

.balloon {
  padding: 10px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.balloon h3 {
  margin: 0 0 5px;
  font-weight: bold;
}

.events-container {

}

.events-block {
  position: absolute;
  transform: translate(-100%);
  top: 0;
  left: 0;
  /* display: none; */
  padding: 5px 8px;
  min-width: 20vw;
  max-width: 30vw;
  max-height: 98%;
  background-color: rgba(56, 56, 219, 0.26);
  backdrop-filter: blur(10px);
  border-radius: 7px;
  white-space: pre-line;
  text-align: left;
  transition: ease-in 0.5s;
  overflow: hidden;
}

.events-block__visible{
  /* transition: ease-in 0.5s; */
  transform: translate(0);
}

.events-block__header {
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6vh;
}

.events-block__header::after {
  position: absolute;
  top: 110%;
  content: '';
  height: 0.5px;
  width: 29vw;
  background-color: black;
}

.events-block__header h1 {
  
  margin: 0;
  padding: 0;
}

.events-block__content {
  margin-top: 6vh;
  line-height: 150%;
  max-height: 90vh;
  overflow-y: auto;
}

.events-block__content::-webkit-scrollbar { width: 0; }

.events-block__content { -ms-overflow-style: none; }

.events-block__content { overflow: -moz-scrollbars-none; }


.hint-window {
  position: absolute;
  transform: translate(7px, -100%);
  padding: 4px;
  background: white;
  border: 1px solid black;
  opacity: 0.7;
  white-space: nowrap;
}

</style>