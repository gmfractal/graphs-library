import { WeightedAdjacencyList, NodeId, NodeStates, NodeState } from "./types";

function findAllReachableNodesFromOrigin(
  graph: WeightedAdjacencyList,
  origin: NodeId
): NodeId[] {
  const stack: NodeId[] = [origin];
  const reachableNodes: NodeId[] = [];
  const visitedNodes = new Map<NodeId, boolean>();

  while (stack.length > 0) {
    const currentNode = stack.pop()!;

    if (visitedNodes.get(currentNode) === true) {
      break;
    }

    reachableNodes.push(currentNode);
    visitedNodes.set(currentNode, true);

    for (const neighbor of graph[currentNode]) {
      stack.push(neighbor.nodeId);
    }
  }

  return reachableNodes;
}

function getInitialNodeStates(nodeIds: NodeId[], origin: NodeId): NodeStates {
  const initialNodeStates: NodeStates = new Map<NodeId, NodeState>(
    nodeIds.map((nodeId) => {
      return [
        nodeId,
        {
          nodeId,
          traversalCostFromOrigin: nodeId === origin ? 0 : Infinity,
          previousNode: null,
          visited: false,
        },
      ];
    })
  );

  return initialNodeStates;
}

function findLowestCostUnvisitedNode(nodeStates: NodeStates): NodeId | null {
  const lowestCostUnvisitedNode: {
    nodeId: NodeId | null;
    traversalCostFromOrigin: number;
  } = { nodeId: null, traversalCostFromOrigin: Infinity };

  nodeStates.forEach((node) => {
    if (
      node.visited === false &&
      node.traversalCostFromOrigin <
        lowestCostUnvisitedNode.traversalCostFromOrigin
    ) {
      lowestCostUnvisitedNode.nodeId = node.nodeId;
      lowestCostUnvisitedNode.traversalCostFromOrigin =
        node.traversalCostFromOrigin;
    }
  });

  return lowestCostUnvisitedNode.nodeId;
}

function getLeastCostlyPath(
  nodeState: NodeStates,
  origin: NodeId,
  destination: NodeId
) {
  const shortestPathFromDestinationToOrigin: NodeState[] = [];

  let currentNodeId: NodeId | null = destination;

  while (!!currentNodeId) {
    const currentNodeState = nodeState.get(currentNodeId);

    if (!currentNodeState) {
      throw new Error(
        `Could not find node state to trace shortest path for node ${currentNodeId}`
      );
    }

    shortestPathFromDestinationToOrigin.push(currentNodeState);

    // If the current node is the origin the trace is finished so set currentNodeId to null and break out of the loop, otherwise set next previous node in the path as the currentNodeId to be processed in the next iteration of the loop
    if (currentNodeId === origin) {
      currentNodeId = null;
      break;
    } else {
      currentNodeId = currentNodeState.previousNode;
    }
  }

  // The shortest path is built using the array.push() method for better performance but results in a destination-to-origin node ordering so it must be reversed to get the origin-to-destination node ordering before returning the value
  const shortestPathFromOriginToDestination =
    shortestPathFromDestinationToOrigin.reverse().map((nodeState) => {
      const { nodeId, traversalCostFromOrigin } = nodeState;
      return {
        nodeId,
        traversalCostFromOrigin,
      };
    });

  return shortestPathFromOriginToDestination;
}

function getCompleteTraversalCostTree(nodeStates: NodeStates) {
  const completeTraversalCostTree: {
    nodeId: NodeId;
    traversalCostFromOrigin: number;
    previousNode: NodeId;
  }[] = [];

  nodeStates.forEach((nodeState) => {
    const { nodeId, traversalCostFromOrigin, previousNode } = <
      Omit<NodeState, "previousNode"> & { previousNode: NodeId }
    >nodeState;

    completeTraversalCostTree.push({
      nodeId,
      traversalCostFromOrigin,
      previousNode,
    });
  });

  return completeTraversalCostTree;
}

export function findLeastCostlyPathDijkstra(
  graph: WeightedAdjacencyList,
  origin: NodeId,
  destination: NodeId
) {
  // Get all nodes that are reachable from the origin node and ignore non-reachable nodes to save time
  const reachableNodes = findAllReachableNodesFromOrigin(graph, origin);

  if (!reachableNodes.includes(destination)) {
    throw new Error(
      `Destination node ${destination} is not reachable from origin node ${origin}`
    );
  }

  const nodeStates = getInitialNodeStates(reachableNodes, origin);

  let currentNodeId = findLowestCostUnvisitedNode(nodeStates);

  while (!!currentNodeId) {
    const currentNodeState = nodeStates.get(currentNodeId);

    if (!currentNodeState) {
      throw new Error(
        `Cannot find node state for current node ${currentNodeId}`
      );
    }

    for (const neighbor of graph[currentNodeId]) {
      const currentNodeTraversalCostFromOrigin =
        currentNodeState.traversalCostFromOrigin;

      const traversalCostFromCurrentNodeToNeighbor = neighbor.edgeWeight;
      const neighborNodeId = neighbor.nodeId;

      const neighborNodeState = nodeStates.get(neighborNodeId);

      if (!neighborNodeState) {
        throw new Error(
          `Cannot find node state for neighbor node ${neighborNodeId}`
        );
      }

      const traversalCostToNeighborNodeViaCurrentNode =
        currentNodeTraversalCostFromOrigin +
        traversalCostFromCurrentNodeToNeighbor;

      // If cost to travel to the neighboring node via the current node is less than the currently known cost then  we have found a new shorter path to travel to the neighboring node so we'll update the neighbor node state to note that we should visit it via the current node
      if (
        traversalCostToNeighborNodeViaCurrentNode <
        neighborNodeState.traversalCostFromOrigin
      ) {
        nodeStates.set(neighborNodeId, {
          ...neighborNodeState,
          traversalCostFromOrigin: traversalCostToNeighborNodeViaCurrentNode,
          previousNode: currentNodeId,
        });
      }
    }

    // Mark the current node as visited by updating its state
    nodeStates.set(currentNodeId, {
      ...currentNodeState,
      visited: true,
    });

    // Update the currentNodeId to prepare it for the next iteration of the while loop. When there are no more nodes to visit, currentNodeId will be set to null and the while loop ends in the next cycle
    currentNodeId = findLowestCostUnvisitedNode(nodeStates);
  }

  const leastCostlyPathFromOriginToDestination = getLeastCostlyPath(
    nodeStates,
    origin,
    destination
  );

  const completeTraversalCostTree = getCompleteTraversalCostTree(nodeStates);

  return {
    leastCostlyPathFromOriginToDestination,
    completeTraversalCostTree,
  };
}
