import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations } from '../context/LanguageContext';
import { CommunityUserRole, Post, Story, User, Comment, PollOption } from '../types';
import { HeartIcon, CommentIcon, PlusCircleIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, SwitchUserIcon, TrashIcon, UserIcon, PollIcon, TextIcon } from './icons/Icons';
// Los campamentos se cargarán desde Supabase cuando estén contratados
import { supabase } from '../supabaseClient';


// --- SUB-COMPONENTS ---

const StoryBubbles: React.FC<{
    stories: Story[],
    role: CommunityUserRole,
    currentUser: User,
    onViewStory: (storyId: number) => void,
    onAddStoryClick: () => void
}> = ({ stories, role, currentUser, onViewStory, onAddStoryClick }) => {
    const { t } = useTranslations();
    return (
        <div className="mb-8 mt-2">
            <div className="flex items-center justify-between mb-4 px-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('community.stories')}</h2>
            </div>
            <div className="flex space-x-5 overflow-x-auto pb-4 px-4 no-scrollbar">
                {role === 'monitor' && (
                    <div onClick={onAddStoryClick} className="flex-shrink-0 text-center w-20 cursor-pointer group">
                        <div className="relative">
                            <div className="w-[72px] h-[72px] rounded-full p-[3px] bg-slate-100 mx-auto flex items-center justify-center group-hover:bg-slate-200 transition-all border-2 border-dashed border-slate-300">
                                <PlusCircleIcon className="h-8 w-8 text-slate-400 group-hover:text-[#8EB8BA] transition-colors" />
                            </div>
                        </div>
                        <p className="text-[11px] mt-2 truncate text-slate-500 font-bold">{t('community.addStory')}</p>
                    </div>
                )}
                {stories.map(story => (
                    <div key={story.id} onClick={() => onViewStory(story.id)} className="flex-shrink-0 text-center w-20 cursor-pointer group">
                        <div className="relative">
                            <div className={`w-[72px] h-[72px] rounded-full p-[3px] mx-auto transition-all transform group-hover:scale-105 ${story.viewed ? 'bg-slate-200' : 'bg-gradient-to-tr from-[#8EB8BA] via-[#2E4053] to-[#8EB8BA]'}`}>
                                <div className="bg-white p-[2px] rounded-full h-full w-full">
                                    <img src={story.monitorAvatar} alt={story.monitorName} className={`w-full h-full object-cover rounded-full transition-opacity ${story.viewed ? 'opacity-60' : ''}`} />
                                </div>
                            </div>
                        </div>
                        <p className={`text-[11px] mt-2 truncate font-semibold transition-colors ${story.viewed ? 'text-slate-400' : 'text-slate-700'}`}>{story.monitorName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StoryViewer: React.FC<{
    stories: Story[];
    startIndex: number;
    onClose: () => void;
    onViewed: (storyId: number) => void;
    onReact: (storyId: number, emoji: string) => void;
}> = ({ stories, startIndex, onClose, onViewed, onReact }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [progress, setProgress] = useState(0);
    const story = stories[currentIndex];

    useEffect(() => {
        onViewed(story.id);
        setProgress(0);
        const timer = setTimeout(() => {
            handleNext();
        }, 5000);

        const interval = setInterval(() => {
            setProgress(p => p + (100 / (5000 / 50)));
        }, 50);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [currentIndex, stories, onClose, onViewed]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1);
        }
    };

    if (!story) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-sm h-[90vh] bg-slate-900 rounded-lg overflow-hidden flex flex-col justify-center" onClick={e => e.stopPropagation()}>
                <div className="absolute top-2 left-2 right-2 h-1 flex gap-1">
                    {stories.map((s, index) => (
                        <div key={s.id} className="flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all"
                                style={{ transitionDuration: '50ms', width: `${index < currentIndex ? 100 : (index === currentIndex ? progress : 0)}%` }}
                            />
                        </div>
                    ))}
                </div>

                <img src={story.imageUrl} className="w-full h-auto object-contain" />

                <div className="absolute top-5 left-4 flex items-center gap-3">
                    <img src={story.monitorAvatar} alt={story.monitorName} className="w-10 h-10 rounded-full border-2 border-white" />
                    <p className="text-white font-bold text-sm shadow-text">{story.monitorName}</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    {story.caption && <p className="text-white text-center mb-4 shadow-text">{story.caption}</p>}
                    <div className="flex justify-center items-center gap-4">
                        {['❤️', '😂', '👍', '🥰'].map(emoji => (
                            <button key={emoji} onClick={() => onReact(story.id, emoji)} className="text-3xl transform hover:scale-125 transition-transform">
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:opacity-70 transition"><CloseIcon /></button>
                <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/20 rounded-full p-1 hover:bg-black/40 transition disabled:opacity-0"><ChevronLeftIcon /></button>
                <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/20 rounded-full p-1 hover:bg-black/40 transition disabled:opacity-0"><ChevronRightIcon /></button>
            </div>
            <style>{`.shadow-text { text-shadow: 0 1px 3px rgba(0,0,0,0.5); }`}</style>
        </div>
    );
};

const PostCard: React.FC<{
    post: Post;
    role: CommunityUserRole;
    currentUser: User;
    onLike: (postId: number) => void;
    onAddComment: (postId: number, commentText: string) => void;
    onDeletePost: (postId: number) => void;
    onVote: (postId: number, optionId: number) => void;
}> = ({ post, role, currentUser, onLike, onAddComment, onDeletePost, onVote }) => {
    const { t } = useTranslations();
    const [comment, setComment] = useState('');
    const hasLiked = useMemo(() => post.likedBy.includes(currentUser.email), [post.likedBy, currentUser.email]);
    const userVote = post.type === 'poll' ? post.poll?.votedBy[currentUser.email] : undefined;
    const totalVotes = post.type === 'poll' ? post.poll?.options?.reduce((sum, opt) => sum + opt.votes, 0) : 0;

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onAddComment(post.id, comment);
            setComment('');
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden mb-8 transition-transform hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={post.monitorAvatar} alt={post.monitorName} className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{post.monitorName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Monitor Verificado</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {role === 'monitor' && post.monitorName === currentUser.name && (
                        <button onClick={() => onDeletePost(post.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title={t('community.deletePost')}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Body */}
            {post.type === 'photo' && post.imageUrl && (
                <div className="relative group overflow-hidden">
                    <img src={post.imageUrl} alt={post.caption} className="w-full h-auto object-cover max-h-[600px] transition-transform duration-700 group-hover:scale-105" />
                </div>
            )}

            <div className="p-5 pt-4">
                {/* Actions */}
                <div className="flex items-center gap-5 mb-4">
                    <button
                        onClick={() => onLike(post.id)}
                        className={`group flex items-center gap-2 transition-all ${hasLiked ? 'text-red-500' : 'text-slate-600 hover:text-red-500'}`}
                    >
                        <HeartIcon filled={hasLiked} className={`h-7 w-7 transition-transform group-active:scale-125 ${hasLiked ? 'animate-heart-pop' : ''}`} />
                        {post.likes > 0 && <span className="font-bold text-sm">{post.likes}</span>}
                    </button>
                    <button className="group flex items-center gap-2 text-slate-600 hover:text-[#8EB8BA] transition-all">
                        <CommentIcon className="h-7 w-7 group-hover:-rotate-6 transition-transform" />
                        {post.comments.length > 0 && <span className="font-bold text-sm">{post.comments.length}</span>}
                    </button>
                </div>

                {/* Caption / Text */}
                <div className={`text-slate-700 mb-5 leading-relaxed ${post.type === 'text' ? 'text-lg font-medium p-4 bg-slate-50 rounded-2xl border-l-4 border-[#8EB8BA]' : 'text-sm'}`}>
                    {post.type !== 'text' && <span className="font-bold text-slate-900 mr-2">{post.monitorName}</span>}
                    {post.caption}
                </div>

                {/* Poll Section */}
                {post.type === 'poll' && post.poll && (
                    <div className="bg-slate-50 p-5 rounded-2xl mb-5 border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <PollIcon className="w-5 h-5 text-[#8EB8BA]" /> {post.poll.question}
                        </h3>
                        <div className="space-y-3">
                            {post.poll.options?.map(option => {
                                const percentage = totalVotes && totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                const hasVotedThis = userVote === option.id;

                                return (
                                    <div key={option.id} className="relative">
                                        {userVote !== undefined ? (
                                            <div className="overflow-hidden relative w-full h-11 bg-white border border-slate-200 rounded-xl">
                                                <div
                                                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${hasVotedThis ? 'bg-[#8EB8BA]/20' : 'bg-slate-100'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                                <div className="relative h-full flex justify-between items-center px-4">
                                                    <span className={`text-sm font-bold ${hasVotedThis ? 'text-teal-800' : 'text-slate-600'}`}>
                                                        {option.text} {hasVotedThis && <span className="ml-1 text-teal-600 text-xs">✓</span>}
                                                    </span>
                                                    <span className="text-xs font-black text-slate-500">{percentage.toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onVote(post.id, option.id)}
                                                className="w-full h-11 text-left px-4 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:border-[#8EB8BA] hover:text-[#8EB8BA] hover:shadow-sm transition-all active:scale-[0.98]"
                                            >
                                                {option.text}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {totalVotes > 0 && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-right">{totalVotes} VOTOS TOTALES</p>}
                    </div>
                )}

                {/* Comments List */}
                <div className="space-y-3 mt-4">
                    {Array.isArray(post.comments) && post.comments.length > 2 && (
                        <button className="text-xs font-bold text-[#8EB8BA] hover:underline mb-2 px-1">
                            Ver los {post.comments.length} comentarios
                        </button>
                    )}
                    <div className="space-y-3">
                        {Array.isArray(post.comments) && post.comments.slice(-2).map((comment) => (
                            <div key={comment.id} className="flex items-start gap-3 px-1 animate-fade-in">
                                <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full object-cover border border-slate-100 shadow-sm" />
                                <div className="flex-1 bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100/50">
                                    <h5 className="font-bold text-slate-800 text-[11px] mb-1">{comment.authorName}</h5>
                                    <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
                    <img src={currentUser.avatar} alt="You" className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t('community.addComment')}
                            className="w-full bg-slate-50 text-sm py-2.5 px-4 rounded-full border border-transparent focus:border-[#8EB8BA]/30 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!comment.trim()}
                        className="text-[#8EB8BA] font-bold text-sm px-4 py-2 hover:bg-teal-50 rounded-full transition-colors disabled:opacity-0 disabled:scale-90"
                    >
                        {t('community.post')}
                    </button>
                </form>
            </div>
        </div>
    );
};

const CreatePostModal: React.FC<{ onClose: () => void; onAddPost: (postData: { type: 'photo' | 'poll' | 'text', caption: string, imageBase64?: string | null, poll?: { question: string, options: string[] } }) => void }> = ({ onClose, onAddPost }) => {
    const { t } = useTranslations();
    const [postType, setPostType] = useState<'photo' | 'poll' | 'text'>('photo');
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addPollOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions([...pollOptions, '']);
        }
    };

    const handleSubmit = () => {
        if (postType === 'photo' && caption.trim() && image) {
            onAddPost({ type: 'photo', caption, imageBase64: image });
        } else if (postType === 'poll' && caption.trim() && pollQuestion.trim() && pollOptions.every(opt => opt.trim())) {
            onAddPost({ type: 'poll', caption, poll: { question: pollQuestion, options: pollOptions.filter(opt => opt.trim()) } });
        } else if (postType === 'text' && caption.trim()) {
            onAddPost({ type: 'text', caption });
        }
    };

    const canSubmit =
        (postType === 'photo' && !!caption.trim() && !!image) ||
        (postType === 'poll' && !!caption.trim() && !!pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2) ||
        (postType === 'text' && !!caption.trim());

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">{t('community.createPostTitle')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><CloseIcon /></button>
                </div>
                <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                    {/* Switcher */}
                    <div className="flex bg-slate-50 rounded-2xl p-1 gap-1">
                        {[
                            { id: 'photo', label: 'Foto', icon: null },
                            { id: 'poll', label: 'Encuesta', icon: <PollIcon className="w-4 h-4" /> },
                            { id: 'text', label: 'Texto', icon: <TextIcon className="w-4 h-4" /> }
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setPostType(type.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${postType === type.id ? 'bg-white text-[#2E4053] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {type.icon} {type.label}
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder={postType === 'text' ? '¿Qué quieres contar hoy?' : 'Escribe algo sobre esto...'}
                        className="w-full min-h-[120px] p-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8EB8BA]/10 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all resize-none shadow-inner"
                    />

                    {postType === 'photo' ? (
                        <div className="space-y-4">
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                            {image ? (
                                <div className="relative group">
                                    <img src={image} alt="Preview" className="w-full h-auto max-h-64 object-cover rounded-2xl shadow-md border border-slate-100" />
                                    <button onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"><CloseIcon /></button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full p-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-[#8EB8BA] hover:text-[#8EB8BA] hover:bg-teal-50/30 transition-all flex flex-col items-center gap-3"
                                >
                                    <span className="text-3xl opacity-50">📸</span>
                                    <span className="font-bold text-sm tracking-wide">{t('community.uploadImage')}</span>
                                </button>
                            )}
                        </div>
                    ) : postType === 'poll' ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={pollQuestion}
                                    onChange={e => setPollQuestion(e.target.value)}
                                    placeholder="Escribe tu pregunta..."
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#8EB8BA]/10 focus:bg-white transition-all shadow-inner"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {pollOptions.map((opt, i) => (
                                    <div key={i} className="relative group">
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={e => handlePollOptionChange(i, e.target.value)}
                                            placeholder={`Opción ${i + 1}`}
                                            className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#8EB8BA]/5 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                            {pollOptions.length < 4 && (
                                <button onClick={addPollOption} className="text-sm font-black text-[#8EB8BA] hover:text-teal-600 transition-colors flex items-center gap-1 mt-2">
                                    <PlusCircleIcon className="w-4 h-4" /> Añadir opción
                                </button>
                            )}
                        </div>
                    ) : null}
                </div>
                <div className="p-6 border-t border-slate-50 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="flex-[2] bg-[#2E4053] text-white font-bold py-3.5 px-8 rounded-2xl hover:bg-[#3d5a6e] hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all"
                    >
                        {t('community.publish')}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CreateStoryModal: React.FC<{ onClose: () => void; onAddStory: (data: { imageBase64: string, caption: string }) => void }> = ({ onClose, onAddStory }) => {
    const { t } = useTranslations();
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = () => { if (image) { onAddStory({ imageBase64: image, caption }); } };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">{t('community.createStoryTitle')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><CloseIcon /></button>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    {image ? (
                        <div className="relative group">
                            <img src={image} alt="Preview" className="w-full h-auto max-h-80 object-cover rounded-2xl shadow-md border border-slate-100" />
                            <button onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"><CloseIcon /></button>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full p-14 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-[#8EB8BA] hover:text-[#8EB8BA] hover:bg-teal-50/30 transition-all flex flex-col items-center gap-3"
                        >
                            <span className="text-4xl opacity-50">🌆</span>
                            <span className="font-bold text-sm tracking-wide">{t('community.uploadImage')}</span>
                        </button>
                    )}
                    <textarea
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder="Añade un texto a tu Story..."
                        className="w-full h-20 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8EB8BA]/10 focus:bg-white text-slate-800 transition-all resize-none shadow-inner"
                    />
                </div>
                <div className="p-6 border-t border-slate-50 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!image}
                        className="flex-[2] bg-[#2E4053] text-white font-bold py-3.5 px-8 rounded-2xl hover:bg-[#3d5a6e] hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                    >
                        {t('community.publishStory')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

interface CommunityPageProps {
    currentUser: User;
    role: CommunityUserRole;
    onSwitchAccount: () => void;
    onAccountClick: () => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ currentUser, role, onSwitchAccount, onAccountClick }) => {
    const { t } = useTranslations();
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<Story[]>([]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
    const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

    useEffect(() => {
        const loadCommunityData = async () => {
            try {
                const { data: postsData, error: postsError } = await supabase
                    .from('community_posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!postsError && postsData) {
                    const mappedPosts: Post[] = (postsData as any[]).map((p) => ({
                        id: p.id,
                        campId: p.camp_id,
                        type: p.type,
                        monitorId: p.monitor_id ?? 0,
                        monitorName: p.monitor_name,
                        monitorAvatar: p.monitor_avatar,
                        caption: p.caption,
                        imageUrl: p.image_url || undefined,
                        poll: p.poll as any,
                        likes: p.likes ?? 0,
                        likedBy: p.liked_by ?? [],
                        comments: p.comments ?? [],
                        timestamp: p.created_at,
                    }));
                    setPosts(mappedPosts);
                }

                const { data: storiesData, error: storiesError } = await supabase
                    .from('community_stories')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!storiesError && storiesData) {
                    const mappedStories: Story[] = (storiesData as any[]).map((s) => ({
                        id: s.id,
                        monitorName: s.monitor_name,
                        monitorAvatar: s.monitor_avatar,
                        imageUrl: s.image_url,
                        caption: s.caption ?? undefined,
                        reactions: s.reactions ?? [],
                        viewed: false,
                    }));
                    setStories(mappedStories);
                }
            } catch (error) {
                console.error('Error al cargar datos de comunidad desde Supabase', error);
            }
        };

        loadCommunityData();

        // Configurar Realtime para posts
        const postsSubscription = supabase
            .channel('community_posts_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, (payload) => {
                console.log('Realtime update for posts:', payload);
                if (payload.eventType === 'INSERT') {
                    const p = payload.new;
                    const newPost: Post = {
                        id: p.id,
                        campId: p.camp_id,
                        type: p.type,
                        monitorId: p.monitor_id ?? 0,
                        monitorName: p.monitor_name,
                        monitorAvatar: p.monitor_avatar,
                        caption: p.caption,
                        imageUrl: p.image_url || undefined,
                        poll: p.poll as any,
                        likes: p.likes ?? 0,
                        likedBy: p.liked_by ?? [],
                        comments: p.comments ?? [],
                        timestamp: p.created_at,
                    };
                    setPosts(prev => [newPost, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    const p = payload.new;
                    setPosts(prev => prev.map(oldPost => oldPost.id === p.id ? {
                        ...oldPost,
                        likes: p.likes ?? 0,
                        likedBy: p.liked_by ?? [],
                        comments: p.comments ?? [],
                        poll: p.poll as any,
                        caption: p.caption,
                    } : oldPost));
                } else if (payload.eventType === 'DELETE') {
                    setPosts(prev => prev.filter(oldPost => oldPost.id !== payload.old.id));
                }
            })
            .subscribe();

        // Configurar Realtime para historias
        const storiesSubscription = supabase
            .channel('community_stories_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'community_stories' }, (payload) => {
                console.log('Realtime update for stories:', payload);
                if (payload.eventType === 'INSERT') {
                    const s = payload.new;
                    const newStory: Story = {
                        id: s.id,
                        monitorName: s.monitor_name,
                        monitorAvatar: s.monitor_avatar,
                        imageUrl: s.image_url,
                        caption: s.caption ?? undefined,
                        reactions: s.reactions ?? [],
                        viewed: false,
                    };
                    setStories(prev => [newStory, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    const s = payload.new;
                    setStories(prev => prev.map(oldStory => oldStory.id === s.id ? {
                        ...oldStory,
                        reactions: s.reactions ?? [],
                        caption: s.caption ?? undefined,
                    } : oldStory));
                } else if (payload.eventType === 'DELETE') {
                    setStories(prev => prev.filter(oldStory => oldStory.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(postsSubscription);
            supabase.removeChannel(storiesSubscription);
        };
    }, []);

    const handleLike = async (postId: number) => {
        if (!currentUser) return;

        // Optimistic update
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === postId) {
                const alreadyLiked = p.likedBy.includes(currentUser.email);
                if (alreadyLiked) {
                    return { ...p, likes: p.likes - 1, likedBy: p.likedBy.filter(email => email !== currentUser.email) };
                } else {
                    return { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, currentUser.email] };
                }
            }
            return p;
        }));

        try {
            // Obtener el estado actual más reciente antes de actualizar
            const { data: currentPost, error: fetchError } = await supabase
                .from('community_posts')
                .select('likes, liked_by')
                .eq('id', postId)
                .single();

            if (fetchError || !currentPost) throw new Error('Error fetching latest post state');

            const isLiked = (currentPost.liked_by || []).includes(currentUser.email);
            const newLikedBy = isLiked
                ? (currentPost.liked_by || []).filter((email: string) => email !== currentUser.email)
                : [...(currentPost.liked_by || []), currentUser.email];

            const newLikes = newLikedBy.length;

            await supabase
                .from('community_posts')
                .update({
                    likes: newLikes,
                    liked_by: newLikedBy,
                })
                .eq('id', postId);
        } catch (error) {
            console.error('Error al actualizar likes en Supabase', error);
            // Revertir cambio optimista si falla (opcional, el Realtime lo corregirá al final)
        }
    };

    const handleAddComment = async (postId: number, commentText: string) => {
        if (!currentUser) return;
        const newComment: Comment = {
            id: Date.now(),
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            text: commentText
        };

        // Optimistic update
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === postId) {
                const existingComments = Array.isArray(p.comments) ? p.comments : [];
                return { ...p, comments: [...existingComments, newComment] };
            }
            return p;
        }));

        try {
            const { data: currentPost, error: fetchError } = await supabase
                .from('community_posts')
                .select('comments')
                .eq('id', postId)
                .single();

            if (fetchError || !currentPost) throw new Error('Error fetching latest comments');

            const existingComments = Array.isArray(currentPost.comments) ? currentPost.comments : [];
            const updatedComments = [...existingComments, newComment];

            await supabase
                .from('community_posts')
                .update({
                    comments: updatedComments,
                })
                .eq('id', postId);
        } catch (error) {
            console.error('Error al actualizar comentarios en Supabase', error);
        }
    };

    const handleAddPost = async (postData: { type: 'photo' | 'poll' | 'text', caption: string, imageBase64?: string | null, poll?: { question: string, options: string[] } }) => {
        try {
            if (!currentUser) return;
            const basePayload: any = {
                camp_id: null, // Los campamentos se asignarán cuando estén contratados
                type: postData.type,
                monitor_name: currentUser.name,
                monitor_avatar: currentUser.avatar,
                caption: postData.caption,
                image_url: null,
                poll: null,
                likes: 0,
                liked_by: [],
                comments: [],
            };

            if (postData.type === 'photo' && postData.imageBase64) {
                basePayload.image_url = postData.imageBase64;
            } else if (postData.type === 'poll' && postData.poll) {
                basePayload.poll = {
                    question: postData.poll.question,
                    options: postData.poll.options.map((opt, i) => ({ id: i + 1, text: opt, votes: 0 })),
                    votedBy: {},
                };
            }

            const { data, error } = await supabase
                .from('community_posts')
                .insert([basePayload])
                .select('*')
                .single();

            if (error) {
                console.error('Failed to add post in Supabase:', error);
                return;
            }

            const newPost: Post = {
                id: data.id,
                campId: data.camp_id,
                type: data.type,
                monitorId: data.monitor_id ?? 0,
                monitorName: data.monitor_name,
                monitorAvatar: data.monitor_avatar,
                caption: data.caption,
                imageUrl: data.image_url || undefined,
                poll: data.poll,
                likes: data.likes ?? 0,
                likedBy: data.liked_by ?? [],
                comments: data.comments ?? [],
                timestamp: data.created_at,
            };

            setPosts(prevPosts => [newPost, ...prevPosts]);
        } catch (error) {
            console.error("Failed to add post:", error);
        } finally {
            setIsCreateModalOpen(false);
        }
    };

    const handleAddStory = async (data: { imageBase64: string, caption: string }) => {
        try {
            if (!currentUser) return;
            const payload = {
                monitor_name: currentUser.name,
                monitor_avatar: currentUser.avatar,
                image_url: data.imageBase64,
                caption: data.caption,
                reactions: [],
            };
            const { data: inserted, error } = await supabase
                .from('community_stories')
                .insert([payload])
                .select('*')
                .single();
            if (error) {
                console.error('Failed to add story in Supabase:', error);
            } else {
                const newStory: Story = {
                    id: inserted.id,
                    monitorName: inserted.monitor_name,
                    monitorAvatar: inserted.monitor_avatar,
                    imageUrl: inserted.image_url,
                    caption: inserted.caption ?? undefined,
                    reactions: inserted.reactions ?? [],
                    viewed: false,
                };
                setStories(prevStories => [newStory, ...prevStories]);
            }
        } catch (error) {
            console.error("Failed to add story:", error);
        } finally {
            setIsCreateStoryModalOpen(false);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (window.confirm(t('community.deletePostConfirmation'))) {
            setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
            try {
                await supabase
                    .from('community_posts')
                    .delete()
                    .eq('id', postId);
            } catch (error) {
                console.error('Failed to delete post in Supabase:', error);
            }
        }
    };

    const handleVote = async (postId: number, optionId: number) => {
        if (!currentUser) return;

        // Optimistic update
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === postId && p.type === 'poll' && p.poll && !p.poll.votedBy[currentUser.email]) {
                const newPoll = { ...p.poll };
                newPoll.options = newPoll.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt);
                newPoll.votedBy = { ...newPoll.votedBy, [currentUser.email]: optionId };
                return { ...p, poll: newPoll };
            }
            return p;
        }));

        try {
            const { data: currentPost, error: fetchError } = await supabase
                .from('community_posts')
                .select('poll')
                .eq('id', postId)
                .single();

            if (fetchError || !currentPost || !currentPost.poll) throw new Error('Error fetching latest poll');

            const currentPoll = currentPost.poll as any;

            // Check if already voted in current database state
            if (currentPoll.votedBy[currentUser.email]) {
                console.warn('User already voted in current state');
                return;
            }

            const updatedPoll = { ...currentPoll };
            updatedPoll.options = updatedPoll.options.map((opt: any) =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            );
            updatedPoll.votedBy = { ...updatedPoll.votedBy, [currentUser.email]: optionId };

            await supabase
                .from('community_posts')
                .update({
                    poll: updatedPoll,
                })
                .eq('id', postId);
        } catch (error) {
            console.error('Failed to update poll in Supabase:', error);
        }
    };

    const handleViewStory = (storyId: number) => {
        const storyIndex = stories.findIndex(s => s.id === storyId);
        if (storyIndex > -1) setViewingStoryIndex(storyIndex);
    };

    const handleStoryViewed = (storyId: number) => {
        setStories(prevStories => prevStories.map(s => s.id === storyId ? { ...s, viewed: true } : s));
    };

    const handleReactToStory = (storyId: number, emoji: string) => {
        if (!currentUser) return;
        setStories(prevStories => prevStories.map(s => {
            if (s.id === storyId) {
                const existingReactionIndex = s.reactions?.findIndex(r => r.userEmail === currentUser.email) ?? -1;
                let newReactions = [...(s.reactions || [])];
                if (existingReactionIndex !== -1) {
                    if (newReactions[existingReactionIndex].emoji === emoji) {
                        newReactions.splice(existingReactionIndex, 1);
                    } else {
                        newReactions[existingReactionIndex] = { userEmail: currentUser.email, emoji };
                    }
                } else {
                    newReactions.push({ userEmail: currentUser.email, emoji });
                }
                return { ...s, reactions: newReactions };
            }
            return s;
        }));
    };

    if (!currentUser || !role) return null;

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-12">
            <header className="flex justify-between items-center py-6 px-4 mb-4">
                <div>
                    <h1 className="text-4xl font-black text-[#2E4053] tracking-tight">{t('community.title')}</h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Social Feed & Momentum</p>
                </div>
                <div className="flex items-center gap-3">
                    {role === 'monitor' && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-12 h-12 flex items-center justify-center bg-[#8EB8BA] text-white rounded-2xl shadow-lg shadow-teal-100 hover:bg-teal-500 hover:shadow-teal-200 hover:-translate-y-0.5 transition-all active:scale-95"
                            title={t('community.createPost')}
                        >
                            <PlusCircleIcon className="w-7 h-7" />
                        </button>
                    )}
                    <div className="h-10 w-[1px] bg-slate-100 mx-1"></div>
                    <button onClick={onAccountClick} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#2E4053] hover:bg-slate-50 rounded-xl transition-all" title={t('account.title')}>
                        <UserIcon className="w-6 h-6" />
                    </button>
                    <button onClick={onSwitchAccount} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-[#2E4053] hover:bg-slate-50 rounded-xl transition-all" title={t('header.switchAccount')}>
                        <SwitchUserIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <StoryBubbles stories={stories} role={role} currentUser={currentUser} onViewStory={handleViewStory} onAddStoryClick={() => setIsCreateStoryModalOpen(true)} />

            <main className="space-y-4">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} role={role} currentUser={currentUser} onLike={handleLike} onAddComment={handleAddComment} onDeletePost={handleDeletePost} onVote={handleVote} />
                ))}
                {posts.length === 0 && (
                    <div className="text-center py-20 px-8 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="text-6xl mb-4">✨</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Aún no hay publicaciones</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            {role === 'monitor'
                                ? '¡Sé el primero en compartir la magia del campamento con las familias!'
                                : 'Pronto los monitores compartirán fotos y novedades increíbles aquí.'}
                        </p>
                    </div>
                )}
            </main>

            {isCreateModalOpen && role === 'monitor' && (<CreatePostModal onClose={() => setIsCreateModalOpen(false)} onAddPost={handleAddPost} />)}
            {isCreateStoryModalOpen && role === 'monitor' && (<CreateStoryModal onClose={() => setIsCreateStoryModalOpen(false)} onAddStory={handleAddStory} />)}
            {viewingStoryIndex !== null && (<StoryViewer stories={stories} startIndex={viewingStoryIndex} onClose={() => setViewingStoryIndex(null)} onViewed={handleStoryViewed} onReact={handleReactToStory} />)}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes heart-pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                .animate-heart-pop { animation: heart-pop 0.4s ease-out; }
            `}</style>
        </div>
    );
};

export default CommunityPage;