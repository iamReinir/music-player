const API_URL = "https://100.87.230.49:8000/music"; // Update if needed
let songs = [];
let g_index = 0;
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
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        li.draggable = true;
        let textSpan = document.createElement("span");
        textSpan.textContent = song;

        li.onclick = () => playSong(index);
        li.ondragstart = (e) => dragStart(e, index);
        li.ondragover = (e) => e.preventDefault();
        li.ondrop = (e) => drop(e, index);
        // Remove Button
        let removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.classList.add("btn", "btn-sm", "ms-2");
        removeButton.onclick = (e) => {
            e.stopPropagation(); // Prevent accidental playback
            removeFromPlaylist(index);
        };

        li.appendChild(textSpan); // Song name on the left
        li.appendChild(removeButton);

        list.appendChild(li);
    });
}

function removeFromPlaylist(index) {
    songs.splice(index, 1);
    renderSongs();
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


function playSong(index) {
    g_index = index;
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

document.getElementById("prev-btn").addEventListener("click", () => {
    playSong((g_index - 1) % songs.length);
});

document.getElementById("next-btn").addEventListener("click", () => {
    playSong((g_index + 1) % songs.length);
});

document.getElementById("searchInput").addEventListener("input", function() {
    const query = this.value.toLowerCase();
    const songs = document.querySelectorAll("#songList li");
    let count = 0;
    songs.forEach(song => {
        const text = song.textContent.toLowerCase();
        if (text.includes(query)) {
            ++count;
            song.style.border = "2px solid #4a90e2"; // mark found song
        } else {
            song.style.border = "1px solid #333"; // back to normal
        }
    });
    document.getElementById("searchResult").innerHTML = "Song count : " + count;
});


/*
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
            player.onended = () => {
                let nextIndex = (index + 1) % songs.length; // Loop back after last song
                playSong(nextIndex);
            };
        })
        .catch(error => console.error("Error loading song:", error));
}
*/
fetchSongs();

