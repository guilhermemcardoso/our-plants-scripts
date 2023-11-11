export function capitalize(specie) {
  const words = specie.split(' ')

  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1)
    })
    .join(' ')
}
