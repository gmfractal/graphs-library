import { AdjacencyList, GraphNode, PathTracker, VisitedNodes } from "../types";

/** Finds all paths from a source node to a destination node using a recursive form of depth first search. This 
 * function can handle cyclic graphs by tracking visited nodes and aborts a traversal attempt if a node is visited more 
 * than once. This function requires a viablePathsToDestination[] to be passed as an argument which will be used to 
 * store all viable paths to the destination node that are found. 
 * 
 * USAGE:  
 *         
 * const viablePaths: GraphNode[][] = []
 * 
 * findAllPathsDfsRecursive(graph, 0, 3, viablePaths);
 * 
 * console.log(viablePaths)  // Example: [ [0,1,2], [0,1,3] ]
 **/
export function findAllPathsDfsRecursive(graph: AdjacencyList, source: GraphNode, destination:GraphNode, viablePathsToDestination: PathTracker[], pathTracker?: PathTracker, visitedNodes?: VisitedNodes, ) {
    if (!pathTracker) {
      pathTracker = []
    }
  
    if (!visitedNodes) {
      visitedNodes = new Map<GraphNode, boolean>()
    }
  
    if (visitedNodes.get(source) === true) {
      console.warn('Circular path detected, terminating this traversal attempt');
      return;
    }
  
    if (source === destination) {
      pathTracker.push(source);
      viablePathsToDestination.push(pathTracker)
      console.log(`Viable path to destination found: ${pathTracker}`)
      return;
    }
  
    if (!graph[source]) {
      console.warn('Graph does not contain an entry for this node');
      return;
    }
  
    if (source !== destination && graph[source].length === 0) {
      console.warn('No path to destination found , terminating attempt');
      return;
    }
  
    visitedNodes.set(source, true);
    pathTracker.push(source);
  
    const neighbors = graph[source];
  
    for (let neighbor of neighbors) {
      findAllPathsDfsRecursive(
        graph,
        neighbor,
        destination,
        viablePathsToDestination,
        structuredClone(pathTracker),
        structuredClone(visitedNodes)
      );
    }
  }