let timerInterval;
let timeRemaining;
let isPaused = false;
let startTime;
let pauseTime;
let timer_duration;
let elapsedTime = 0;

let pomo_sequence_index = 0;

var audio = new Audio('audio/piano.wav');

const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

const topSand = document.getElementById('topSand');
const bottomSand = document.getElementById('bottomSand');
const fallingSand = document.getElementById('fallingSand');
const hourglass = document.getElementById('hourglass');
const timerDisplay = document.getElementById('timerDisplay');

function set_sand_color(color){

    document.getElementById('topSand').style.background = color;
    document.getElementById('bottomSand').style.background = color;
    document.getElementById('fallingSand').style.background = color;

}

function increment_and_start(){
    pomo_sequence_index ++;

    settings = cycle_at_index(pomo_sequence_index);

    let mode = settings['mode'];
    let time = settings['time'];

    let time_seconds = time * 60;

    set_sand_color(mode_colors(mode));

    startHourglassTimer(time_seconds);

    update_sidebar_schedule();

    const timerDisplay = document.getElementById('modeDisplay');

    timerDisplay.textContent = mode_text(mode);
}

function startHourglassTimer(duration) {

    clearInterval(timerInterval);

    isPaused = false;
    pauseButton.textContent = 'Pause';

    timer_duration = duration / (1 - 2 * .06); // To account for border

    timeRemaining = duration;
    startTime = (performance.now() / 1000);

    // Update timer display every second
    timerInterval = setInterval(() => {
        if (!isPaused) {

            elapsedTime = ((performance.now() / 1000) - startTime);

            timeRemaining = duration - elapsedTime;
            timerDisplay.textContent = formatTime(timeRemaining + 1);

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                update_sidebar_schedule();
                audio.play();

                hourglass.style.transform = 'rotate(180deg)';

                // Reset the sand animations mid-flip
                setTimeout(() => {
                    topSand.style.animation = 'none';
                    bottomSand.style.animation = 'none';

                    void topSand.offsetWidth; // Force reflow

                    topSand.style.height = '100%';
                    bottomSand.style.height = '0%';

                    // Instantly reset the flip for the next cycle
                    hourglass.style.transition = 'none';
                    hourglass.style.transform = 'rotate(0deg)';

                    // Re-enable transition for future flips
                    setTimeout(() => {
                        hourglass.style.transition = 'transform 1s ease-in-out';
                        increment_and_start();
                    }, 50);

                }, 1000); // Wait for flip animation to complete

                // Stop falling sand after the timer ends
                fallingSand.style.animation = 'none';
                fallingSand.style.opacity = 0;


            }
        }
    }, 100);

    // Reset animations
    topSand.style.animation = 'none';
    bottomSand.style.animation = 'none';
    fallingSand.style.animation = 'none';

    // Force reflow to restart animations
    void topSand.offsetWidth;

    // Start sand animations
    topSand.style.animation = `drainTop ${timer_duration}s linear forwards`;
    bottomSand.style.animation = `fillBottom ${timer_duration}s linear forwards`;
    fallingSand.style.animation = `fallSand 0.5s linear infinite`;

    topSand.style.animationDelay = `-${timer_duration * .06}s`;
    bottomSand.style.animationDelay = `-${timer_duration * .06}s`;
}

// Pause button functionality
pauseButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        pauseButton.textContent = 'Pause';

        // Resume animations
        // const remainingTopSand = parseFloat(getComputedStyle(topSand).height) / topSand.parentElement.clientHeight * 100;
        // const remainingBottomSand = parseFloat(getComputedStyle(bottomSand).height) / bottomSand.parentElement.clientHeight * 100;

        // Recalculate elapsed time for accuracy

        let right_now = performance.now() / 1000;

        startTime += right_now - pauseTime;

        elapsedTime = right_now - startTime;
        timeRemaining = timer_duration - elapsedTime;

        // Re-Enable animations
        topSand.style.animation = `drainTop ${timer_duration}s linear forwards`;
        bottomSand.style.animation = `fillBottom ${timer_duration}s linear forwards`;
        fallingSand.style.animation = `fallSand 0.5s linear infinite`;

        topSand.style.animationDelay = `-${timer_duration * .06}s`;
        bottomSand.style.animationDelay = `-${timer_duration * .06}s`;

    } else {

        pauseTime = performance.now() / 1000;

        isPaused = true;
        pauseButton.textContent = 'Resume';

        // Pause animations
        topSand.style.animationPlayState = 'paused';
        bottomSand.style.animationPlayState = 'paused';
        fallingSand.style.animationPlayState = 'paused';
    }
});


resetButton.addEventListener('click', () => {

    pomo_sequence_index --;

    resetButton.textContent = 'Reset';

    increment_and_start();
});


function formatTime(seconds) {

    if (seconds < 0) {
        seconds = 0;
    }

    seconds = Math.floor(seconds);

    let hrs_string = '';
    let min_string = '';
    if (Math.floor(seconds / 3600) > 0) { hrs_string = String(Math.floor(seconds / 3600)).padStart(2, '0') + ':' }
    if (Math.floor((seconds % 3600) / 60) > 0) { min_string = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0') + ':' }

    const secs = String(seconds % 60).padStart(2, '0');
    let output_string = hrs_string + min_string + secs;

    if (output_string.startsWith('0')) {
        output_string = output_string.slice(1);
    }

    return output_string;
}


// // Start a 10-second timer
// startHourglassTimer(10);

// document.addEventListener("DOMContentLoaded", (event) => {
//     increment_and_start();
//   });