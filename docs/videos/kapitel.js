for (const episode of document.querySelectorAll(".video-feature")) {
  const player = episode.querySelector(".learning-video");
  const chapters = player?.querySelector('track[kind="chapters"]');
  const list = episode.querySelector(".video-chapters");
  if (!chapters || !list) continue;

  function showChapters() {
    for (const cue of chapters.track.cues) {
      const seconds = Math.floor(cue.startTime);
      const time = Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = time + " · " + cue.text;
      button.addEventListener("click", () => {
        player.currentTime = cue.startTime;
        player.focus();
        player.play().catch(() => player.focus());
      });
      list.appendChild(document.createElement("li")).appendChild(button);
    }
    list.closest("details").hidden = list.childElementCount === 0;
  }

  if (chapters.readyState === HTMLTrackElement.LOADED) {
    showChapters();
  } else {
    chapters.addEventListener("load", showChapters, { once: true });
    chapters.track.mode = "hidden";
  }
}
