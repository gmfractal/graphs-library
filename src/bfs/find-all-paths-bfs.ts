import { AdjacencyList, GraphNode } from "../types";

/** Finds all paths from a source node to a destination node using breadth first search. This function can handle cyclic graphs by tracking visited nodes and aborts a traversal attempt if a node is visited more than once. **/
export function findAllPathsBfs(graph: AdjacencyList, source:GraphNode, destination:GraphNode) {
    const queue = [[source]];
    const visitedNodes = new Map<GraphNode, boolean>()
    const viablePathsToDestination: GraphNode[][] = [];
  
    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentNode = currentPath!.at(-1);
  
      if (visitedNodes.get(currentNode!) === true) {
        console.warn('Circular path detected, terminating this traversal attempt');
      }
  
      if (currentNode === destination) {
        viablePathsToDestination.push(currentPath!);
        continue;
      }
  
      const neighbors = graph[currentNode!];
  
      if (!neighbors) {
        console.error('Graph does not contain an entry for this node');
        continue;
      }
  
      for (let neighbor of neighbors) {
        queue.push([...currentPath!, neighbor]);
      }
  
      visitedNodes.set(currentNode!, true);
    }
  
    return viablePathsToDestination;
  }