export type NodeId = string | number;

export type WeightedGraphNode = {
  nodeId: NodeId;
  edgeWeight: number;
};

export type WeightedAdjacencyList = {
  [key in NodeId]: WeightedGraphNode[];
};

//export type VisitedNodes = Map<NodeId, boolean>;

export type NodeState = {
  nodeId: NodeId;
  traversalCostFromOrigin: number;
  previousNode: NodeId | null;
  visited: boolean;
};

export type NodeStates = Map<NodeId, NodeState>;
