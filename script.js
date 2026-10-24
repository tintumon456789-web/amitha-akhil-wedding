
const envelopeScreen = document.getElementById("envelopeScreen");
const openButton = document.getElementById("openInvitation");
const tapInstruction = document.getElementById("tapInstruction");
const invitationScreen = document.getElementById("invitationScreen");
const weddingMusic = document.getElementById("weddingMusic");

let isOpening = false;
let countdownInterval = null;

// ========================================
// 1. OPEN THE WEDDING INVITATION
// ========================================

openButton.addEventListener("click", handleOpenInvitation);

function handleOpenInvitation(event) {
  event.preventDefault();
  event.stopPropagation();

  // Prevent the invitation from opening twice.
  if (isOpening) return;

  isOpening = true;
  openButton.disabled = true;

  // Start wedding music after the guest clicks the seal.
  if (weddingMusic) {
    weddingMusic.volume = 0.5;

    weddingMusic.play().catch((error) => {
      console.log("Music playback could not start:", error);
    });
  }

  if (tapInstruction) {
    tapInstruction.textContent = "OPENING YOUR INVITATION...";
  }

  // Trigger the existing envelope animation.
  envelopeScreen.classList.add("opening");

  let openingFinished = false;

  function finishOpening(event) {
    // Ignore animations belonging to child elements.
    if (event && event.target !== envelopeScreen) return;
    if (openingFinished) return;

    openingFinished = true;

    envelopeScreen.removeEventListener(
      "animationend",
      finishOpening
    );

    showInvitation();
  }

  envelopeScreen.addEventListener("animationend", finishOpening);

  // Fallback in case the animation event does not fire.
  window.setTimeout(() => {
    finishOpening();
  }, 1800);
}

// ========================================
// 2. SHOW THE MAIN INVITATION
// ========================================

function showInvitation() {
  if (envelopeScreen.hidden) return;

  envelopeScreen.hidden = true;
  invitationScreen.hidden = false;

  document.title = "Amitha & Akhil | Wedding Invitation";
  window.scrollTo(0, 0);

  // Start the countdown.
  updateCountdown();

  if (countdownInterval === null) {
    countdownInterval = window.setInterval(updateCountdown, 1000);
  }
}

// ========================================
// 3. WEDDING COUNTDOWN
// 29 November 2026, 11:45 AM IST
// ========================================

const weddingDate = new Date(
  "2026-11-29T11:45:00+05:30"
).getTime();

function updateCountdown() {
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const messageElement = document.getElementById("countdownMessage");

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement ||
    !messageElement
  ) {
    return;
  }

  const difference = weddingDate - Date.now();

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    messageElement.textContent =
      "Today is our special day! Thank you for celebrating with us.";

    if (countdownInterval !== null) {
      window.clearInterval(countdownInterval);
      countdownInterval = null;
    }

    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");

  messageElement.textContent =
    "Every second brings us closer to our special day.";
}
