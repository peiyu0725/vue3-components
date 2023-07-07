<script setup>
import {
    ref,
    reactive,
    onMounted,
    getCurrentInstance,
    watch
} from "vue";
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";

const props = defineProps({
    drawerRail: Boolean
});
const instance = getCurrentInstance();
const calendarRef = ref(null);
const calendar = ref(null);
const view = ref("dayGridMonth");
const viewItems = reactive([
    { title: "月", value: "dayGridMonth" },
    { title: "周", value: "timeGridWeek" },
    { title: "天", value: "timeGridDay" },
    { title: "列表", value: "listWeek" }
]);

const options = ref({
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    locales: allLocales,
    locale: "zh-tw",
    initialView: "dayGridMonth",
    headerToolbar: false,
    height: "calc(100% - 56px)",
    dayMaxEventRows: true,
    eventColor: "#00B0FF",
    events: "https://fullcalendar.io/demo-events.json?overload-day"
})

const handleViewSelect = (val) => {
    calendar.value.changeView(val);
};
const handlePrev = () => {
    calendar.value.prev();
    instance.ctx.$forceUpdate();
};
const handleNext = () => {
    calendar.value.next();
    instance.ctx.$forceUpdate();
};
const handleToday = () => {
    calendar.value.today();
    instance.ctx.$forceUpdate();
};
const updateSize = () => {
    if (calendar.value) {
        calendar.value.updateSize();
    }
};
watch(props, (val) => {
    setTimeout(() => {
        updateSize();
    }, 200);
});
</script>
<template>
    <div class="calendar">
        <div class="header-toolbar">
            <div class="header-toolbar__btns">
                <v-btn variant="outlined" size="small" icon @click="handlePrev">
                    <v-icon size="28">mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn variant="outlined" size="small" icon @click="handleNext">
                    <v-icon size="28">mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn variant="outlined" @click="handleToday"> 今天 </v-btn>
            </div>
            <div class="header-toolbar__title" v-if="calendar">
                {{ calendar.view.title }}
            </div>
            <div class="header-toolbar__select">
                <v-select v-model="view" :active="true" :autofocus="true" :menu-props="{ offset: 3 }" :items="viewItems"
                    density="compact" append-inner-icon="mdi-chevron-down" hide-details
                    @update:modelValue="handleViewSelect"></v-select>
            </div>
        </div>
        <FullCalendar ref="calendarRef" :options="options"></FullCalendar>
    </div>
</template>
<style lang="scss" scoped>
$primaryLightPressed: #008edb;

.calendar {
    padding: 12px;
    height: 100%;
}

.v-btn--density-default {
    border-radius: 8px;
    border-color: $primaryLightPressed;
    color: $primaryLightPressed;

    &:hover {
        background: #e1f5fe;

        .v-btn__overlay {
            opacity: 0;
        }
    }
}

.v-btn--icon {
    height: 36px !important;
    width: 36px !important;
}

.header-toolbar {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__btns {
        width: 170px;

        &>button:not(:last-of-type) {
            margin-right: 12px;
        }
    }

    &__title {
        font-size: 24px;
        color: #0a1a26;
    }

    &__select {
        width: 170px;
    }
}
</style>
<style lang="scss">
$primaryLightNormal: #00b0ff;
$primaryLightPressed: #008edb;
$borderDeep: #e6ecef;

.v-select {
    border: 1px solid #979797;
    border-radius: 8px;

    &.v-select--active-menu {
        border: 1px solid $primaryLightPressed;

        .v-select__selection-text {
            color: $primaryLightPressed;
        }

        .v-field__append-inner i {
            color: #949594;
        }
    }

    .v-field__overlay {
        display: none;
    }

    .v-field__outline {

        &::before,
        &::after {
            display: none !important;
        }
    }

    .v-field__input {
        opacity: 1;
        min-height: 36px;
    }

    .v-select__selection-text {
        font-weight: 500;
        font-size: 14px;
        color: #0a1a26;
    }

    .v-field__append-inner i {
        color: #0a1a26;
        opacity: 1;
    }
}

.fc-scrollgrid-liquid {
    border-top-width: 2px !important;
    border-color: $borderDeep !important;
}

.fc-col-header th {
    border-bottom-width: 2px !important;
    border-color: $borderDeep !important;
}

td {
    border-color: $borderDeep !important;
}

.fc-col-header-cell {
    .fc-scrollgrid-sync-inner {
        .fc-col-header-cell-cushion {
            font-weight: 400;
            font-size: 14px;
            color: #848484;
            padding: 6px 4px;
        }
    }
}

.fc-daygrid-day-top {
    justify-content: center;
    padding-top: 2px;

    .fc-daygrid-day-number {
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        color: #0a1a26;
    }
}

.fc-daygrid-event,
.fc-timegrid-event {
    border-radius: 10px !important;
    font-size: 12px;
    cursor: pointer;
    color: #0a1a26;

    .fc-event-time,
    .fc-event-title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .fc-event-title-container {
        padding: 0 4px;
    }

    &:hover {
        background-color: #e1f5fe;
    }
}

.fc-timegrid-event {
    .fc-event-main {
        padding: 4px;
    }
}

.fc-day-today {
    background-color: initial !important;

    .fc-daygrid-day-top {
        .fc-daygrid-day-number {
            background-color: $primaryLightNormal;
            color: #ffffff;
        }
    }
}

.fc-timegrid-axis,
.fc-timegrid-slot {
    font-size: 14px;
}

.fc-list-table {
    th {
        font-weight: 500;
        font-size: 14px;
        background: #d0ebff !important;
    }

    td {
        font-size: 12px;
    }

    tr {
        &:hover>td {
            background-color: $borderDeep !important;
        }
    }
}

.fc-popover {
    .fc-popover-header {
        background: $borderDeep;
        font-size: 14px;
    }

    .fc-popover-body {
        background: #ffffff;
    }
}

.v-menu {
    .v-overlay__content {
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25) !important;
        border-radius: 5px !important;
    }

    .v-list-item {

        &:hover,
        &--active {
            background-color: #eff8ff;

            .v-list-item__overlay {
                display: none;
            }

            .v-list-item-title {
                color: $primaryLightPressed;
            }
        }
    }
}
</style>