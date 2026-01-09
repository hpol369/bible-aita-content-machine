import React from 'react';
import { X, Calendar, Clock, MessageCircle } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: any; // Using any for now, will refine with proper types
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, content }) => {
    if (!isOpen || !content) return null;

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
                    width: '90%',
                    maxWidth: '1000px',
                    maxHeight: '90vh',
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

                <div style={{ flex: '1.5', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {content.videoPath ? (
                        <video
                            src={`/output/videos/${content.id}.mp4`}
                            controls
                            style={{ width: '100%', maxHeight: '90vh' }}
                            autoPlay
                        />
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No Video Available
                        </div>
                    )}
                </div>

                <div style={{ flex: '1', padding: '32px', overflowY: 'auto', borderLeft: 'var(--border-subtle)' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px', lineHeight: '1.3' }}>
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

                    <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        {content.aitaContent?.post_body}
                    </div>
                </div>
            </div>
        </div>
    );
};
