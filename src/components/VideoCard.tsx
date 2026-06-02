"use client";

import { useRef, useState, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { BiCommentDetail } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { FaPlayCircle } from "react-icons/fa";
import { FaRegPauseCircle } from "react-icons/fa";
import { GoMute } from "react-icons/go";
import { GoUnmute } from "react-icons/go";



type Props = {
    videoUrl: string;
    authorName: string;
    description: string;
    likesCount: number;
    isMuted: boolean;
    onToggleMute: () => void;
};

export default function VideoCard({
    videoUrl,
    authorName,
    description,
    likesCount,
    isMuted,
    onToggleMute,
}: Props) {

    // Ref trỏ đến thẻ <video> và container bọc ngoài
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State quản lý like
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(likesCount);

    // State mở rộng / thu gọn description
    const [isExpanded, setIsExpanded] = useState(false);

    // State quản lý play/pause
    const [isPlaying, setIsPlaying] = useState(true);

    // State hiển thị icon play/pause tạm thời khi click
    const [showIcon, setShowIcon] = useState(false);

    // State theo dõi user có đang chủ động pause không
    const [isManuallyPaused, setIsManuallyPaused] = useState(false);

    

    // Hàm xử lý play/pause khi user click vào video
    const togglePlay = async () => {
        const video = videoRef.current;

        if (!video) return;

        setShowIcon(true);

        try {
            if (isPlaying) {
                video.pause();
                setIsPlaying(false);
                setIsManuallyPaused(true);
            } else {
                await video.play();
                setIsPlaying(true);
                setIsManuallyPaused(false);
            }
        } catch (error) {
            console.log(error);
        }

        setTimeout(() => {
            setShowIcon(false);
        }, 500);
    };

    // Hàm xử lý mute/unmute video
    const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    onToggleMute();
};

    // Sync trạng thái mute từ props xuống thẻ <video> thực tế
useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
}, [isMuted]);

    // Hàm xử lý like/unlike
    const handleLike = () => {
        setIsLiked(!isLiked);

        if (!isLiked) {
            setLikes(likes + 1);
        } else {
            setLikes(likes - 1);
        }
    };

    // Tự động play/pause video dựa theo vị trí scroll (IntersectionObserver)
    // Chạy lại mỗi khi isManuallyPaused thay đổi
    useEffect(() => {
        // Tạo observer theo dõi khi nào container xuất hiện / biến mất khỏi màn hình
        const observer = new IntersectionObserver(
            ([entry]) => {
                const video = videoRef.current;

                // Thoát sớm nếu video chưa mount
                if (!video) return;

                if (entry.isIntersecting) {
                    // Video đang hiển thị trên màn hình (>= 60% diện tích)

                    // Chỉ tự play nếu user KHÔNG chủ động pause trước đó
                    // → tránh tự play lại khi user đã bấm pause rồi scroll nhẹ
                    if (!isManuallyPaused) {
                        video.play();
                        setIsPlaying(true);
                    }
                } else {
                    // Video đã cuộn ra ngoài màn hình → luôn pause
                    video.pause();
                    setIsPlaying(false);

                    // Reset cờ isManuallyPaused để lần sau scroll vào lại sẽ tự play bình thường
                    setIsManuallyPaused(false);
                }
            },
            {
                // Chỉ trigger khi ít nhất 60% video hiển thị trong viewport
                threshold: 0.6,
            }
        );

        const currentContainer = containerRef.current;

        // Bắt đầu theo dõi container
        if (currentContainer) {
            observer.observe(currentContainer);
        }

        // Cleanup: hủy theo dõi khi component unmount hoặc trước lần re-run tiếp theo
        return () => {
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
        };
    }, [isManuallyPaused]);

    return (
        // Container toàn màn hình cho mỗi video (snap scroll)
        <div
            ref={containerRef}
            className="relative h-screen w-full snap-start flex items-center justify-center bg-black"
        >

            {/* Video Wrapper — bọc video và các overlay bên trong */}
            <div
                onClick={togglePlay}
                className="
                    relative
                    h-full w-full
                    md:h-[90vh] md:w-[400px]
                    overflow-hidden rounded-xl
                    cursor-pointer
                    "
            >

                {/* Thẻ video chính */}
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="h-full w-full object-cover"
                    loop
                    muted
                    playsInline

                />

                {/* Icon play/pause hiện tạm thời khi user click */}
                <div
                    className={`
                        absolute inset-0
                        flex items-center justify-center
                        pointer-events-none
                        transition-opacity duration-200
                    ${showIcon ? "opacity-100" : "opacity-0"}
                        `}
                >
                    <div className="
    
                ">
                        {isPlaying ? (
                            <FaRegPauseCircle className="text-white text-5xl drop-shadow-2xl" />
                        ) : (
                            <FaPlayCircle className="text-white text-5xl ml-1 drop-shadow-2xl" />
                        )}
                    </div>
                </div>

                {/* Nút mute/unmute góc trên bên trái */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
                    className="absolute top-4 left-4 z-10 text-white text-2xl drop-shadow-lg cursor-pointer"
                >
                    {isMuted ? <GoMute /> : <GoUnmute />}
                </button>

                {/* Gradient overlay phía dưới video */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Info của video — tên tác giả và mô tả */}
                <div className="
                        absolute
                        bottom-20
                        md:bottom-5
                        left-4
                        text-white
                        max-w-[80%]
                        md:max-w-[90%]
                        z-10
                        pointer-events-none
                    ">
                    <h2 className="font-bold">@{authorName}</h2>

                    <div className="flex items-end gap-2">
                        <p
                            className={`
                        text-sm
                        ${isExpanded ? "" : "line-clamp-1"}
                        `}
                        >
                            {description}
                        </p>

                        {/* Nút mở rộng / thu gọn description */}
                        {description.length > 50 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                className="
                                    text-gray-300
                                    text-sm
                                    font-semibold
                                    cursor-pointer
                                    shrink-0
                                    pointer-events-auto
                                    "
                            >
                                {isExpanded ? "Ẩn bớt" : "Thêm"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Các nút tương tác bên phải (like, comment, share) */}
            <div className="
                absolute
                right-4
                md:right-[calc(50%-260px)]
                bottom-28 md:bottom-20
                flex flex-col items-center gap-6 text-white z-10
            ">

                {/* Nút like / unlike */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                    }}
                    className="flex flex-col items-center gap-1 w-14 cursor-pointer"
                >
                    {isLiked ? (
                        <FaHeart
                            className="
                        text-red-500
                        text-4xl
                        drop-shadow-lg
                        animate-pop
                        "
                        />
                    ) : (
                        <FaRegHeart className="text-4xl leading-none" />
                    )}

                    <span className="text-sm font-medium leading-none">
                        {likes}
                    </span>
                </button>

                {/* Nút comment */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col items-center gap-1 w-14 cursor-pointer"
                >
                    <BiCommentDetail className="text-4xl leading-none" />

                    <span className="text-sm font-medium leading-none">
                        120
                    </span>
                </button>

                {/* Nút share */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col items-center gap-1 w-14 cursor-pointer"
                >
                    <FiSend className="text-4xl leading-none" />

                    <span className="text-sm font-medium leading-none">
                        Share
                    </span>
                </button>
            </div>
        </div>
    );
}