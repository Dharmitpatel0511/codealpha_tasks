class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [
            'Songs/1.mp3',
            'Songs/2.mp3',
            'Songs/3.mp3',
            'Songs/4.mp3'
        ];
        this.currentTrack = 0;
        this.isPlaying = false;

        // DOM Elements
        this.playPauseBtn = document.getElementById('play-pause');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.currentTime = document.querySelector('.current');
        this.duration = document.querySelector('.duration');
        this.volumeSlider = document.getElementById('volume');
        this.songTitle = document.getElementById('song-title');

        this.initializePlayer();
        this.addEventListeners();
    }

    initializePlayer() {
        this.audio.src = this.playlist[this.currentTrack];
        this.updateSongTitle();
    }

    addEventListeners() {
        // Play/Pause
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());

        // Previous
        this.prevBtn.addEventListener('click', () => this.playPrevious());

        // Next
        this.nextBtn.addEventListener('click', () => this.playNext());

        // Progress bar
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));

        // Volume
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));

        // Song ended
        this.audio.addEventListener('ended', () => this.playNext());

        // Update duration
        this.audio.addEventListener('loadedmetadata', () => {
            this.duration.textContent = this.formatTime(this.audio.duration);
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playPauseBtn.textContent = '▶';
        } else {
            this.audio.play();
            this.playPauseBtn.textContent = '⏸';
        }
        this.isPlaying = !this.isPlaying;
    }

    playNext() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadAndPlay();
    }

    playPrevious() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadAndPlay();
    }

    loadAndPlay() {
        this.audio.src = this.playlist[this.currentTrack];
        this.updateSongTitle();
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progress.style.width = `${progressPercent}%`;
        this.currentTime.textContent = this.formatTime(currentTime);
    }

    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    setVolume(e) {
        const volume = e.target.value / 100;
        this.audio.volume = volume;
    }

    updateSongTitle() {
        const fileName = this.playlist[this.currentTrack].split('/').pop();
        this.songTitle.textContent = fileName.replace('.mp3', '');
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the music player
const player = new MusicPlayer(); 