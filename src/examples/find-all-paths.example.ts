import {
  findAllPathsBfs,
  findAllPathsDfsIterative,
  findAllPathsDfsRecursive,
} from "../find-all-paths";
import { AdjacencyList, GraphNode } from "../find-all-paths/types";

const graph1: AdjacencyList = {
  0: [1, 2],
  1: [3],
  2: [3],
  3: [],
};

const graph2: AdjacencyList = {
  a: ["b", "c"],
  b: ["d"],
  c: ["e"],
  d: ["f"],
  e: [],
  f: [],
};

const viablePathsFromDfsRecursive: GraphNode[][] = [];
findAllPathsDfsRecursive(graph1, 0, 3, viablePathsFromDfsRecursive);
console.log(viablePathsFromDfsRecursive);

console.log(findAllPathsDfsIterative(graph1, 0, 3));

console.log(findAllPathsBfs(graph1, 0, 3));
