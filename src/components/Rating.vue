<template>
    <div class="rating">
      <span
        v-for="star in stars"
        :key="star"
        class="star"
        :class="{ 'active': star <= currentRating }"
        @click="setRating(star)"
      >
        ★
      </span>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentRating: 0,
        stars: [1, 2, 3, 4, 5],
      };
    },
    methods: {
      setRating(star) {
        this.currentRating = star;
        this.$emit('rating-selected', star); // 向父组件传递评分
      },
    },
  };
  </script>
  
  <style scoped>
  .star {
    cursor: pointer;
    font-size: 2rem;
    color: lightgray;
  }
  .star.active {
    color: gold;
  }
  </style>