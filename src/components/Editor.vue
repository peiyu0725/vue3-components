<script setup>
import { ref, computed, reactive } from "vue"
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
  button: ['text', 'fontSize', 'fontColor', 'bgColor'],
  rect: ['bgColor'],
  image: []
})
const elementMapping = computed(() => {
  return {
    text: {
      type: 'text',
      options: {
        fontColor: '#000000',
        text: 'Text',
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
        height: 36
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
  { text: 'Text', value: 'text' },
  { text: 'Button', value: 'button' },
  { text: 'Rect', value: 'rect' },
  { text: 'Image', value: 'image' }
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
const onClickGroup = (e) => {
  selectoRef.value.clickTarget(e.inputEvent, e.inputTarget);
};
const onResize = ({ target, width, height }) => {
  target.style.width = `${width}px`;
  target.style.height = `${height}px`;
};
const onSelect = (e) => {
  selectedItems.value = e.selected;
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
const handleUpdateColor = (val, type) => {
  if (!selectedItems.value[0]) return
  const id = selectedItems.value[0].dataset.id
  const index = elements.findIndex(element => element.id === Number(id))
  elements[index].options[type] = val
}
const showSetting = (type) => {
  if (selectedItems.value.length > 1) {
    return false
  }
  else {
    const itemType = selectedItems.value[0].dataset.type
    if (!itemType) return false
    return settingMapping[itemType].includes(type)
  }
}

const getElementColorById = (id, type) => {
  const index = elements.findIndex(element => element.id === Number(id))
  return elements[index].options[type]
}

</script>
<template>
  <div class="editor">
    <input type="file" ref="uploadRef" accept="image/*" class="d-none" @change="handleUploadFile" />
    <div class="editor__drag-area" @drop="handleDropListItem" @dragover.prevent>
      <component v-for="item in elements" v-bind="item.options" :data-id="item.id" :is="components[item.type]"
        :key="item.id" class="element">
      </component>
      <Moveable ref="moveableRef" v-bind="moveableOptions" @drag="onDrag" @resize="onResize" @clickGroup="onClickGroup"
        @dragGroup="onDragGroup" />
      <VueSelecto ref="selectoRef" v-bind="selectoOptions" @dragStart="onDragStart" @select="onSelect"
        @selectEnd="onSelectEnd" />
    </div>
    <div class="editor__drag-list">
      <v-list>
        <v-list-subheader>Elements</v-list-subheader>
        <draggable v-model="elementList" :sort="false" itemKey="value" @start="handleDragListItemStart"
          @end="handleDragListItemEnd">
          <template #item="{ element }">
            <v-list-item :value="element.value" @touchend="handleTouchEndListItem">{{ element.text }}</v-list-item>
          </template>
        </draggable>
      </v-list>
      <v-divider></v-divider>
      <Transition name="slide-fade">
        <div class="setting-block" v-if="selectedItems.length > 0">
          <div class="setting-title">Setting</div>
          <div>
            <div class="setting-subtitle">Layer</div>
            <div class="d-flex">
              <v-btn variant="plain">
                <v-icon size="24">mdi-format-align-top</v-icon>
              </v-btn>
              <v-btn variant="plain">
                <v-icon size="24">mdi-format-align-bottom</v-icon>
              </v-btn>
              <v-btn variant="plain">
                <v-icon size="24">mdi-format-vertical-align-top</v-icon>
              </v-btn>
              <v-btn variant="plain">
                <v-icon size="24">mdi-format-vertical-align-bottom</v-icon>
              </v-btn>
            </div>
          </div>
          <div v-if="showSetting('text')">
            <div class="setting-subtitle">Text</div>
            <v-text-field placeholder="Text" density="compact" hide-details></v-text-field>
          </div>
          <div v-if="showSetting('fontSize')">
            <div class="setting-subtitle">Font Size</div>
            <v-text-field placeholder="Font Size" density="compact" type="number" :min="8" hide-details></v-text-field>
          </div>
          <div v-if="showSetting('fontColor')">
            <div class="setting-subtitle">Font Color</div>
            <ColorPicker :color="getElementColorById(selectedItems[0].dataset.id, 'fontColor')"
              @change="handleUpdateColor($event, 'fontColor')" />
          </div>
          <div v-if="showSetting('bgColor')">
            <div class="setting-subtitle">Background Color</div>
            <ColorPicker :color="getElementColorById(selectedItems[0].dataset.id, 'color')"
              @change="handleUpdateColor($event, 'color')" />
          </div>
        </div>
      </Transition>
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
    width: calc(100% - 250px);
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
    width: 250px;
    height: 100%;
    background-color: #F3F3F3;
    border-radius: 10px;

    .setting-block {
      height: calc(100% - 250px);
      padding: 10px 16px;

      .v-btn {
        padding: 0;
        margin: 0;
        min-width: 40px;
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

      .setting-title,
      .setting-subtitle {
        font-weight: 500;
        color: #848484;
      }

      .setting-title {
        font-size: 14px;
        margin: 4px 0;
      }

      .setting-subtitle {
        font-size: 12px;
        margin: 14px 0 4px 0;
      }
    }

    .v-list {
      height: 250px;
      padding: 0;
      background-color: #F3F3F3;
      overflow: visible;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;

      .v-list-subheader {
        border-radius: 10px;
      }

      &-item {
        cursor: grab;
        font-size: 14px;
      }
    }
  }

  &__element-setting {
    position: absolute;
  }

  .element {
    position: absolute;
    transition: none;
  }
}
</style>