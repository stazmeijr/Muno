export function formatProgresBar(position: number, duration: number): string {
  const total = 20;
  const progress = Math.round((position / duration) * total);
  const bar = "▬".repeat(progress) + "🔘" + "▬".repeat(total - progress);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const pad = (n: number) => n.toString().padStart(2, "0");
    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;
  };

  return `\`${formatTime(position)}\` ${bar} \`${formatTime(duration)}\``;
}