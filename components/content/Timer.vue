<script lang="ts" setup>
    // import dayjs from 'dayjs';
    import { ref, defineProps, onBeforeUnmount } from 'vue'
    
    const props = defineProps({
        date: {
            type: String,
            default: '1988-09-30'
        },
        unit: {
            type: String,
            default: 'year'
        },
        digits: {
            type: Number,
            default: 0
        }
    });

    // const { date, unit, digits } = toRefs(props);

    

    // const { currentTime } = getTimeSince(props.date, props.unit, props.digits);

</script>

<template>
    <span>{{ date }}</span>
</template>