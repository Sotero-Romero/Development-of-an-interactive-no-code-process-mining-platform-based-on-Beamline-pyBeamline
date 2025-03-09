<template>
  <div class="main">
    <!-- VueFlow Diagram -->
    <div>
      <VueFlow
          v-model="nodes"
          v-model:edges="edges"
          class="canva"
          @node-click="onNodeClick"
          :connection-mode="ConnectionMode.Strict"
          @connect="onConnect"
      >
        <template #edge-custom="customEdgeProps">
          <CustomEdge v-bind="customEdgeProps" />
        </template>
        <template #node-standard="props">
          <StandardNode v-bind="props" />
        </template>
        <template #node-start="props">
          <StartNode v-bind="props" />
        </template>
        <template #node-end="props">
          <EndNode v-bind="props" />
        </template>
        <background />
      </VueFlow>
    </div>

    <div
        v-if="selectedNode"
        class="optionTab"
    >
      <button class="absolute top-2 right-2 text-xl" @click="selectedNode = null">
        ✖
      </button>
      <h2 class="text-xl font-bold mb-2">Node Details</h2>

      <!-- Editable Field -->
      <label class="block font-semibold">Label:</label>
      <input
          v-model="selectedNode.data.parameter1"
          class="border rounded w-full p-2 mt-1"
      />

      <label class="block font-semibold">Parameter2:</label>

      <input
          v-model="selectedNode.data.paramater2"
          class="border rounded w-full p-2 mt-1"
      />
      <p><strong>Type:</strong> {{ selectedNode.type }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {Edge, MarkerType, VueFlow, ConnectionMode, Connection} from "@vue-flow/core";
import Background from "@/components/Background.vue";
import StandardNode from "./StandardNode.vue";
import StartNode from "./StartNode.vue";
import EndNode from "./EndNode.vue";
import CustomEdge from "@/components/CustomEdge.vue";
import {CustomData} from "@/components/edges.js";

function onConnect(params : Connection) {
  // You can generate a unique id for the new edge.
  const newEdge = {
    id: `e${params.source}-${params.target}`,
    source: params.source,
    target: params.target,
    type: 'custom',
    animated:true
  };
  edges.value.push(newEdge);
}

type CustomEdgeTypes = 'custom'

type CustomEdge = Edge<CustomData, any, CustomEdgeTypes>


// Example nodes and edges
const nodes = ref ([
  { id: "1", type: "start", position: { x: 400, y: 200}, data: { name: "example_source", parameters: {"par1":"papaya"} , label: "node 1"} },
  { id: "2", type: "standard", position: { x: 800, y: 300}, data: { name: "example_intermediate_block"} },
  { id: "3", type: "end", position: { x: 1200, y: 200 }, data: {  name: "example_sink" ,parameters: {"par2":"hehe"} , label: "node 3"} }
]);

const edges = ref<CustomEdge[]>([
  { id: "e1-2", source: "1", target: "2" , type: "custom", animated:true},
]);

const selectedNode = ref(null);

// Handle node click event
const onNodeClick = (event) => {
  if (selectedNode.value === event.node){
    selectedNode.value = null;
  }else{
    selectedNode.value = event.node;

  }
};
</script>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';


.canva{
  width: 100%;
  height: 100%;
  position: fixed;
}
.main{
  width: 100%;
  height: 100%;

}
.optionTab{
  width: 30%;
  height: 100%;
  background: gray;
  position: fixed;
  right:0

}
</style>

