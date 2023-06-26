<script lang="ts" setup>
    import dayjs from 'dayjs';
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
            default: 2
        }
    });

    const time = ref(0);

    
    // return continuosly updated time since the date provided in "date" prop
    const interval = setInterval(() => {
        time.value = dayjs().diff(dayjs(props.date), props.unit, true).toFixed(props.digits);
    }, 100);


    // stop the interval when the component is unmounted
    onBeforeUnmount(() => {
        clearInterval(interval);
    });


</script>

<template>
    <span>{{ time }}</span>
</template>