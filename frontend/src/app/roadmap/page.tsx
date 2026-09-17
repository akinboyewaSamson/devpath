'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
  type NodeProps,
  type Edge,
  type Node,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import dagre from 'dagre';
import {
  CheckCircle2,
  Lock,
  Flame,
  Clock,
  BookOpen,
  ExternalLink,
  X,
  Play,
  ChevronRight,
  GitFork,
  Layers,
  Zap,
  Server,
  Code2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { TopicDAGNode, RoadmapDAG, ProgressStatus, TopicLevel, Track } from '@/types';
import { Navbar } from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ─── DAG layout with dagre ─────────────────────────────────────────────────────
const NODE_WIDTH = 240;
const NODE_HEIGHT = 88;

function layoutGraph(
  nodes: Node[],
  edges: Edge[],
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 90, nodesep: 50 });

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return {
    nodes: nodes.map((n) => {
      const pos = g.node(n.id);
      return { ...n, position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 } };
    }),
    edges,
  };
}

// ─── Custom Topic Node (GetOrbit Light Aesthetic) ─────────────────────────────
function TopicNode({ data }: NodeProps) {
  const topic = data.topic as TopicDAGNode;
  const isLocked = data.locked as boolean;
  const status = topic.userProgress.status;

  const isCompleted = status === 'COMPLETED';
  const isInProgress = status === 'IN_PROGRESS';

  return (
    <div
      className={`relative cursor-pointer select-none rounded-2xl p-3.5 transition-all shadow-sm ${
        isLocked
          ? 'bg-gray-50 border border-gray-200 opacity-60'
          : isCompleted
          ? 'bg-[#F0FDF4] border-2 border-emerald-500 shadow-emerald-500/10'
          : isInProgress
          ? 'bg-[#FFEFE6] border-2 border-[#EE5902] shadow-[0_4px_16px_rgba(238,89,2,0.15)] ring-2 ring-[#EE5902]/20'
          : 'bg-white border-2 border-gray-200 hover:border-[#EE5902] hover:shadow-md'
      }`}
      style={{ width: NODE_WIDTH }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />

      <div className="flex items-start gap-2.5">
        {/* Status icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isLocked ? (
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <Lock className="w-3 h-3" />
            </div>
          ) : isCompleted ? (
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          ) : isInProgress ? (
            <div className="w-5 h-5 rounded-full bg-[#EE5902] text-white flex items-center justify-center shadow-xs animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-white" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#0D0D54] leading-tight truncate">
            {topic.title}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-gray-400" />
              {topic.estimatedHours}h
            </span>
            <Badge level={topic.level} className="text-[9px] py-0 px-1.5 font-bold">
              {topic.level}
            </Badge>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

const nodeTypes = { topic: TopicNode };

// ─── Topic Detail Drawer ────────────────────────────────────────────────────────
function TopicDrawer({
  topic,
  locked,
  onClose,
  onMarkProgress,
  isUpdating,
}: {
  topic: TopicDAGNode;
  locked: boolean;
  onClose: () => void;
  onMarkProgress: (id: string, status: ProgressStatus) => Promise<void>;
  isUpdating: boolean;
}) {
  const status = topic.userProgress.status;
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async (newStatus: ProgressStatus) => {
    setErrorMessage('');
    try {
      await onMarkProgress(topic.id, newStatus);
    } catch (err: any) {
      setErrorMessage(err.message || 'Prerequisites required to complete this topic.');
    }
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      {/* Drawer Header */}
      <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-[#FDFBFA]">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge level={topic.level}>{topic.level}</Badge>
            {topic.milestoneTitle && (
              <span className="text-xs text-gray-500 font-medium truncate">
                {topic.milestoneTitle}
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-xl text-[#0D0D54] font-heading leading-tight">
            {topic.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#EE5902]" />
              {topic.estimatedHours} hours estimated study time
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Error notice if prerequisite blocked */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Topic Overview
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {topic.description}
          </p>
        </div>

        {/* Current status chip */}
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-sm font-medium ${
            locked
              ? 'border-gray-200 bg-gray-50 text-gray-500'
              : status === 'COMPLETED'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : status === 'IN_PROGRESS'
              ? 'border-orange-200 bg-[#FFEFE6] text-[#EE5902]'
              : 'border-gray-200 bg-gray-50 text-gray-600'
          }`}
        >
          {locked ? (
            <Lock className="w-4 h-4 text-gray-400" />
          ) : status === 'COMPLETED' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : status === 'IN_PROGRESS' ? (
            <Flame className="w-4 h-4 text-[#EE5902]" />
          ) : (
            <div className="w-4 h-4 rounded-full border border-gray-400" />
          )}
          <span>
            {locked
              ? 'Locked — complete preceding prerequisites first'
              : status === 'COMPLETED'
              ? 'Topic Completed!'
              : status === 'IN_PROGRESS'
              ? 'Currently In Progress'
              : 'Not Started'}
          </span>
        </div>

        {/* Verified Learning Resources */}
        {topic.resources && topic.resources.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Curated Learning Resources ({topic.resources.length})
            </h4>
            <div className="space-y-2.5">
              {topic.resources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl border border-gray-200 hover:border-[#FEBF9A] hover:bg-[#FFF7F2] transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#EE5902] uppercase tracking-wider">
                      {res.type}
                    </span>
                    <div className="text-sm font-semibold text-[#0D0D54] group-hover:text-[#EE5902] transition-colors line-clamp-1">
                      {res.title}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#EE5902] transition-colors shrink-0 mt-1" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Action Footer */}
      <div className="p-5 border-t border-gray-100 bg-[#FDFBFA] space-y-2">
        {status !== 'COMPLETED' && (
          <Button
            variant="primary"
            className="w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
            disabled={isUpdating || locked}
            onClick={() => handleUpdate(status === 'NOT_STARTED' ? 'IN_PROGRESS' : 'COMPLETED')}
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : status === 'NOT_STARTED' ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                Start Studying Topic
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Mark Topic as Completed
              </>
            )}
          </Button>
        )}

        {status === 'COMPLETED' && (
          <Button
            variant="outline"
            className="w-full rounded-xl py-2.5 text-xs text-gray-600 border-gray-200"
            disabled={isUpdating}
            onClick={() => handleUpdate('IN_PROGRESS')}
          >
            Reopen Topic (Review)
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function RoadmapContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapDAG | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicDAGNode | null>(null);
  const [selectedLocked, setSelectedLocked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [levelFilter, setLevelFilter] = useState<TopicLevel | 'ALL'>('ALL');
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // Load all tracks
  useEffect(() => {
    if (!user) return;
    api.getTracks().then((data) => {
      setTracks(data);
      const requestedTrackName = searchParams.get('track');
      const found = requestedTrackName
        ? data.find((t) => t.name === requestedTrackName)
        : data.find((t) => t.id === user.currentTrackId) || data[0];

      if (found) setSelectedTrack(found);
    });
  }, [user, searchParams]);

  // Load roadmap for the selected track
  useEffect(() => {
    if (!selectedTrack) return;
    setIsLoadingRoadmap(true);
    api.getTrackRoadmap(selectedTrack.id)
      .then((rm) => {
        setRoadmap(rm);
      })
      .catch((err) => console.error('Failed to load roadmap:', err))
      .finally(() => setIsLoadingRoadmap(false));
  }, [selectedTrack]);

  // Compute locked nodes
  const lockedSet = useMemo(() => {
    if (!roadmap) return new Set<string>();
    const topicMap = new Map(roadmap.graph.nodes.map((n) => [n.id, n]));
    const locked = new Set<string>();
    for (const node of roadmap.graph.nodes) {
      const prereqsMet = node.prerequisiteTopicIds.every(
        (pid) => topicMap.get(pid)?.userProgress.status === 'COMPLETED',
      );
      if (!prereqsMet && node.prerequisiteTopicIds.length > 0) {
        locked.add(node.id);
      }
    }
    return locked;
  }, [roadmap]);

  // Build React Flow graph
  const buildGraph = useCallback(
    (rm: RoadmapDAG, locked: Set<string>) => {
      const filtered =
        levelFilter === 'ALL'
          ? rm.graph.nodes
          : rm.graph.nodes.filter((n) => n.level === levelFilter);

      const filteredIds = new Set(filtered.map((n) => n.id));

      const rawNodes: Node[] = filtered.map((topic) => ({
        id: topic.id,
        type: 'topic',
        position: { x: 0, y: 0 },
        data: { topic, locked: locked.has(topic.id) },
      }));

      const rawEdges: Edge[] = rm.graph.edges
        .filter((e) => filteredIds.has(e.from) && filteredIds.has(e.to))
        .map((e) => {
          const sourceStatus = rm.graph.nodes.find((n) => n.id === e.from)?.userProgress.status;
          return {
            id: `${e.from}--${e.to}`,
            source: e.from,
            target: e.to,
            animated: sourceStatus === 'IN_PROGRESS',
            className:
              sourceStatus === 'COMPLETED'
                ? 'completed'
                : sourceStatus === 'IN_PROGRESS'
                ? 'in-progress'
                : '',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: sourceStatus === 'COMPLETED' ? '#10B981' : '#CBD5E1',
            },
          };
        });

      const { nodes: layoutedNodes, edges: layoutedEdges } = layoutGraph(rawNodes, rawEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    },
    [levelFilter, setNodes, setEdges],
  );

  useEffect(() => {
    if (roadmap) buildGraph(roadmap, lockedSet);
  }, [roadmap, lockedSet, buildGraph]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const topic = (node.data as any).topic as TopicDAGNode;
    const locked = (node.data as any).locked as boolean;
    setSelectedTopic(topic);
    setSelectedLocked(locked);
  }, []);

  const handleMarkProgress = async (topicId: string, status: ProgressStatus) => {
    setIsUpdating(true);
    try {
      await api.updateTopicProgress(topicId, status);
      if (selectedTrack) {
        const rm = await api.getTrackRoadmap(selectedTrack.id);
        setRoadmap(rm);
        const updated = rm.graph.nodes.find((n) => n.id === topicId);
        if (updated) setSelectedTopic(updated);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const completedCount =
    roadmap?.graph.nodes.filter((n) => n.userProgress.status === 'COMPLETED').length ?? 0;
  const totalCount = roadmap?.totalTopics ?? 0;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const LEVELS: Array<TopicLevel | 'ALL'> = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  return (
    <div className="h-screen flex flex-col bg-[#FDFBFA] overflow-hidden">
      <Navbar />

      {/* Track Switcher & Level Filter Bar */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-4 z-10 shadow-xs">
        {/* Track Pills: Java Backend <-> Modern Frontend */}
        <div className="flex items-center gap-2 bg-[#FDFBFA] p-1.5 rounded-2xl border border-gray-200">
          {tracks.map((t) => {
            const isSelected = selectedTrack?.id === t.id;
            const isBackend = t.name === 'backend';
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? isBackend
                      ? 'bg-[#EE5902] text-white shadow-sm'
                      : 'bg-[#376262] text-white shadow-sm'
                    : 'text-gray-600 hover:text-[#0D0D54] hover:bg-white'
                }`}
              >
                {isBackend ? <Server className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* Level Filters & Stats */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  levelFilter === lvl
                    ? 'bg-white text-[#0D0D54] shadow-xs'
                    : 'text-gray-500 hover:text-[#0D0D54]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFEFE6] border border-[#FEBF9A] rounded-xl text-xs font-bold text-[#EE5902]">
            <span>{percentage}% Completed</span>
          </div>
        </div>
      </div>

      {/* Main Canvas with React Flow */}
      <div className="flex-1 relative">
        {isLoadingRoadmap ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#EE5902] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500 font-medium">Generating roadmap DAG...</p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.3}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
          >
            <Background color="#E2E8F0" gap={24} size={1.5} variant={BackgroundVariant.Dots} />
            <Controls position="bottom-right" className="bg-white border border-gray-200" />
          </ReactFlow>
        )}

        {/* Slide-over Topic Detail Drawer */}
        <AnimatePresence>
          {selectedTopic && (
            <TopicDrawer
              topic={selectedTopic}
              locked={selectedLocked}
              onClose={() => setSelectedTopic(null)}
              onMarkProgress={handleMarkProgress}
              isUpdating={isUpdating}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBFA] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#EE5902] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-500">Loading DevPath Roadmap...</p>
          </div>
        </div>
      }
    >
      <RoadmapContent />
    </React.Suspense>
  );
}
