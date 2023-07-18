import {
  findLeastCostlyPathDijkstra,
  WeightedAdjacencyList,
} from "../find-least-costly-path-dijkstra";

const graph: WeightedAdjacencyList = {
  A: [
    { nodeId: "B", edgeWeight: 3 },
    { nodeId: "C", edgeWeight: 2 },
  ],
  B: [{ nodeId: "D", edgeWeight: 2 }],
  C: [{ nodeId: "D", edgeWeight: 6 }],
  D: [],
};

console.log(findLeastCostlyPathDijkstra(graph, "A", "D"));

// Expected:
// {
//     leastCostlyPathFromOriginToDestination: [
//       { nodeId: 'A', traversalCostFromOrigin: 0 },
//       { nodeId: 'B', traversalCostFromOrigin: 3 },
//       { nodeId: 'D', traversalCostFromOrigin: 5 }
//     ],
//     completeTraversalCostTree: [
//       { nodeId: 'A', traversalCostFromOrigin: 0, previousNode: null },
//       { nodeId: 'C', traversalCostFromOrigin: 2, previousNode: 'A' },
//       { nodeId: 'D', traversalCostFromOrigin: 5, previousNode: 'B' },
//       { nodeId: 'B', traversalCostFromOrigin: 3, previousNode: 'A' }
//     ]
//   }
