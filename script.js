/* =========================
LOADER
========================= */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
  }, 1800);
});

/* =========================
ELEMENTS
========================= */

const introScreen = document.getElementById("introScreen");
const enterBtn = document.getElementById("enterBtn");

const pinScreen = document.getElementById("pinScreen");
const pinBox = document.getElementById("pinBox");
const pinDisplay = document.getElementById("pinDisplay");
const pinMessage = document.getElementById("pinMessage");
const keys = document.querySelectorAll(".key");

const mainSite = document.getElementById("mainSite");

const bgMusic = document.getElementById("bgMusic");
/* =========================
AUTO PAUSE BG MUSIC
WHEN OTHER AUDIO PLAYING
========================= */

const allAudios = document.querySelectorAll('audio');

allAudios.forEach(audio => {

  // skip background music sendiri
  if(audio.id === "bgMusic") return;

  audio.addEventListener("play", () => {

    // pause background music
    if(bgMusic && !bgMusic.paused){
      bgMusic.pause();
    }

    // pause audio lain biar gak tabrakan
    allAudios.forEach(otherAudio => {
      if(otherAudio !== audio && otherAudio.id !== "bgMusic"){
        otherAudio.pause();
      }
    });

  });

  audio.addEventListener("ended", () => {

    // nyalain lagi bg music
    if(bgMusic){
      bgMusic.play().catch(() => {});
    }

  });

  audio.addEventListener("pause", () => {

    // kalau semua audio udah pause
    const stillPlaying = [...allAudios].some(a =>
      a.id !== "bgMusic" &&
      !a.paused
    );

    if(!stillPlaying && bgMusic){

      // lanjut bg music lagi
      bgMusic.play().catch(() => {});

    }

  });

});
const musicToggle = document.getElementById("musicToggle");

const expandBtn = document.getElementById("expandMessageBtn");
const expandableMessage = document.getElementById("expandableMessage");

const aboutCard = document.getElementById("aboutCard");
const playlistCard = document.getElementById("playlistCard");

const openMemories = document.getElementById("openMemories");
const memoriesModal = document.getElementById("memoriesModal");
const closeMemories = document.getElementById("closeMemories");
const closeModalBtn = document.getElementById("closeModalBtn");

const cursor = document.querySelector(".cursor");

/* =========================
INTRO BUTTON
========================= */

enterBtn.addEventListener("click", () => {
  introScreen.style.opacity = "0";
  introScreen.style.pointerEvents = "none";

  setTimeout(() => {
    pinScreen.style.display = "flex";
  }, 500);
});

/* =========================
PIN SYSTEM
========================= */

let enteredPin = "";
const correctPin = "160426";
let wrongAttempt = 0;

const wrongMessages = [
  "yah masa gatau 😭",
  "hmmm 🤨",
  "kecewa sih 😔",
  "clue tanggal hmm 👀"
];

function updatePinDisplay(){
  if(enteredPin.length === 0){
    pinDisplay.innerHTML = "• • • • • •";
  }else{
    pinDisplay.innerHTML = enteredPin.split("").map(() => "•").join(" ");
  }
}

keys.forEach((key) => {
  key.addEventListener("click", () => {
    const value = key.textContent;

    if(key.classList.contains("delete-key")){
      enteredPin = enteredPin.slice(0, -1);
      updatePinDisplay();
      return;
    }

    if(key.classList.contains("clear-key")){
      enteredPin = "";
      updatePinDisplay();
      return;
    }

    if(enteredPin.length >= 6) return;

    enteredPin += value;
    updatePinDisplay();

    if(enteredPin.length === 6){
      if(enteredPin === correctPin){
        pinMessage.innerHTML = "yeayyy unlocked 💖";
        pinMessage.style.color = "#62c97b";
        unlockWebsite();
      }else{
        wrongPin();
      }
    }
  });
});

function wrongPin(){
  pinBox.classList.add("shake");

  setTimeout(() => {
    pinBox.classList.remove("shake");
  }, 500);

  pinMessage.innerHTML = wrongMessages[Math.min(wrongAttempt, wrongMessages.length - 1)];
  pinMessage.style.color = "#ff5ea8";

  wrongAttempt++;
  enteredPin = "";
  updatePinDisplay();
}

/* =========================
UNLOCK WEBSITE
========================= */

function unlockWebsite(){
  setTimeout(() => {
    pinScreen.style.opacity = "0";
    pinScreen.style.pointerEvents = "none";

    setTimeout(() => {
      pinScreen.style.display = "none";
      mainSite.style.display = "block";
      document.body.style.overflowY = "auto";

      surpriseEntrance();
      playMusic();

    }, 800);
  }, 1000);
}

/* =========================
SURPRISE ENTRANCE
========================= */

function surpriseEntrance(){
  for(let i = 0; i < 35; i++){
    createFloatingHeart(window.innerWidth / 2, window.innerHeight / 2);
  }
}

/* =========================
EXPANDABLE MESSAGE
========================= */

expandMessageBtn.addEventListener("click", () => {

  if(expandableMessage.classList.contains("active")){

    expandableMessage.classList.add("closing");

    setTimeout(() => {
      expandableMessage.classList.remove("active");
      expandableMessage.classList.remove("closing");
    }, 450);

  }else{

    expandableMessage.classList.add("active");

  }

});

/* =========================
CARDS
========================= */

aboutCard.addEventListener("click", () => {
  aboutCard.classList.toggle("active");
});

playlistCard.addEventListener("click", () => {
  playlistCard.classList.toggle("active");
});

/* =========================
MEMORIES MODAL + CAMERA FLASH
========================= */

const cameraFlash = document.getElementById("cameraFlash");

const memoriesMusic = document.getElementById("memoriesMusic");
const memoriesMusicBtn = document.getElementById("memoriesMusicBtn");

function triggerCameraFlash(){

  if(!cameraFlash) return;

  cameraFlash.classList.add("active");

  setTimeout(() => {
    cameraFlash.classList.remove("active");
  }, 600);

}

/* PLAY MEMORIES MUSIC */
function playMemoriesMusic(){

  if(!memoriesMusic) return;

  // pause bg music utama
  if(bgMusic && !bgMusic.paused){
    bgMusic.pause();
  }

  memoriesMusic.volume = 0.45;

  memoriesMusic.play().then(() => {

    if(memoriesMusicBtn){
      memoriesMusicBtn.classList.add("playing");
      memoriesMusicBtn.textContent = "⏸ Photograph";
    }

  }).catch(() => {});

}

/* STOP MEMORIES MUSIC */
function stopMemoriesMusic(){

  if(!memoriesMusic) return;

  memoriesMusic.pause();
  memoriesMusic.currentTime = 0;

  if(memoriesMusicBtn){
    memoriesMusicBtn.classList.remove("playing");
    memoriesMusicBtn.textContent = "🎧 Photograph";
  }

  // nyalain bg music lagi
  if(bgMusic){
    bgMusic.play().catch(() => {});
  }

}

/* OPEN MEMORIES */
function openMemoriesModal(){

  triggerCameraFlash();

  setTimeout(() => {

    memoriesModal.classList.add("active");

    document.body.style.overflow = "hidden";

    playMemoriesMusic();

  }, 250);

}

/* CLOSE MEMORIES */
function closeModal(){

  memoriesModal.classList.remove("active");

  document.body.style.overflow = "auto";

  stopMemoriesMusic();

}

/* EVENTS */
openMemories.addEventListener("click", openMemoriesModal);

closeMemories.addEventListener("click", closeModal);

closeModalBtn.addEventListener("click", closeModal);

/* TOGGLE MUSIC BUTTON */
if(memoriesMusicBtn){

  memoriesMusicBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    if(memoriesMusic.paused){

      playMemoriesMusic();

    }else{

      memoriesMusic.pause();

      memoriesMusicBtn.classList.remove("playing");
      memoriesMusicBtn.textContent = "🎧 Photograph";

    }

  });

}

/* =========================
MUSIC SYSTEM
========================= */

let isPlaying = false;

bgMusic.volume = 0.5;
bgMusic.loop = true;
bgMusic.preload = "auto";

async function playMusic(){
  try{
    await bgMusic.play();
    isPlaying = true;
    musicToggle.innerHTML = "⏸";
  }catch(err){
    console.log("music error:", err);
  }
}

function pauseMusic(){
  bgMusic.pause();
  isPlaying = false;
  musicToggle.innerHTML = "🎵";
}

musicToggle.addEventListener("click", () => {
  if(isPlaying){
    pauseMusic();
  }else{
    playMusic();
  }
});

/* =========================
CUSTOM CURSOR
========================= */

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* =========================
FLOATING HEARTS
========================= */

document.addEventListener("mousemove", (e) => {
  if(Math.random() > 0.88){
    createFloatingHeart(e.clientX, e.clientY);
  }
});

function createFloatingHeart(x, y){
  const heart = document.createElement("div");

  heart.classList.add("floating-heart");
  heart.innerHTML = ["💖","💕","💗","✨"][Math.floor(Math.random() * 4)];

  heart.style.left = x + "px";
  heart.style.top = y + "px";
  heart.style.fontSize = Math.random() * 14 + 14 + "px";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 3000);
}

/* =========================
SCROLL ANIMATION
========================= */

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0px)";
    }
  });
}, {
  threshold:0.15
});

document.querySelectorAll(".magic-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(60px)";
  card.style.transition = "0.8s";
  observer.observe(card);
});

/* =========================
PREVENT HASH JUMP
========================= */

document.querySelectorAll('a[href="#memoriesModal"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    openMemoriesModal();
  });
});

/* =========================
ESC CLOSE MODAL
========================= */

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape"){
    closeModal();
    closePhotoPopup();
    pauseRememberSong();
  }
});

/* =========================
RELATIONSHIP TIMER
========================= */

const relationshipTimer = document.getElementById("relationshipTimer");
const startDate = new Date("2026-04-16T00:00:00");

function updateRelationshipTime(){
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  relationshipTimer.innerHTML = `
    ${days} days
    ${hours} hours
    ${minutes} minutes
    ${seconds} seconds
  `;
}

setInterval(updateRelationshipTime,1000);
updateRelationshipTime();

/* =========================
TYPING LOVE LETTER
========================= */

const typingLetter = document.getElementById("typingLetter");

const loveText = `

One month with you honestly feels
like one of the softest and happiest
parts of my life.

Thank you for every little thing.
For every laugh, every random talk,
every attention, every comfort,
and every moment you stayed.

I know this is only one month,
but somehow you already became
someone very special to me.

And honestly?
I still want more memories,
more late night talks,
more laughs,
more soft moments,
and more months with you ❤️

`;

let letterIndex = 0;
let typingStarted = false;

function typeLetter(){
  if(letterIndex < loveText.length){
    typingLetter.innerHTML += loveText.charAt(letterIndex);
    letterIndex++;
    setTimeout(typeLetter,35);
  }
}

aboutCard.addEventListener("click", () => {
  if(!typingStarted){
    typingStarted = true;
    typeLetter();
  }
});

/* =========================
PARTICLE GENERATOR
========================= */

const particles = document.getElementById("particles");

function createParticle(){
  const particle = document.createElement("div");

  particle.classList.add("particle");

  const size = Math.random() * 6 + 2;

  particle.style.width = size + "px";
  particle.style.height = size + "px";
  particle.style.left = Math.random() * window.innerWidth + "px";
  particle.style.animationDuration = Math.random() * 10 + 8 + "s";
  particle.style.opacity = Math.random();

  particles.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 18000);
}

setInterval(createParticle,300);

/* =========================
SECRET ENDING
========================= */

const secretEnding = document.querySelector(".secret-ending");

const endingObserver = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      secretEnding.classList.add("show");
    }
  });
},{
  threshold:0.4
});

endingObserver.observe(secretEnding);

/* =========================
CONFETTI HEART
========================= */

const loveHeart = document.getElementById("loveHeart");

if(loveHeart){
loveHeart.addEventListener("click", () => {
  for(let i = 0; i < 45; i++){
    const confetti = document.createElement("div");

    confetti.classList.add("confetti");

    confetti.style.left = loveHeart.getBoundingClientRect().left + 30 + "px";
    confetti.style.top = loveHeart.getBoundingClientRect().top + 30 + "px";
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 75%)`;
    confetti.style.transform = `translate(${Math.random()*200-100}px, ${Math.random()*200-100}px)`;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 1500);
  }
});
}

/* =========================
PHOTO FULLSCREEN POPUP
========================= */

const photoPopup = document.getElementById("photoPopup");
const popupImage = document.getElementById("popupImage");
const closePhoto = document.getElementById("closePhoto");

function openPhotoPopup(src){
  if(!photoPopup || !popupImage) return;

  popupImage.src = src;
  photoPopup.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePhotoPopup(){
  if(!photoPopup || !popupImage) return;

  photoPopup.classList.remove("active");
  popupImage.src = "";

  if(!memoriesModal.classList.contains("active")){
    document.body.style.overflow = "auto";
  }
}

document.querySelectorAll(".polaroid img").forEach((photo) => {
  photo.style.cursor = "zoom-in";

  photo.addEventListener("click", (e) => {
    e.stopPropagation();
    openPhotoPopup(photo.src);
  });
});

if(closePhoto){
  closePhoto.addEventListener("click", closePhotoPopup);
}

if(photoPopup){
  photoPopup.addEventListener("click", (e) => {
    if(e.target === photoPopup){
      closePhotoPopup();
    }
  });
}

/* =========================
DIY LYRIC PLAYER REMEMBER
========================= */

const rememberSong = document.getElementById("rememberSong");
const rememberPlayBtn = document.getElementById("rememberPlayBtn");
const rememberProgress = document.getElementById("rememberProgress");
const rememberCurrentTime = document.getElementById("rememberCurrentTime");
const diyPlayer = document.querySelector(".diy-player");
const lyricLines = document.querySelectorAll(".lyric-line");

function formatTime(seconds){
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

async function playRememberSong(){
  if(!rememberSong || !rememberPlayBtn || !diyPlayer) return;

  try{
    rememberSong.currentTime = 0;
    await rememberSong.play();

    rememberPlayBtn.innerHTML = "⏸";
    diyPlayer.classList.add("playing");
  }catch(err){
    console.log("remember song error:", err);
  }
}

function pauseRememberSong(){
  if(!rememberSong || !rememberPlayBtn || !diyPlayer) return;

  rememberSong.pause();
  rememberSong.currentTime = 0;

  rememberPlayBtn.innerHTML = "▶";
  diyPlayer.classList.remove("playing");

  if(rememberProgress){
    rememberProgress.style.width = "0%";
  }

  if(rememberCurrentTime){
    rememberCurrentTime.innerHTML = "0:00";
  }

  lyricLines.forEach(line => {
    line.classList.remove("active");
  });

  if(lyricLines[0]){
    lyricLines[0].classList.add("active");
  }
}

if(rememberPlayBtn && rememberSong){
  rememberPlayBtn.addEventListener("click", () => {
    if(rememberSong.paused){
      rememberSong.play();
      rememberPlayBtn.innerHTML = "⏸";
      diyPlayer.classList.add("playing");
    }else{
      rememberSong.pause();
      rememberPlayBtn.innerHTML = "▶";
      diyPlayer.classList.remove("playing");
    }
  });

  rememberSong.addEventListener("timeupdate", () => {
    const current = rememberSong.currentTime;
    const duration = 24;

    if(rememberCurrentTime){
      rememberCurrentTime.innerHTML = formatTime(current);
    }

    if(rememberProgress){
      rememberProgress.style.width = Math.min((current / duration) * 100, 100) + "%";
    }

    lyricLines.forEach(line => {
      const time = Number(line.dataset.time);

      if(current >= time){
        lyricLines.forEach(item => {
          item.classList.remove("active");
        });

        line.classList.add("active");
      }
    });

    if(current >= duration){
      pauseRememberSong();
    }
  });
}

/* =========================
OPEN WHEN SECRET SLIDE
========================= */

const openWhenCover = document.getElementById("openWhenCover");
const openWhenWrapper = document.getElementById("openWhenWrapper");
const closeOpenWhen = document.getElementById("closeOpenWhen");
const backOpenWhen = document.getElementById("backOpenWhen");
const letterCards = document.querySelectorAll(".letter-card");
const panelContents = document.querySelectorAll(".panel-content");

function pauseOpenWhenAudio(){
  document.querySelectorAll(".open-when-panel audio").forEach((audio) => {
    audio.pause();
  });
}

function resetOpenWhen(){
  if(!openWhenWrapper) return;

  letterCards.forEach((card) => {
    card.classList.remove("active-letter");
  });

  panelContents.forEach((panel) => {
    panel.classList.remove("active");
  });

  openWhenWrapper.classList.remove("panel-open");
  openWhenWrapper.classList.add("menu-only");

  pauseOpenWhenAudio();
  pauseRememberSong();
}

function backToOpenWhenMenu(){
  if(!openWhenWrapper) return;

  letterCards.forEach((card) => {
    card.classList.remove("active-letter");
  });

  panelContents.forEach((panel) => {
    panel.classList.remove("active");
  });

  openWhenWrapper.classList.remove("panel-open");
  openWhenWrapper.classList.add("menu-only");

  pauseOpenWhenAudio();
  pauseRememberSong();

  setTimeout(() => {
    openWhenWrapper.scrollIntoView({
      behavior:"smooth",
      block:"center"
    });
  }, 120);
}

function showOpenWhenPanel(target){
  if(!openWhenWrapper) return;

  letterCards.forEach((card) => {
    card.classList.remove("active-letter");
  });

  panelContents.forEach((panel) => {
    panel.classList.remove("active");
  });

  const activeCard = document.querySelector(`[data-target="${target}"]`);
  const activePanel = document.getElementById(target);

  if(activeCard){
    activeCard.classList.add("active-letter");
  }

  if(activePanel){
    activePanel.classList.add("active");
  }

  openWhenWrapper.classList.remove("menu-only");
  openWhenWrapper.classList.add("panel-open");

  pauseOpenWhenAudio();

  if(target === "remember"){
    playRememberSong();
  }else{
    pauseRememberSong();
  }

  setTimeout(() => {
    openWhenWrapper.scrollIntoView({
      behavior:"smooth",
      block:"center"
    });
  }, 160);
}

if(openWhenCover && openWhenWrapper){
  openWhenCover.addEventListener("click", () => {
    openWhenCover.classList.add("hide");

    setTimeout(() => {
      openWhenCover.style.display = "none";

      openWhenWrapper.classList.add("show");
      openWhenWrapper.classList.add("menu-only");
      openWhenWrapper.classList.remove("panel-open");

      resetOpenWhen();

      setTimeout(() => {
        openWhenWrapper.scrollIntoView({
          behavior:"smooth",
          block:"center"
        });
      }, 160);

    }, 350);
  });
}

if(closeOpenWhen && openWhenWrapper && openWhenCover){
  closeOpenWhen.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    resetOpenWhen();

    openWhenWrapper.classList.remove("show");
    openWhenWrapper.classList.remove("menu-only");
    openWhenWrapper.classList.remove("panel-open");

    setTimeout(() => {
      openWhenCover.style.display = "block";

      setTimeout(() => {
        openWhenCover.classList.remove("hide");
      }, 20);
    }, 450);
  });
}

if(backOpenWhen){
  backOpenWhen.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    backToOpenWhenMenu();
  });
}

letterCards.forEach((card) => {
  card.addEventListener("click", () => {
    showOpenWhenPanel(card.dataset.target);
  });
});
