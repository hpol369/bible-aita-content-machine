import React, { useState } from 'react';
import { X, Calendar, Clock, MessageCircle, Star, ThumbsUp, ThumbsDown, Lightbulb, AlertTriangle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: any;
}

const criteriaLabels: Record<string, string> = {
    hookStrength: 'Hook Strength',
    emotionalEngagement: 'Emotional Engagement',
    controversyLevel: 'Controversy Level',
    relatability: 'Relatability',
    pacing: 'Pacing',
    revealImpact: 'Reveal Impact',
    commentBait: 'Comment Bait'
};

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, content }) => {
    const [showReview, setShowReview] = useState(true);
    const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);

    if (!isOpen || !content) return null;

    const getScoreColor = (score: number) => {
        if (score >= 8) return '#22c55e';
        if (score >= 6) return '#eab308';
        return '#ef4444';
    };

    const getOverallScoreColor = (score: number) => {
        if (score >= 85) return '#22c55e';
        if (score >= 70) return '#eab308';
        return '#ef4444';
    };

    const review = content.review;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.85)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(5px)'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="glass-panel"
                style={{
                    width: '95%',
                    maxWidth: '1200px',
                    maxHeight: '95vh',
                    display: 'flex',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-secondary)',
                    position: 'relative'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <X size={20} />
                </button>

                {/* Left Panel - Script Content */}
                <div style={{ flex: '1', padding: '32px', overflowY: 'auto', borderRight: 'var(--border-subtle)' }}>
                    <h2 style={{ fontSize: '22px', marginBottom: '16px', lineHeight: '1.3' }}>
                        {content.aitaContent?.post_title || content.storyName}
                    </h2>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} />
                            {content.duration ? `${Math.round(content.duration)}s` : 'N/A'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MessageCircle size={14} />
                            {content.storyData?.primary_emotion}
                        </span>
                    </div>

                    {/* Script Body */}
                    <div style={{
                        background: 'var(--bg-tertiary)',
                        padding: '20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        lineHeight: '1.7',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '24px'
                    }}>
                        {content.aitaContent?.post_body}
                    </div>

                    {/* Fake Comments */}
                    {content.aitaContent?.fake_comments && (
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
                                Top Comments
                            </h3>
                            {content.aitaContent.fake_comments.map((comment: any, idx: number) => (
                                <div key={idx} style={{
                                    background: 'var(--bg-tertiary)',
                                    padding: '12px 16px',
                                    borderRadius: '6px',
                                    marginBottom: '8px',
                                    fontSize: '13px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>u/{comment.user}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>+{comment.upvotes.toLocaleString()}</span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pinned Comment & CTA */}
                    {content.aitaContent?.pinned_comment && (
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            marginBottom: '12px',
                            fontSize: '13px'
                        }}>
                            <strong style={{ color: '#3b82f6' }}>Pinned:</strong>{' '}
                            <span style={{ color: 'var(--text-secondary)' }}>{content.aitaContent.pinned_comment}</span>
                        </div>
                    )}

                    {content.aitaContent?.cta && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            fontSize: '13px'
                        }}>
                            <strong style={{ color: '#22c55e' }}>CTA:</strong>{' '}
                            <span style={{ color: 'var(--text-secondary)' }}>{content.aitaContent.cta}</span>
                        </div>
                    )}
                </div>

                {/* Right Panel - Review Scores */}
                <div style={{ flex: '0 0 400px', padding: '32px', overflowY: 'auto', background: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Star size={18} />
                            Quality Review
                        </h3>
                        <button
                            onClick={() => setShowReview(!showReview)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            {showReview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>

                    {review && showReview && (
                        <>
                            {/* Overall Score */}
                            <div style={{
                                background: 'var(--bg-secondary)',
                                padding: '20px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    fontSize: '48px',
                                    fontWeight: 700,
                                    color: getOverallScoreColor(review.overallScore),
                                    lineHeight: 1
                                }}>
                                    {review.overallScore}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>out of 100</div>

                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginTop: '12px',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    background: review.verdict === 'VIRAL_READY' ? 'rgba(34, 197, 94, 0.2)' :
                                               review.verdict === 'NEEDS_REVISION' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    color: review.verdict === 'VIRAL_READY' ? '#22c55e' :
                                           review.verdict === 'NEEDS_REVISION' ? '#eab308' : '#ef4444'
                                }}>
                                    <TrendingUp size={14} />
                                    {review.verdict.replace('_', ' ')}
                                </div>

                                <div style={{
                                    marginTop: '8px',
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                }}>
                                    Predicted: <span style={{
                                        fontWeight: 600,
                                        color: review.predictedEngagement === 'VIRAL' ? '#22c55e' :
                                               review.predictedEngagement === 'HIGH' ? '#3b82f6' :
                                               review.predictedEngagement === 'MEDIUM' ? '#eab308' : '#ef4444'
                                    }}>{review.predictedEngagement}</span>
                                </div>
                            </div>

                            {/* Criteria Breakdown */}
                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>
                                    Criteria Scores
                                </h4>
                                {Object.entries(criteriaLabels).map(([key, label]) => {
                                    const score = review.criteria[key as keyof typeof review.criteria] as number;
                                    const feedback = review.criteria[`${key}Feedback` as keyof typeof review.criteria] as string;
                                    const isExpanded = expandedCriteria === key;

                                    return (
                                        <div
                                            key={key}
                                            style={{ marginBottom: '8px', cursor: 'pointer' }}
                                            onClick={() => setExpandedCriteria(isExpanded ? null : key)}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '8px 12px',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: isExpanded ? '6px 6px 0 0' : '6px'
                                            }}>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{
                                                        width: '60px',
                                                        height: '4px',
                                                        background: 'var(--bg-tertiary)',
                                                        borderRadius: '2px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <div style={{
                                                            width: `${score * 10}%`,
                                                            height: '100%',
                                                            background: getScoreColor(score),
                                                            borderRadius: '2px'
                                                        }} />
                                                    </div>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        color: getScoreColor(score),
                                                        minWidth: '20px',
                                                        textAlign: 'right'
                                                    }}>
                                                        {score}
                                                    </span>
                                                </div>
                                            </div>
                                            {isExpanded && (
                                                <div style={{
                                                    padding: '10px 12px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: '0 0 6px 6px',
                                                    fontSize: '11px',
                                                    color: 'var(--text-muted)',
                                                    lineHeight: '1.5'
                                                }}>
                                                    {feedback}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Strengths */}
                            <div style={{ marginBottom: '16px' }}>
                                <h4 style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                    color: '#22c55e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <ThumbsUp size={14} />
                                    Strengths
                                </h4>
                                {review.strengths.map((s: string, i: number) => (
                                    <div key={i} style={{
                                        fontSize: '11px',
                                        color: 'var(--text-secondary)',
                                        padding: '6px 10px',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        borderRadius: '4px',
                                        marginBottom: '4px',
                                        lineHeight: '1.4'
                                    }}>
                                        {s}
                                    </div>
                                ))}
                            </div>

                            {/* Weaknesses */}
                            <div style={{ marginBottom: '16px' }}>
                                <h4 style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                    color: '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <ThumbsDown size={14} />
                                    Weaknesses
                                </h4>
                                {review.weaknesses.map((w: string, i: number) => (
                                    <div key={i} style={{
                                        fontSize: '11px',
                                        color: 'var(--text-secondary)',
                                        padding: '6px 10px',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        borderRadius: '4px',
                                        marginBottom: '4px',
                                        lineHeight: '1.4'
                                    }}>
                                        {w}
                                    </div>
                                ))}
                            </div>

                            {/* Revision Suggestions */}
                            <div style={{ marginBottom: '16px' }}>
                                <h4 style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    marginBottom: '8px',
                                    color: '#3b82f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <Lightbulb size={14} />
                                    Suggestions
                                </h4>
                                {review.revisionSuggestions.map((s: string, i: number) => (
                                    <div key={i} style={{
                                        fontSize: '11px',
                                        color: 'var(--text-secondary)',
                                        padding: '6px 10px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        borderRadius: '4px',
                                        marginBottom: '4px',
                                        lineHeight: '1.4'
                                    }}>
                                        {s}
                                    </div>
                                ))}
                            </div>

                            {/* Red Flags */}
                            {review.redFlags && review.redFlags.length > 0 && (
                                <div>
                                    <h4 style={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        marginBottom: '8px',
                                        color: '#f97316',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <AlertTriangle size={14} />
                                        Red Flags
                                    </h4>
                                    {review.redFlags.map((f: string, i: number) => (
                                        <div key={i} style={{
                                            fontSize: '11px',
                                            color: 'var(--text-secondary)',
                                            padding: '6px 10px',
                                            background: 'rgba(249, 115, 22, 0.1)',
                                            borderRadius: '4px',
                                            marginBottom: '4px',
                                            lineHeight: '1.4'
                                        }}>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {!review && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: 'var(--text-muted)',
                            fontSize: '14px'
                        }}>
                            No review data available for this content.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
