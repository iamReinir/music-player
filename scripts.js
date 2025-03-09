const API_URL = "http://100.87.230.49:8000/music"; // Update if needed
let songs = [];

async function fetchSongs() {
    let response = await fetch(`${API_URL}/songs`);
    songs = await response.json();
    renderSongs();
}

function renderSongs() {
    let list = document.getElementById("songList");
    list.innerHTML = "";
    songs.forEach((song, index) => {
        let li = document.createElement("li");
        li.textContent = song;
        li.classList.add("list-group-item", "list-group-item-action");
        li.draggable = true;

        li.onclick = () => playSong(index);
        li.ondragstart = (e) => dragStart(e, index);
        li.ondragover = (e) => e.preventDefault();
        li.ondrop = (e) => drop(e, index);

        list.appendChild(li);
    });
}

function shuffleSongs() {
    songs.sort(() => Math.random() - 0.5);
    renderSongs();
}

let draggedIndex = null;

function dragStart(event, index) {
    draggedIndex = index;
}

function drop(event, index) {
    if (draggedIndex !== null) {
        let movedSong = songs.splice(draggedIndex, 1)[0];
        songs.splice(index, 0, movedSong);
        draggedIndex = null;
        renderSongs();
    }
}

/*
function playSong(index) {
    let songTitle = document.getElementById("songTitle");
    let player = document.getElementById("audioPlayer");
    player.src = `${API_URL}/play/${songs[index]}`;
    songTitle.textContent = songs[index]; // Update song name
    player.play();
    player.onended = () => {
        let nextIndex = (index + 1) % songs.length; // Loop back after last song
        playSong(nextIndex);
    };
}
*/
function playSong(index) {
    let songUrl = `${API_URL}/play/${songs[index]}`; // Use Tailscale IP
    let songTitle = document.getElementById("songTitle");
    fetch(songUrl)
        .then(response => response.blob())
        .then(blob => {
            let audioUrl = URL.createObjectURL(blob);
            let player = document.getElementById("audioPlayer");
            songTitle.textContent = songs[index]; // Update song name
            player.src = audioUrl;
            player.play();
        })
        .catch(error => console.error("Error loading song:", error));
}
fetchSongs();