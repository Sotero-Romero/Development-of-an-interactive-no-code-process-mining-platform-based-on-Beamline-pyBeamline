<script setup lang="ts">
import type { EdgeProps } from '@vue-flow/core';
import { BezierEdge } from '@vue-flow/core';

import { CustomData } from './edges.js'

// props were passed from the slot using `v-bind="customEdgeProps"`
const props = defineProps<EdgeProps<CustomData>>(
);

const edgeStyle = { stroke: props.data.color || 'grey', strokeWidth: 2 };

</script>

<script lang="ts">
export default {
  name: 'CustomEdge',
};
</script>

<template>
  <BezierEdge
      :source-x="sourceX"
      :source-y="sourceY"
      :target-x="targetX"
      :target-y="targetY"
      :source-position="sourcePosition"
      :target-position="targetPosition"
      :style="edgeStyle"
  />
</template>

<style>

</style>