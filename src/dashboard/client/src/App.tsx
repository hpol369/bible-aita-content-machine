import React, { useEffect, useState } from 'react';
import { Activity, Video, FileText, CheckCircle, RefreshCw, Play, Search, Plus, Clock, Star, AlertTriangle, TrendingUp } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { VideoModal } from './components/VideoModal';

// Types
interface DashboardData {
    videosRendered: number;
    contentGenerated: number;
    pendingStories: number;
    completedStories: number;
}

interface ScriptReview {
    overallScore: number;
    passed: boolean;
    verdict: 'VIRAL_READY' | 'NEEDS_REVISION' | 'MAJOR_REWRITE';
    predictedEngagement: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIRAL';
    criteria: {
        hookStrength: number;
        hookFeedback: string;
        emotionalEngagement: number;
        emotionalFeedback: string;
        controversyLevel: number;
        controversyFeedback: string;
        relatability: number;
        relatabilityFeedback: string;
        pacing: number;
        pacingFeedback: string;
        revealImpact: number;
        revealFeedback: string;
        commentBait: number;
        commentBaitFeedback: string;
    };
    strengths: string[];
    weaknesses: string[];
    revisionSuggestions: string[];
    redFlags: string[];
}

interface ContentItem {
    id: string;
    storyName: string;
    createdAt: string;
    duration?: number;
    videoPath?: string;
    status?: string;
    storyData?: {
        primary_emotion: string;
    };
    aitaContent?: {
        post_title: string;
        post_body: string;
        fake_comments?: Array<{ user: string; text: string; upvotes: number }>;
        pinned_comment?: string;
        cta?: string;
    };
    review?: ScriptReview;
}

function App() {
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchData = async () => {
        try {
            const [statsRes, contentRes] = await Promise.all([
                fetch('/api/status'),
                fetch('/api/content')
            ]);
            const statsData = await statsRes.json();
            const contentData = await contentRes.json();

            setStats(statsData);
            setContent(contentData);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleGenerate = async () => {
        if (isGenerating) return;

        const storyName = prompt("Enter story name (or leave empty for next in queue):");
        if (storyName === null) return;

        setIsGenerating(true);
        try {
            await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storyName, skipPosting: true })
            });
            alert('Generation started! Check the logs/console.');
        } catch (error) {
            alert('Failed to start generation');
        } finally {
            setIsGenerating(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return '#22c55e';
        if (score >= 70) return '#eab308';
        return '#ef4444';
    };

    const getVerdictBadge = (verdict: string) => {
        switch (verdict) {
            case 'VIRAL_READY':
                return { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', icon: TrendingUp };
            case 'NEEDS_REVISION':
                return { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308', icon: AlertTriangle };
            default:
                return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', icon: AlertTriangle };
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                    }}>
                        📖
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Bible AITA</h1>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Content Machine Dashboard</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={fetchData}
                        title="Refresh Data"
                        className="glass-panel"
                        style={{
                            width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'var(--border-subtle)', color: 'var(--text-secondary)'
                        }}
                    >
                        <RefreshCw size={20} />
                    </button>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0 24px',
                            height: '44px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 600,
                            fontSize: '14px',
                            opacity: isGenerating ? 0.7 : 1
                        }}
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                        {isGenerating ? 'Generating...' : 'New Content'}
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '40px'
            }}>
                <StatsCard
                    label="Videos Rendered"
                    value={stats?.videosRendered || 0}
                    icon={Video}
                    color="accent"
                />
                <StatsCard
                    label="Content Created"
                    value={stats?.contentGenerated || 0}
                    icon={FileText}
                />
                <StatsCard
                    label="Stories Pending"
                    value={stats?.pendingStories || 0}
                    icon={Activity}
                    color="warning"
                />
                <StatsCard
                    label="Stories Completed"
                    value={stats?.completedStories || 0}
                    icon={CheckCircle}
                    color="success"
                />
            </div>

            {/* Content Gallery */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Recent Content</h2>
                    <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={16} color="var(--text-secondary)" />
                        <input
                            type="text"
                            placeholder="Search content..."
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                outline: 'none',
                                width: '200px'
                            }}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px'
                    }}>
                        {content.map(item => {
                            const verdictStyle = item.review ? getVerdictBadge(item.review.verdict) : null;
                            const VerdictIcon = verdictStyle?.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="glass-panel"
                                    style={{
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onClick={() => setSelectedContent(item)}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{
                                        aspectRatio: '9/16',
                                        background: 'var(--bg-tertiary)',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {item.videoPath ? (
                                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                <video src={`/output/videos/${item.id}.mp4`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                                                <div style={{
                                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Play size={24} fill="white" stroke="none" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <FileText size={48} color="var(--text-muted)" />
                                        )}

                                        {/* Score Badge */}
                                        {item.review && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: 'rgba(0,0,0,0.8)',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <Star size={14} fill={getScoreColor(item.review.overallScore)} color={getScoreColor(item.review.overallScore)} />
                                                <span style={{
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: getScoreColor(item.review.overallScore)
                                                }}>
                                                    {item.review.overallScore}
                                                </span>
                                            </div>
                                        )}

                                        {/* Duration Badge */}
                                        <div style={{
                                            position: 'absolute', bottom: '12px', left: '12px',
                                            background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px',
                                            fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'
                                        }}>
                                            <Clock size={12} />
                                            {item.duration ? `${Math.round(item.duration)}s` : 'N/A'}
                                        </div>

                                        {/* Verdict Badge */}
                                        {item.review && verdictStyle && VerdictIcon && (
                                            <div style={{
                                                position: 'absolute', bottom: '12px', right: '12px',
                                                background: verdictStyle.bg,
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                color: verdictStyle.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                textTransform: 'uppercase'
                                            }}>
                                                <VerdictIcon size={10} />
                                                {item.review.verdict.replace('_', ' ')}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ padding: '16px' }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                            {item.aitaContent?.post_title || item.storyName}
                                        </h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            <span>{item.storyName}</span>
                                            <span style={{ color: 'var(--accent-primary)' }}>{item.storyData?.primary_emotion}</span>
                                        </div>

                                        {/* Quick Engagement Prediction */}
                                        {item.review && (
                                            <div style={{
                                                marginTop: '12px',
                                                padding: '8px 12px',
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>Predicted:</span>
                                                <span style={{
                                                    fontWeight: 600,
                                                    color: item.review.predictedEngagement === 'VIRAL' ? '#22c55e' :
                                                           item.review.predictedEngagement === 'HIGH' ? '#3b82f6' :
                                                           item.review.predictedEngagement === 'MEDIUM' ? '#eab308' : '#ef4444'
                                                }}>
                                                    {item.review.predictedEngagement}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <VideoModal
                isOpen={!!selectedContent}
                onClose={() => setSelectedContent(null)}
                content={selectedContent}
            />
        </div>
    );
}

export default App;
