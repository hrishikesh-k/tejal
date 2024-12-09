export function resizeMasonry(masonry: HTMLDivElement, vw: number) {
  const columns = vw < 640 ? 1 : vw < 768 ? 2 : 3
  const gap = 24
  const columnHeights = new Array(columns).fill(0)
  const columnWidth = (masonry.clientWidth - (columns - 1) * gap) / columns

  for (const item of masonry.querySelectorAll('picture')) {
    const shortestColumnIndex = columnHeights.indexOf(
      Math.min(...columnHeights)
    )
    item.style.height = 'auto'
    item.style.position = 'absolute'
    item.style.width = `${columnWidth}px`
    item.style.top = `${columnHeights[shortestColumnIndex]}px`
    item.style.left = `${shortestColumnIndex * (columnWidth + gap)}px`
    columnHeights[shortestColumnIndex] += item.offsetHeight + gap
  }

  masonry.style.height = `${Math.max(...columnHeights)}px`
}
