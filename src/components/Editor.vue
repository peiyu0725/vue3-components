<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from "vue"
import Moveable from "vue3-moveable"
import { VueSelecto } from "vue3-selecto"
import draggable from "vuedraggable"
import ElementButton from '../components/Elements/ElementButton.vue'
import ElementRect from '../components/Elements/ElementRect.vue'
import ElementImage from '../components/Elements/ElementImage.vue'
import ElementText from '../components/Elements/ElementText.vue'
import ColorPicker from './ColorPicker.vue'

const moveableRef = ref(null)
const selectoRef = ref(null)
const uploadRef = ref(null)
const selectedItems = ref([])
const dragItem = ref(null)
const catchImageEvent = ref(null)
const fontSize = reactive([12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 64, 72])
const settingMapping = reactive({
  text: ['text', 'fontSize', 'fontColor'],
  button: ['text', 'fontSize', 'fontColor', 'color'],
  rect: ['color'],
  image: []
})
const elementMapping = computed(() => {
  return {
    text: {
      type: 'text',
      options: {
        fontColor: '#000000',
        text: 'Text',
        fontSize: 16
      }
    },
    rect: {
      type: 'rect',
      options: {
        color: '#D0EBFF',
        width: 100,
        height: 100
      }
    },
    button: {
      type: 'button',
      options: {
        color: '#00B0FF',
        fontColor: '#ffffff',
        text: 'Button',
        width: 120,
        height: 36,
        fontSize: 16
      }
    },
    image: {
      type: 'image',
      options: {}
    }
  }
})
const elements = reactive([])
const elementList = reactive([
  { text: 'Text', value: 'text', icon: 'mdi-format-text' },
  { text: 'Button', value: 'button', icon: 'mdi-gesture-tap-button' },
  { text: 'Rect', value: 'rect', icon: 'mdi-rectangle' },
  { text: 'Image', value: 'image', icon: 'mdi-image' }
])
const components = {
  button: ElementButton,
  rect: ElementRect,
  image: ElementImage,
  text: ElementText
}

const moveableOptions = computed(() => {
  return {
    target: selectedItems.value,
    draggable: true,
    resizable: true,
    snappable: true,
    keepRatio: selectedItems.value.length > 0 && (selectedItems.value.length > 1 || selectedItems.value[0].tagName === 'IMG'),
    origin: false,
    bounds: { left: 0, top: 0, right: 0, bottom: 0, position: "css" },
    snapThreshold: 5,
    isDisplaySnapDigit: true,
    snapDirections: { top: true, right: true, bottom: true, left: true, center: true, middle: true },
    elementSnapDirections: { top: true, right: true, bottom: true, left: true, center: true, middle: true },
    snapDigit: 0,
    snapGridWidth: 20,
    snapGridHeight: 20,
    elementGuidelines: [".element"],
  };
});
const selectoOptions = computed(() => {
  return {
    container: ".editor__drag-area",
    selectableTargets: [".element"],
    selectByClick: true,
    selectFromInside: false,
    toggleContinueSelect: ["shift"],
    ratio: 0,
    hitRate: 0,
  };
});

const onDragStart = (e) => {
  const target = e.inputEvent.target;
  if (
    moveableRef.value.isMoveableElement(target) ||
    selectedItems.value.some((t) => t === target || t.contains(target))
  ) {
    e.stop();
  }
};
const onDrag = (e) => {
  e.target.style.transform = e.transform;
};
const onDragGroup = (e) => {
  e.events.forEach((ev) => {
    ev.target.style.transform = ev.transform;
  });
};

const removeActive = (e) => {
  if (
    e.target.classList.contains('v-btn__content') ||
    e.target.classList.contains('element') ||
    e.target.classList.contains('moveable-area') ||
    e.target.classList.contains('moveable-direction')
  ) {
    return
  }
  selectedItems.value = []
}
const onClickGroup = (e) => {
  selectoRef.value.clickTarget(e.inputEvent, e.inputTarget);
}
const onResize = ({ target, width, height }) => {
  target.style.width = `${width}px`;
  target.style.height = `${height}px`;
}
const onResizeEnd = ({ target }) => {
  const id = Number(target.dataset.id)
  const findIndex = elements.findIndex(ele => ele.id === id)
  elements[findIndex].options.width = target.clientWidth
  elements[findIndex].options.height = target.clientHeight
}
const onSelect = (e) => {
  selectedItems.value = e.selected.filter(target => target.dataset.lock === 'false');
};
const onSelectEnd = (e) => {
  if (e.isDragStart) {
    e.inputEvent.preventDefault();

    setTimeout(() => {
      moveableRef.value.dragStart(e.inputEvent);
    });
  }
};

const handleDragListItemStart = ({ oldIndex }) => {
  const item = elementList[oldIndex]
  dragItem.value = item
}
const handleDragListItemEnd = () => {
  dragItem.value = null
}
const addElement = (x, y) => {
  const item = elementMapping.value[dragItem.value.value]
  const obj = {
    id: Date.now(),
    type: item.type,
    lock: false,
    options: {
      ...item.options,
      x,
      y
    }
  }
  if (dragItem.value.value === 'image') {
    catchImageEvent.value = obj
    uploadRef.value.click()
  }
  else {
    elements.push(obj)
  }
}
const handleTouchEndListItem = (e) => {
  var endTarget = document.elementFromPoint(
    e.changedTouches[0].clientX,
    e.changedTouches[0].clientY
  )
  let loopCount = 0
  let target = endTarget
  if (!target) return
  let findCardTarget = null
  while (loopCount < 3) {
    if (target.classList.contains('editor__drag-area')) {
      findCardTarget = target
      break
    }
    loopCount += 1
    target = target.parentNode
  }
  if (findCardTarget) {
    const { x, y } = findCardTarget.getBoundingClientRect()
    addElement(e.changedTouches[0].clientX - x,
      e.changedTouches[0].clientY - y)
  }
}
const handleDropListItem = (e) => {
  if (!dragItem.value) return
  const { offsetX, offsetY } = e
  addElement(offsetX, offsetY)
}
const handleUploadFile = (e) => {
  const file = e.target.files[0]
  const src = URL.createObjectURL(file)
  const img = new Image()
  img.onload = function () {
    catchImageEvent.value.options.src = src
    catchImageEvent.value.options.width = this.width
    catchImageEvent.value.options.height = this.height
    elements.push(catchImageEvent.value)
    catchImageEvent.value = null
  }
  img.src = src
  uploadRef.value.value = ''
}
const handleUpdateOptions = (val, type) => {
  if (!selectedItems.value[0]) return
  const id = selectedItems.value[0].dataset.id
  const index = elements.findIndex(element => element.id === Number(id))
  elements[index].options[type] = val
}
const handleUpdateLayer = (type) => {
  if (!selectedItems.value[0]) return
  const oldIndex = elements.findIndex(
    (item) => item.id === Number(selectedItems.value[0].dataset.id)
  )
  let newIndex = null
  switch (type) {
    case 'front':
      newIndex = oldIndex + 1
      break
    case 'back':
      newIndex = oldIndex === 0 ? 0 : oldIndex - 1
      break
    case 'forward':
      newIndex = elements.length
      break
    case 'backward':
      newIndex = 0
      break
  }
  var element = elements[oldIndex]
  elements.splice(oldIndex, 1)
  elements.splice(newIndex, 0, element)
}
const handleElementLock = (id) => {
  const findIndex = elements.findIndex(ele => ele.id === id)
  if (findIndex === -1) return
  selectedItems.value = []
  elements[findIndex].lock = !elements[findIndex].lock
}
const handleElementActive = (id) => {
  const targets = document.getElementsByClassName('element')
  const matchTarget = Array.from(targets).find(target => Number(target.dataset.id) === id)
  if (!matchTarget || matchTarget.dataset.lock === 'true') {
    return
  }
  else {
    selectedItems.value = [matchTarget]
  }
}
const handleKeydown = (e) => {
  const keyCode = e.keyCode
  if (keyCode === 46 && selectedItems.value.length > 0) {
    selectedItems.value.forEach(item => {
      const findIndex = elements.findIndex(ele => ele.id === Number(item.dataset.id))
      if (findIndex === -1) return
      elements.splice(findIndex, 1)
    })
    selectedItems.value = []
  }
}

const showSetting = (type) => {
  if (selectedItems.value.length < 1 || selectedItems.value.length > 1) {
    return false
  }
  else {
    const itemType = selectedItems.value[0].dataset.type
    if (!itemType) return false
    return settingMapping[itemType].includes(type)
  }
}
const getElementOptionsById = (id, type) => {
  const index = elements.findIndex(element => element.id === Number(id))
  return elements[index].options[type]
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

</script>
<template>
  <div class="editor">
    <input type="file" ref="uploadRef" accept="image/*" class="d-none" @change="handleUploadFile" />
    <div class="editor__drag-area" @pointerdown.stop="removeActive" @drop="handleDropListItem" @dragover.prevent>
      <component v-for="item in elements" v-bind="item.options" :data-id="item.id" :data-lock="item.lock"
        :is="components[item.type]" :key="item.id" class="element">
      </component>
      <Moveable ref="moveableRef" v-bind="moveableOptions" @drag="onDrag" @resize="onResize" @resizeEnd="onResizeEnd"
        @clickGroup="onClickGroup" @dragGroup="onDragGroup" />
      <VueSelecto ref="selectoRef" v-bind="selectoOptions" @dragStart="onDragStart" @select="onSelect"
        @selectEnd="onSelectEnd" />
    </div>
    <div class="editor__drag-list">
      <v-list class="element-block" density="compact">
        <v-list-subheader>Elements</v-list-subheader>
        <draggable v-model="elementList" :sort="false" itemKey="value" @start="handleDragListItemStart"
          @end="handleDragListItemEnd">
          <template #item="{ element }">
            <v-list-item :value="element.value" :active="false" @touchend="handleTouchEndListItem">{{ element.text
            }}</v-list-item>
          </template>
        </draggable>
      </v-list>
      <v-divider></v-divider>
      <div class="setting-block">
        <div class="block-title">Setting</div>
        <Transition name="slide-fade">
          <div v-if="(selectedItems.length === 1)">
            <div class="block-subtitle">Layer</div>
            <div class="d-flex justify-space-around">
              <v-tooltip text="Front" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="plain" @click="handleUpdateLayer('front')">
                    <v-icon size="24">mdi-format-vertical-align-top</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Back" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="plain" @click="handleUpdateLayer('back')">
                    <v-icon size="24">mdi-format-vertical-align-bottom</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Forward" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="plain" @click="handleUpdateLayer('forward')">
                    <v-icon size="24">mdi-format-align-top</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip text="Backward" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="plain" @click="handleUpdateLayer('backward')">
                    <v-icon size="24">mdi-format-align-bottom</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>
        </Transition>
        <Transition name="slide-fade">
          <div v-if="showSetting('text')">
            <div class="block-subtitle">Text</div>
            <v-text-field placeholder="Text" density="compact"
              :model-value="getElementOptionsById(selectedItems[0].dataset.id, 'text')" hide-details
              @update:modelValue="handleUpdateOptions($event, 'text')"></v-text-field>
          </div>
        </Transition>
        <Transition name="slide-fade">
          <div v-if="showSetting('fontSize')">
            <div class="block-subtitle">Font Size</div>
            <v-text-field placeholder="Font Size" density="compact" type="number"
              :model-value="getElementOptionsById(selectedItems[0].dataset.id, 'fontSize')" :min="8" hide-details
              @update:modelValue="handleUpdateOptions($event, 'fontSize')"></v-text-field>
          </div>
        </Transition>
        <div class="d-flex justify-space-between">
          <Transition name="slide-fade">
            <div v-if="showSetting('fontColor')">
              <div class="block-subtitle">Font Color</div>
              <ColorPicker :color="getElementOptionsById(selectedItems[0].dataset.id, 'fontColor')"
                @change="handleUpdateOptions($event, 'fontColor')" />
            </div>
          </Transition>
          <Transition name="slide-fade">
            <div v-if="showSetting('color')">
              <div class="block-subtitle">Background Color</div>
              <ColorPicker :color="getElementOptionsById(selectedItems[0].dataset.id, 'color')"
                @change="handleUpdateOptions($event, 'color')" />
            </div>
          </Transition>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list class="layer-block" density="compact">
        <v-list-subheader>Layer</v-list-subheader>
        <draggable v-model="elements" itemKey="id" class="layer-list">
          <template #item="{ element }">
            <v-list-item :value="element.id" :active="false" @click="handleElementActive(element.id)">
              {{ element.type }}
              <template #prepend>
                <v-icon>{{ elementList.find(item => item.value === element.type).icon }}</v-icon>
              </template>
              <template #append>
                <v-icon @click.stop="handleElementLock(element.id)">
                  {{ element.lock ? 'mdi-lock' : 'mdi-lock-open-outline' }}
                </v-icon>
              </template>
            </v-list-item>
          </template>
        </draggable>
      </v-list>
    </div>
  </div>
</template>
<style lang="scss">
.editor {
  width: 100%;
  height: 100%;
  display: flex;

  &__drag-area {
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: calc(100% - 280px);
    height: 100%;
    background-image: -webkit-repeating-radial-gradient(bottom right,
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.4) 1px,
        transparent 1px,
        transparent 100%);
    background-image: -moz-repeating-radial-gradient(bottom right,
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.4) 1px,
        transparent 1px,
        transparent 100%);
    background-image: -ms-repeating-radial-gradient(bottom right,
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.4) 1px,
        transparent 1px,
        transparent 100%);
    background-image: repeating-radial-gradient(bottom right,
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.4) 1px,
        transparent 1px,
        transparent 100%);
    -webkit-background-size: 20px 20px;
    -moz-background-size: 20px 20px;
    background-size: 20px 20px;
    background-repeat: repeat;
    background-color: #fff;
  }

  &__drag-list {
    width: 280px;
    height: 100%;
    background-color: #F3F3F3;
    border-radius: 10px;

    .block-title,
    .block-subtitle {
      font-weight: 500;
      color: #848484;
    }

    .block-title {
      font-size: 14px;
      margin: 4px 0;
    }

    .block-subtitle {
      font-size: 12px;
      margin: 14px 0 4px 0;
    }

    .setting-block {
      height: 360px;
      padding: 10px 16px;

      .v-btn {
        padding: 0;
        margin: 0;
        min-width: 36px;
      }

      .v-field {
        border: 1px solid #979797;
        border-radius: 5px;

        &__overlay {
          display: none;
        }

        &__outline {

          &::before,
          &::after {
            display: none !important;
          }
        }
      }
    }

    .element-block,
    .layer-block {
      padding: 0;
      background-color: #F3F3F3;
      overflow: visible;

      .v-list-subheader {
        border-radius: 10px;
        padding: 10px 0;
      }

      .v-list-item {
        cursor: grab;
        font-size: 14px;
        text-transform: uppercase;
      }
    }

    .element-block {
      height: 210px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .layer-block {
      height: calc(100% - 210px - 360px);
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;

      .layer-list {
        height: calc(100% - 42px);
        overflow-y: auto;
        padding-bottom: 10px;
      }

      .v-list-item {
        text-transform: uppercase;
      }

      .v-list-item__prepend {
        i {
          margin-inline-end: 16px;
        }
      }
    }
  }

  &__element-setting {
    position: absolute;
  }

  .element {
    position: absolute;
    transition: none;
    z-index: 1;
  }
}
</style>