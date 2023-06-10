// import { ref, onBeforeUnmount } from "vue";

// const dayjs = useDayjs();
// const dateNow = dayjs();
// const { $useDayjs } = useNuxtApp()
// const dateNow = $useDayjs();

// export const getTimeSince = (date: string, unit: string, digits: Number) => {
//   const dateSince = dateNow.diff(date, unit, true);
//   const currentTime = ref(dateSince);
//   const updateCurrentTime = () => {
//     currentTime.value = dateSince;
//   };
//   const updateTimeInterval = setInterval(updateCurrentTime, 100);
//   onBeforeUnmount(() => {
//     clearInterval(updateTimeInterval);
//   });
//   return {
//     currentTime,
//   };
// };