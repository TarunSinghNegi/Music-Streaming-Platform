console.log("Let's write JavaScript");
let currentSong = new Audio();
let songs;
let currfolder;

// --------------------------------------------------------------------Format second in minutes----------------

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = secs < 10 ? '0' + secs : secs;

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {

    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document
        .querySelector(".songlist")
        .getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `<li>
                            <img src="music.svg" alt="" class="music">
                            <div class="info">
                                <div class="songname">${song.replaceAll("%20", " ").replaceAll("320 Kbps.mp3", "").replaceAll("/", "")}</div>
                                <div class="Artist">Arijit Singh</div>
                            </div>
                            <div class="play"><img src="play.svg" alt="" class="play"></div>
                        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {



            const songName = e.querySelector(".songname").innerText.trim();
            const track = songs.find(song => song.replaceAll("%20", " ").replaceAll("320 Kbps.mp3", "").replaceAll("/", "").trim() === songName);
            playMusic(track);



            // playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentSong.play();
        playbtn.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}




async function displayAlbum() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cards = document.querySelector(".cards");
    let array = Array.from(anchors)
    // for (let index = 0; index < array.length; index++) {
    //     const e = array[index];
    //     if (e.href.includes("/songs")) {
    //         let folder = e.href.split("/").slice(-2)[0];
    //         //Get the metadata of the folder//
    //         let a = await fetch(`/songs/${folder}/info.json`);
    //         let response = await a.json();
    //         cards.innerHTML = cards.innerHTML + `<div data-folder="${folder}" class="card">
    //                 <img src="/songs/${folder}/cover.jpg" alt="nahi h">
    //                 <h1>${response.title}</h1>
    //                 <span>${response.description}</span>
    //             </div>`


    //     }
    // }

    console.log("e");
    async function populateCards() {
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs")) {
                let folder = e.href.split("/").slice(-2)[0];
                
                // Get the metadata of the folder
                let a = await fetch(`/songs/${folder}/info.json`);
                let response = await a.json();
                
                cards.innerHTML += `<div data-folder="${folder}" class="card">
                    <img src="/songs/${folder}/cover.jpeg" alt="nahi h">
                    <h1>${response.title}</h1>
                    <span>${response.description}</span>
                </div>`;
            }
        }
    }
    

    //Load the playlist//
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

}


async function main() {
    // getting all the songs
    await getSongs("songs/ncs");
    // console.log(songs);
    playMusic(songs[0], true);

    // Display all thr albums//
    await displayAlbum();

    // let array = []; // Populate this array with your anchor elements
    await populateCards();


    //Attach an event listner to play, next and previous
    playbtn.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playbtn.src = "pause.svg"
        }
        else {
            currentSong.pause()
            playbtn.src = "play.svg"
        }
    })


    //For time duration of song//
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    //Adding event listner to seekbar
    document.querySelector(".playbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
        console.log(percent);
    })

    //hambrurger//
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //cross//
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //prevbutton//
    previousbtn.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if ((index) - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
        else {
            playMusic(songs[songs.length - 1]);
        }
    })

    //nextsong//
    nextbtn.addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
        else {
            playMusic(songs[0]);
        }
    })

    
}

main();











